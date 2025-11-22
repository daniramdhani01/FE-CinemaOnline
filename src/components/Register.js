import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, FormControl, Alert, Form, Spinner } from 'react-bootstrap';
import '../style/style.css';
import { UserContext } from '../context/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerRequest } from '../config/services';
import { QUERY_KEYS } from '../config/queryKeys';
import { sanitizeInput, validateEmail, validatePassword, checkRateLimit, recordFailedLogin } from '../helper';

export default function Register(props) {
    const { show, onHide } = props
    const navigate = useNavigate()
    const [, dispatch] = useContext(UserContext)
    const { setmodalregister, setmodallogin } = props
    const queryClient = useQueryClient()

    const registerMutation = useMutation({
        mutationFn: registerRequest,
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
        fullname: '',
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

            if (!form.fullname || form.fullname.trim().length < 2) {
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Please enter a valid full name (at least 2 characters)
                    </Alert>
                );
                setMessage(alert);
                return;
            }

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

            const response = await registerMutation.mutateAsync(form);

            if (response.status === 'success') {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data.user,
                })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TRANSACTIONS });
                const alert = (
                    <Alert variant="success" className="py-1 text-center">
                        Your account has been created successfully
                    </Alert>
                );
                setMessage(alert);

                navigate('/')
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
                    Failed! Registration error occurred
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
                    <Modal.Title className='mb-4 fs-2 fc-pink'>Register</Modal.Title>
                    {message && message}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <FormControl
                                placeholder='Full Name'
                                name='fullname'
                                type="text"
                                className="placeholder-edit"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <FormControl
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
                            disabled={registerMutation.isPending || passwordErrors.length > 0 || emailError}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </Button>

                        {rateLimitError && (
                            <Alert variant="warning" className="py-2 text-center small">
                                {rateLimitError}
                            </Alert>
                        )}

                        <div className="d-flex justify-content-center mb-2">
                            Already have an account ?  Klik
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
