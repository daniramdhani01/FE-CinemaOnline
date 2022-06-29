import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Modal, InputGroup, FormControl, Form, Alert } from 'react-bootstrap'
import '../style/style.css'
import { UserContext } from '../context/userContext';
import { API } from '../config/api';

//import image & icon
import attach from '../assets/icons/attach.svg'

export default function Buy(props) {
    const { show, onHide } = props
    const navigate = useNavigate()
    const { setmodalregister, setmodallogin, idfilm, titlefilm, pricefilm } = props

    const [message, setMessage] = useState(null);
    const [state] = useContext(UserContext)
    const [preview, setPreview] = useState(null); //For image preview
    const [form, setForm] = useState({
        idFilm: '',
        image: '',
        accountNum: '',
    });


    const handleChange = (e) => {
        setForm({
            ...form,
            idFilm: idfilm,
            [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
        })

        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    }
    // console.log(form)
    const handleSubmit = async (e) => {

        try {
            e.preventDefault();

            // Create Configuration Content-type here ...
            // Content-type: application/json
            const config = {
                headers: {
                    Authorization: "Bearer " + localStorage.token,
                    'Content-type': 'application/json',
                },
            };

            // Convert form data to string here ...
            const formData = new FormData()

            if (form.image[0]) {
                formData.set('image', form.image[0], form.image[0].name)
            }
            formData.set('idFilm', form.idFilm)
            formData.set('accountNum', form.accountNum)

            // Insert data user to database here ...
            const response = await API.post('/transac/' + state.user.id, formData, config);

            // Notification
            if (response.data.status == 'success') {
                const alert = (
                    <Alert variant="success" className="py-1 text-center">
                        success
                    </Alert>
                );
                setMessage(alert);
                // navigate('/detail-film/' + form.idFilm)
                navigate('/profile')
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
            <Modal show={show} onHide={onHide} centered size='md'>
                <Modal.Body className='rounded-3 bg-modal '>
                    <Modal.Title className='mb-4 text-center' style={{ fontSize: 24 }}>
                        Cinema<span className='text-pink'>Online</span> : 0981312323
                    </Modal.Title>
                    <div className='mb-2' style={{ fontSize: 24 }}>
                        {titlefilm}
                    </div>
                    <div className='mb-3' style={{ fontSize: 18 }}>
                        Total : <span className='text-pink'>{pricefilm}</span>
                    </div>
                    {message && message}
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <FormControl
                                aria-describedby="inputGroup-sizing-default"
                                placeholder='Input Your Account Number'
                                name='accountNum'
                                // type='number'
                                className="placeholder-edit"
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Form.Group controlId='uploadImage'>
                            <div className=''>
                                <Form.Label className='btn btn-pink text-white' style={{ width: '36%' }}>Attach Payment <img src={attach} /></Form.Label>
                                <span style={{ fontSize: 12, color: '#616161', marginLeft: 10 }}> *transfers can be made to holyways accounts</span>
                            </div>
                            <Form.Control type='file' name='image' hidden onChange={handleChange} />
                            {preview ? preview.slice(-5) == '/null' ? '' :
                                preview && (
                                    <div className='mb-4 mt-2 w-100 text-center'>
                                        <img
                                            src={preview}
                                            style={{
                                                maxWidth: '150px',
                                                maxHeight: '150px',
                                                objectFit: 'cover',
                                                boxShadow: '0px 0px 5px 3px #CD2E71',
                                                borderRadius: 5,
                                            }}
                                        // alt="preview"
                                        />
                                    </div>
                                ) : <div className='mb-4'></div>}
                        </Form.Group>
                        <Button type='submit' variant="btn btn-pink" className='w-100 mb-3'>
                            Pay
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}