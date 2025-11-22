import { useState, useContext } from 'react';
import { Button, Modal, InputGroup, FormControl, Alert, Form, Spinner } from 'react-bootstrap';
import '../style/style.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest } from '../config/services';
import { QUERY_KEYS } from '../config/queryKeys';

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

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const response = await loginMutation.mutateAsync(form);

            if (response.status === 'success') {
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
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Failed! {response.message}
                    </Alert>
                );
                setMessage(alert);
            }

        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1 text-center">
                    Failed!
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
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Email'
                                name='email'
                                type='email'
                                className=" placeholder-edit"
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Password'
                                name='password'
                                className="placeholder-edit"
                                type='password'
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Button
                            type='submit'
                            variant="btn btn-pink"
                            className='w-100 mb-3'
                            disabled={loginMutation.isLoading}
                        >
                            {loginMutation.isLoading ? (
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
