import { API } from "../config/api"
import { Container } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import ReactPlayer from 'react-player'

//import components
import Header from "../components/Header"
import Buy from '../components/Buy'
import Login from '../components/Login'
import Register from '../components/Register'

export default function LandingPage() {

    document.title = 'Cinema Online'

    const navigate = useNavigate()
    const [state] = useContext(UserContext)
    const [buyModal, setbuymodal] = useState(false)
    const [modalRegister, setmodalregister] = useState(false)
    const [modalLogin, setmodallogin] = useState(false)
    const [film, setFilm] = useState([{
        category: '',
        createdAt: '',
        desc: '',
        id: '',
        link: '',
        price: '',
        thumbnail: '',
        poster: '',
        title: '',
        updatedAt: '',
    }])

    const getFilm = () => {
        API.get('/film')
            .then((res, req) => {
                const response = res.data.data.film
                setFilm(response)
            }).catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getFilm()

        return () => {
            setFilm([{
                category: '',
                createdAt: '',
                desc: '',
                id: '',
                link: '',
                price: '',
                thumbnail: '',
                poster: '',
                title: '',
                updatedAt: '',
            }])
        }
    }, [])

    // console.log(state)
    return (
        <>
            <Header />
            {film[0] ?
                <>
                    {/* poster here */}
                    <div className="poster-container my-4 d-flex justify-content-center">
                        <img src={film[0].poster} style={{ width: 1000, height: 370, objectFit: 'cover' }} />
                        <div className="poster-caption">
                            <h1 className="mb-3">
                                <div style={{ color: ' #A52620' }}>{film[0].title}</div>
                            </h1>
                            <h5>
                                {film[0].category}
                            </h5>
                            <h5 style={{ color: '#CD2E71' }}>
                                {film[0].price}
                            </h5>
                            <div className="poster-desc">
                                {film[0].desc}
                            </div>

                            <button type="button" className="btn-pink mt-4"
                                onClick={state.isLogin ? () => setbuymodal(true) : () => setmodallogin(true)}
                            >
                                Buy Now</button>
                            <Buy
                                show={buyModal}
                                onHide={() => setbuymodal(false)}
                                idfilm={film[0].id}
                                buyModal={setbuymodal}
                                setmodallogin={setmodallogin}
                                setmodalregister={setmodalregister}
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
                    </div>

                    {/* list film here */}
                    <div className='mb-3'>
                        <h5>
                            List Film
                        </h5>
                        <Container className='mt-3 d-flex flex-wrap'>
                            {film && film.map((item, index) => {
                                return (
                                    <div className='col-2 p-2' key={item.id} style={{ height: 225 }} >
                                        <button
                                            onClick={() => navigate('/detail-film/' + item.id)}
                                            style={{ background: 'unset', border: 'unset' }}>
                                            <img src={item.thumbnail} className='rounded img-fluid' style={{ maxHeight: 225, objectFit: 'cover' }} />
                                        </button>
                                    </div>
                                )
                            })}
                        </Container>
                    </div>
                </>
                :
                <div className='d-flex align-items-center justify-content-center' style={{ height: '80vh', }}>
                    <h4>No Data Found</h4>
                </div>}
        </>
    )
}