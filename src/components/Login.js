import { useState, useContext } from 'react';
import { Button, Modal, InputGroup, FormControl, Alert, Form, Spinner, ListGroup } from 'react-bootstrap';
import '../style/style.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../config/services';
import { QUERY_KEYS } from '../config/queryKeys';
import { sanitizeInput, validateEmail, validatePassword, checkRateLimit, recordFailedLogin, recordSuccessfulLogin } from '../helper';

export default function Login(props) {
    const { show, onHide } = props
    const { setmodalregister, setmodallogin } = props
    const [, dispatch] = useContext(UserContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const loginMutation = useMutation({
        mutationFn: loginRequest,
    })

    const handleOpenModal = () => {
        setmodalregister(false)
        setmodallogin(true)
    }

    const [message, setMessage] = useState(null);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [emailError, setEmailError] = useState('');
    const [rateLimitError, setRateLimitError] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setForm({
            ...form,
            [e.target.name]: sanitizedValue,
        });

        // Real-time validation
        if (e.target.name === 'email') {
            const isValidEmail = validateEmail(sanitizedValue);
            setEmailError(isValidEmail ? '' : 'Please enter a valid email address');
        } else if (e.target.name === 'password') {
            const validation = validatePassword(sanitizedValue);
            setPasswordErrors(validation.errors);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            // Check rate limiting
            const rateLimit = checkRateLimit();
            if (!rateLimit.allowed) {
                setRateLimitError(rateLimit.message);
                const alert = (
                    <Alert variant="warning" className="py-1 text-center">
                        {rateLimit.message}
                    </Alert>
                );
                setMessage(alert);
                return;
            }

            // Validate form inputs
            const isEmailValid = validateEmail(form.email);
            const passwordValidation = validatePassword(form.password);

            if (!isEmailValid) {
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Please enter a valid email address
                    </Alert>
                );
                setMessage(alert);
                return;
            }

            if (!passwordValidation.isValid) {
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Password does not meet security requirements
                    </Alert>
                );
                setMessage(alert);
                return;
            }

            const response = await loginMutation.mutateAsync(form);

            if (response.status === 'success') {
                recordSuccessfulLogin();
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.user,
                })
                const nextRoute = response.data.user.isAdmin ? "/list-transaction" : "/"
                navigate(nextRoute)
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TRANSACTIONS });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_FILMS });
                const alert = (
                    <Alert variant="success" className="py-1 text-center">
                        Login success
                    </Alert>
                );
                setMessage(alert);
            } else {
                recordFailedLogin();
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Failed! {response.message}
                    </Alert>
                );
                setMessage(alert);
            }

        } catch (error) {
            recordFailedLogin();
            const alert = (
                <Alert variant="danger" className="py-1 text-center">
                    Failed! Invalid email or password
                </Alert>
            );
            setMessage(alert);
            console.log(error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size='sm'>
                <Modal.Body className='rounded-3 bg-modal '>
                    <Modal.Title className='mb-4 fs-2 fc-pink'>Login</Modal.Title>
                    {message && message}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Email'
                                name='email'
                                type='email'
                                className={`placeholder-edit ${emailError ? 'is-invalid' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            {emailError && (
                                <Form.Text className="text-danger">
                                    {emailError}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Password'
                                name='password'
                                className={`placeholder-edit ${passwordErrors.length > 0 ? 'is-invalid' : ''}`}
                                type='password'
                                onChange={handleChange}
                                required
                            />
                            {passwordErrors.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">Password must contain:</small>
                                    <ul className="text-danger small mt-1 mb-0">
                                        {passwordErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </Form.Group>

                        <Button
                            type='submit'
                            variant="btn btn-pink"
                            className='w-100 mb-3'
                            disabled={loginMutation.isPending || passwordErrors.length > 0 || emailError}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>

                        {rateLimitError && (
                            <Alert variant="warning" className="py-2 text-center small">
                                {rateLimitError}
                            </Alert>
                        )}

                        <div className="d-flex justify-content-center mb-2">
                            Don't have an account ? Klik
                            <button
                                type="button"
                                className='ms-1 text-white font-weight-bolder fw-bolder'
                                onClick={handleOpenModal}
                                style={{ background: 'transparent', border: 'none', padding: 0 }}
                            >
                                Here
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
