import { Container } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { API } from "../config/api"
import { useEffect, useState, useContext } from "react"
import { UserContext } from '../context/userContext';

//import page
import Header from '../components/Header'


export default function MylistFilm() {
    const title = 'My List Film'
    document.title = title + ' | Cinema Online'

    const [state] = useContext(UserContext)
    const [film, setFilm] = useState([{
        film: {
            thumbnail: '',
            id: '',
        },
    }])

    const getMyList = () => {
        API.get('/film/' + state.user.id)
            .then((res) => setFilm(res.data.data.mylist))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getMyList()
    }, [state])
    return (
        <>
            <Header />

            <div className='mt-5'>
                <div className='fs-36 w-100 fw-bold' style={{ paddingLeft: '7.5%', paddingRight: '7.5%' }}>My List Film</div >
                <Container className='mt-3 d-flex flex-wrap'>
                    {film.map((item, index) => {
                        return (
                            <div className='col-2 p-2' key={index}>
                                <Link to={'/detail-film/' + item.film.id} >
                                    <img src={item.film.thumbnail} className='rounded img-fluid' />
                                </Link>
                            </div>
                        )
                    })}
                </Container>
            </div>
        </>
    )
}