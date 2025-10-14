import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Alert } from "react-bootstrap";
import { useMutation, useQueryClient } from '@tanstack/react-query';

//import components
import Header from "../components/Header";

//import icon
import attach from '../assets/icons/attach1.svg';
import { createFilmRequest } from '../config/services';
import { QUERY_KEYS } from '../config/queryKeys';

export default function AddFilm() {
  const title = 'Add Film';
  document.title = title + ' | Cinema Online';

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null); //For image preview
  const [form, setForm] = useState({
    title: '',
    thumbnail: '',
    poster: '',
    category: '',
    price: '',
    link: '',
    desc: '',
  });

  const queryClient = useQueryClient();
  const { mutateAsync: createFilm, isLoading } = useMutation({
    mutationFn: createFilmRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILMS });
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === 'file') {
      if (e.target.files[0].type?.includes("image") === false) return;

      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      if (form.thumbnail[0]) {
        formData.set('thumbnail', form.thumbnail[0], form.thumbnail[0].name);
      }
      if (form.poster[0]) {
        formData.set('poster', form.poster[0], form.poster[0].name);
      }
      formData.set('title', form.title);
      formData.set('category', form.category);
      formData.set('price', form.price);
      formData.set('link', form.link);
      formData.set('desc', form.desc);

      const response = await createFilm(formData);

      if (response.status === 'success') {
        const alert = (
          <Alert variant="success" className="py-1 text-center">
            success
          </Alert>
        );
        setMessage(alert);

        navigate(`/detail-film/${response.data.film.id}`);
      } else {
        const alert = (
          <Alert variant="danger" className="py-1 text-center">
            Failed! {response.message}
          </Alert>
        );
        setMessage(alert);
      }
    } catch (err) {
      const alert = (
        <Alert variant="danger" className="py-1 text-center">
          Failed! {err.response?.data?.message}
        </Alert>
      );
      setMessage(alert);
    }
  };

  return (
    <>
      <Header isAdmin />
      <div className='' style={{ paddingLeft: '7%', paddingRight: '7%' }}>
        <div className="mt-2 mb-4" style={{ fontSize: 24 }}>
          Add Film
        </div>
        <Form onSubmit={handleSubmit}>
          <div className='d-flex'>
            <Form.Group className="w-50 mb-3">
              <Form.Control
                className="placeholder-edit"
                as="input"
                name='title'
                onChange={handleChange}
                placeholder='Title'
              />
            </Form.Group>
            <Form.Group controlId='poster' className='w-25 ps-3'>
              <Form.Label className='btn d-flex justify-content-center align-items-center text-secondary'
                style={{
                  background: 'rgba(210, 210, 210, 0.25)',
                  border: '1px solid #D2D2D2',
                  boxSizing: 'border-box',
                  borderRadius: 5,
                  height: 40
                }}>
                Attach Poster <img src={attach} className='ms-3 img-fluid' alt="poster" />
              </Form.Label>
              <Form.Control type='file' name='poster' hidden onChange={handleChange} accept='image/*' />
            </Form.Group>
            <Form.Group controlId='thumbnail' className='w-25 ps-3'>
              <Form.Label className='btn d-flex justify-content-center align-items-center text-secondary'
                style={{
                  background: 'rgba(210, 210, 210, 0.25)',
                  border: '1px solid #D2D2D2',
                  boxSizing: 'border-box',
                  borderRadius: 5,
                  height: 40
                }}>
                Attach Thumbnail <img src={attach} className='ms-3 img-fluid' alt="thumbnail" />
              </Form.Label>
              <Form.Control type='file' name='thumbnail' hidden onChange={handleChange} accept='image/*' />
            </Form.Group>
          </div>
          {preview && preview.slice(-5) !== '/null' ? (
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
                alt="preview"
              />
            </div>
          ) : null}
          <Form.Group className="w-100 mb-3">
            <Form.Control
              className="placeholder-edit"
              as="input"
              name='category'
              onChange={handleChange}
              placeholder='Category'
            />
          </Form.Group>
          <Form.Group className="w-100 mb-3">
            <Form.Control
              className="placeholder-edit"
              as="input"
              name='price'
              type='number'
              onChange={handleChange}
              placeholder='Price'
            />
          </Form.Group>
          <Form.Group className="w-100 mb-3">
            <Form.Control
              className="placeholder-edit"
              as="input"
              name='link'
              onChange={handleChange}
              placeholder='Link Film'
            />
          </Form.Group>
          <Form.Group className="w-100 mb-4">
            <Form.Control
              className="placeholder-edit"
              as="textarea"
              name='desc'
              rows={5}
              onChange={handleChange}
              placeholder='Description'
            />
          </Form.Group>
          {message && message}
          <button
            type="submit"
            className="btn-pink my-4 w-25"
            style={{ marginLeft: '75%' }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Add Film'}
          </button>
        </Form>
      </div>
    </>
  );
}
