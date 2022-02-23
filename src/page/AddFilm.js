import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Form, Alert } from "react-bootstrap";

//import components
import Header from "../components/Header";

//import icon
import attach from '../assets/icons/attach1.svg'
import { API } from '../config/api';

export default function AddFilm() {
    const title = 'Add Film'
    document.title = title + ' | Cinema Online'

    const navigate = useNavigate()
    const [message, setMessage] = useState(null);
    const [preview, setPreview] = useState(null); //For image preview
    const [form, setForm] = useState({
        title: '',
        thumbnail: '',
        category: '',
        price: '',
        link: '',
        desc: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
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
                    'Content-Type': 'application/json',
                },
            };

            // Create store data with FormData as object here ...
            const formData = new FormData()

            if (form.thumbnail[0]) {
                formData.set('thumbnail', form.thumbnail[0], form.thumbnail[0].name)
            }
            formData.set('title', form.title)
            formData.set('category', form.category)
            formData.set('price', form.price)
            formData.set('link', form.link)
            formData.set('desc', form.desc)

            const response = await API.post('/film', formData, config)

            // console.log(response.data.data.film.id)

            if (response.data.status == 'success') {
                const alert = (
                    <Alert variant="success" className="py-1 text-center">
                        success
                    </Alert>
                );
                setMessage(alert);

                navigate('/detail-film/' + response.data.data.film.id)
                // setInterval(() => {
                // }, 1000)

            } else {
                const alert = (
                    <Alert variant="danger" className="py-1 text-center">
                        Failed! {response.data.message}
                    </Alert>
                );
                setMessage(alert);
            }
            // navigate('/detail-film/' +)
        } catch (err) {
            const alert = (
                <Alert variant="danger" className="py-1 text-center">
                    Failed!
                </Alert>
            );
            setMessage(alert);
            console.log(err);
        }
    }

    return (
        <>
            <Header isAdmin={true} />
            <div className='' style={{ paddingLeft: '7%', paddingRight: '7%' }}>
                <div className="mt-2 mb-4" style={{ fontSize: 24 }}>
                    Add Film
                </div>
                <Form onSubmit={handleSubmit}>
                    <div className='d-flex'>
                        <Form.Group className="w-75 mb-3">
                            <Form.Control
                                className="placeholder-edit"
                                as="input"
                                name='title'
                                // value={form.fullName}
                                onChange={handleChange}
                                placeholder='Title' />
                        </Form.Group>
                        <Form.Group controlId='uploadImage' className='w-25 ps-3'>
                            <Form.Label className='btn d-flex justify-content-center align-items-center text-secondary'
                                style={{
                                    background: 'rgba(210, 210, 210, 0.25)',
                                    border: '1px solid #D2D2D2',
                                    boxSizing: 'border-box',
                                    borderRadius: 5,
                                    height: 40
                                }}>
                                Attach Thumbnail <img src={attach} className='ms-3 img-fluid' /></Form.Label>
                            <Form.Control type='file' name='thumbnail' hidden onChange={handleChange} />
                        </Form.Group>
                    </div>
                    {preview ? preview.slice(-5) == '/null' ? '' :
                        preview && (
                            <div className='text-center mb-3 w-100'>
                                <img
                                    src={preview}
                                    className='rounded'
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '250px',
                                        objectFit: 'cover',
                                        boxShadow: '0px 0px 5px 3px #CD2E71',
                                    }}
                                // alt="preview"
                                />
                            </div>
                        ) : ''}
                    <Form.Group className="w-100 mb-3">
                        <Form.Control
                            className="placeholder-edit"
                            as="input"
                            name='category'
                            // value={form.fullName}
                            onChange={handleChange}
                            placeholder='Category' />
                    </Form.Group>
                    <Form.Group className="w-100 mb-3">
                        <Form.Control
                            className="placeholder-edit"
                            as="input"
                            name='price'
                            type='number'
                            // value={form.fullName}
                            onChange={handleChange}
                            placeholder='Price' />
                    </Form.Group>
                    <Form.Group className="w-100 mb-3">
                        <Form.Control
                            className="placeholder-edit"
                            as="input"
                            name='link'
                            // value={form.fullName}
                            onChange={handleChange}
                            placeholder='Link Film' />
                    </Form.Group>
                    <Form.Group className="w-100 mb-4">
                        <Form.Control
                            className="placeholder-edit"
                            as="textarea"
                            name='desc'
                            rows={5}
                            // value={form.fullName}
                            onChange={handleChange}
                            placeholder='Description' />
                    </Form.Group>
                    {message && message}
                    <button type="submit" className="btn-pink my-4 w-25" style={{ marginLeft: '75%' }}>Add Film</button>
                </Form>
            </div>
        </>
    )
}