import ReactPlayer from 'react-player'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API } from '../config/api'
import { UserContext } from '../context/userContext'
import { Modal, Button } from 'react-bootstrap';


//import components
import Header from "../components/Header"
import Buy from '../components/Buy'
import Login from '../components/Login'
import Register from '../components/Register'

function ModalAlert(props) {
    const { status } = props
    return (
        <Modal {...props} centered size='md' className='text-center' style={{ color: '#469F74' }}>
            <Modal.Body>
                {status == 'Pending' ?
                    'thank you for buying this film, please wait 1x24 hours because your transaction is in process'
                    :
                    'Please buy this film if you want to watch'
                }
            </Modal.Body>
        </Modal>
    )
}


export default function DetailFilm() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [state] = useContext(UserContext)
    const [status, setStatus] = useState('-')
    const [modalAlert, setModalAlert] = useState(false)

    const [buyModal, setbuymodal] = useState(false)
    const [modalRegister, setmodalregister] = useState(false)
    const [modalLogin, setmodallogin] = useState(false)

    const [film, setFilm] = useState({
        category: '',
        createdAt: '',
        desc: '',
        id: '',
        link: '',
        price: '',
        thumbnail: '',
        title: '',
        updatedAt: '',
    })

    const getFilm = () => {
        API.get('/detail-film/' + id)
            .then((res) => {
                const response = res.data.data
                setFilm(response.film)
                setStatus(state.user.isAdmin ? "Approved" : response.status)
            }).catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getFilm()
    }, [state])

    const handleDelete = () => {
        API.get('/film-delete/' + film.id)
            .then(()=>navigate('/'))
            .catch((err) => { console.log(err) })
    }

    // console.log(film)
    return (
        <>
            <Header />

            {/* Poster */}
            <div className='d-flex mt-5'>
                <div className='col-3'>
                    <img src={film.thumbnail} className='img-fluid w-100' />
                </div>

                {/* Detail Film */}
                <div className='col-9 ps-5'>
                    <div className='d-flex'>
                        <div className='w-75'>
                            <h1>{film.title}</h1>
                        </div>
                        {(status == '-' || status == 'Rejected') ?
                            <div className='w-25 d-flex justify-content-end'>
                                <button type="button" className="btn-pink"
                                    onClick={state.isLogin ? () => setbuymodal(true) : () => setmodallogin(true)}>
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
                                    setmodalregister={setmodalregister} />

                                <Login
                                    show={modalLogin}
                                    buyModal={setbuymodal}
                                    onHide={() => setmodallogin(false)}
                                    setmodallogin={setmodalregister}
                                    setmodalregister={setmodallogin}
                                />
                            </div> :
                            <></>
                        }
                        {!state.user.isAdmin ? <></> :
                            <div className='w-25 d-flex justify-content-end'>
                                <button type="button" className="btn-pink" onClick={handleDelete}>Delete</button>
                            </div>
                        }
                    </div>
                    <div style={{ position: 'relative' }}>
                        <ReactPlayer width='100%' height='350px'
                            url={film.link} light={true}
                        />
                        {status != 'Approved' ?
                            <>
                                <div className='btn w-100' onClick={() => setModalAlert(true)}
                                    style={{ height: 350, position: 'absolute', top: 0, zIndex: '1' }}>
                                </div>
                                <ModalAlert show={modalAlert} onHide={() => setModalAlert(false)} status={status} />
                            </>
                            : ''
                        }
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
    )
}