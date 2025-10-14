import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, InputGroup, FormControl, Alert, Form } from 'react-bootstrap';
import '../style/style.css';
import { UserContext } from '../context/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerRequest } from '../config/services';
import { QUERY_KEYS } from '../config/queryKeys';

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

    const [form, setForm] = useState({
        email: '',
        fullname: '',
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
                        Your account has been create
                    </Alert>
                );
                setMessage(alert);

                navigate('/')
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
                    <Modal.Title className='mb-4 fs-2 fc-pink'>Register</Modal.Title>
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
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Full name'
                                name='fullname'
                                className="placeholder-edit"
                                type="text"
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Button type='submit' variant="btn btn-pink" className='w-100 mb-3'>
                            Register
                        </Button>
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
