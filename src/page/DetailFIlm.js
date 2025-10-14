import ReactPlayer from 'react-player';
import { useContext, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { Modal } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//import components
import Header from "../components/Header";
import Buy from '../components/Buy';
import Login from '../components/Login';
import Register from '../components/Register';
import { QUERY_KEYS } from '../config/queryKeys';
import { deleteFilmRequest, fetchFilmDetail } from '../config/services';

function ModalAlert(props) {
  const { status } = props;
  return (
    <Modal {...props} centered size='md' className='text-center' style={{ color: '#469F74' }}>
      <Modal.Body>
        {status === 'Pending'
          ? 'thank you for buying this film, please wait 1x24 hours because your transaction is in process'
          : 'Please buy this film if you want to watch'}
      </Modal.Body>
    </Modal>
  );
}

const defaultFilm = {
  category: '',
  createdAt: '',
  desc: '',
  id: '',
  link: '',
  price: '',
  thumbnail: '',
  title: '',
  updatedAt: '',
};

export default function DetailFilm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state] = useContext(UserContext);
  const [modalAlert, setModalAlert] = useState(false);

  const [buyModal, setbuymodal] = useState(false);
  const [modalRegister, setmodalregister] = useState(false);
  const [modalLogin, setmodallogin] = useState(false);

  const { data: detailData } = useQuery({
    queryKey: QUERY_KEYS.FILM_DETAIL(id),
    queryFn: () => fetchFilmDetail(id),
    enabled: Boolean(id),
  });

  const film = useMemo(() => detailData?.film ?? defaultFilm, [detailData]);
  const status = state.user?.isAdmin ? 'Approved' : detailData?.status ?? '-';
  console.log('daniw',state.user, detailData)

  const queryClient = useQueryClient();
  const deleteFilmMutation = useMutation({
    mutationFn: deleteFilmRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILMS });
      navigate('/');
    },
  });

  const handleDelete = () => {
    if (!film.id) return;
    deleteFilmMutation.mutate(film.id);
  };

  return (
    <>
      <Header />

      {/* Poster */}
      <div className='d-flex mt-5'>
        <div className='col-3'>
          <img src={film.thumbnail} className='img-fluid w-100' alt={film.title} />
        </div>

        {/* Detail Film */}
        <div className='col-9 ps-5'>
          <div className='d-flex'>
            <div className='w-75'>
              <h1>{film.title}</h1>
            </div>
            {(status === '-' || status === 'Rejected') ? (
              <div className='w-25 d-flex justify-content-end'>
                <button
                  type="button"
                  className="btn-pink"
                  onClick={state.isLogin ? () => setbuymodal(true) : () => setmodallogin(true)}
                >
                  Buy Now
                </button>
                <Buy
                  show={buyModal}
                  onHide={() => setbuymodal(false)}
                  idfilm={film.id}
                  titlefilm={film.title}
                  pricefilm={film.price}
                />
                <Register
                  show={modalRegister}
                  onHide={() => setmodalregister(false)}
                  buyModal={setbuymodal}
                  setmodallogin={setmodallogin}
                  setmodalregister={setmodalregister}
                />

                <Login
                  show={modalLogin}
                  buyModal={setbuymodal}
                  onHide={() => setmodallogin(false)}
                  setmodallogin={setmodalregister}
                  setmodalregister={setmodallogin}
                />
              </div>
            ) : null}
            {state.user?.isAdmin ? (
              <div className='w-25 d-flex justify-content-end'>
                <button
                  type="button"
                  className="btn-pink"
                  onClick={handleDelete}
                  disabled={deleteFilmMutation.isLoading}
                >
                  {deleteFilmMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ) : null}
          </div>
          <div style={{ position: 'relative' }}>
            <ReactPlayer
              width='100%'
              height='350px'
              url={film.link}
              light
            />
            {status !== 'Approved' ? (
              <>
                <div
                  className='btn w-100'
                  onClick={() => setModalAlert(true)}
                  style={{ height: 350, position: 'absolute', top: 0, zIndex: '1' }}
                />
                <ModalAlert show={modalAlert} onHide={() => setModalAlert(false)} status={status} />
              </>
            ) : null}
          </div>

          <div className='py-2' style={{ color: '#7E7E7E', fontSize: 24 }}>
            {film.category}
          </div>
          <div className='' style={{ color: '#CD2E71', fontSize: 18 }}>
            {film.price}
          </div>
          <p className='py-2' style={{ fontSize: 18, lineHeight: 2 }}>
            {film.desc}
          </p>
        </div>
      </div>
    </>
  );
}
