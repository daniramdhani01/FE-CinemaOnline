import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Modal, InputGroup, FormControl, Alert, Form } from 'react-bootstrap'
import '../style/style.css'
import { UserContext } from '../context/userContext';
import { API } from '../config/api';

export default function Login(props) {
    const navigate = useNavigate()
    const { setmodalregister, setmodallogin } = props
    const [state, dispatch] = useContext(UserContext)

    const handleOpenModal = () => {
        setmodalregister(false)
        setmodallogin(true)
    }

    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            // Create Configuration Content-type here ...
            // Content-type: application/json
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Convert form data to string here ...
            const body = JSON.stringify(form);

            // Insert data user to database here ...
            const response = await API.post('/login', body, config);
            // console.log(response.data.data.user)

            // Notification
            if (response.data.status == 'success') {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data.user,
                })
                const alert = (
                    <Alert variant="success" className="py-1 text-center">
                        Login success
                    </Alert>
                );
                setMessage(alert);

                // setInterval(() => {
                //     navigate('/')
                // }, 1000)

            } else {
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Failed! {response.data.message}
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
            <Modal {...props} centered size='sm'>
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
                        <Button type='submit' variant="btn btn-pink" className='w-100 mb-3'>
                            Login
                        </Button>
                        <div className="d-flex justify-content-center mb-2">
                            Don't have an account ? Klik <a className='ms-1 text-white font-weight-bolder fw-bolder' onClick={handleOpenModal}> Here </a>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}