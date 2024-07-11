import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../context/userContext';
import { API } from '../config/api'

//import page
import Header from '../components/Header'

//import pic
import user from '../assets/icons/user.svg'


export default function Profile() {
    const title = 'Profile'
    document.title = title + ' | Cinema Online'

    const [state] = useContext(UserContext)
    const [film, setFilm] = useState([{
        film: {
            thumbnail: '',
            id: '',
            price: '',
            createdAt: '',
        },
    }])
    const [profile, setProfile] = useState({
        id: '',
        fullname: '',
        email: '',
        phone: '',
        image: '',
        isAdmin: '',
    })
    // const [history, setHistory] = useState()

    const getProfile = () => {
        try {
            API.get('/transac')
            .then((res) => setFilm(res.data.data.transac))

            API.get('/user')
                .then((res) => setProfile(res.data.data.user))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProfile()

        return () => {

            setFilm([{
                film: {
                    thumbnail: '',
                    id: '',
                    price: '',
                    createdAt: '',
                },
            }])

            setProfile({
                id: '',
                fullname: '',
                email: '',
                phone: '',
                image: '',
                isAdmin: '',
            })
        }
    }, [])

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = (day) => {
        const d = new Date(day)
        return (weekday[d.getDay()])
    }
    const date = (day) => {
        const d = new Date(day)
        return (d.getDate() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear())
    }
    return (
        <>
            <Header />

            {/* container */}
            <div className='d-flex mt-5' style={{ paddingLeft: '7.5%', paddingRight: '7.5%' }}>
                <div className='col-7'>
                    <div className='fs-36 fw-bold'>My Profile</div >
                    <div className='d-flex mt-4'>
                        {profile.image.slice(-4) == 'null' ?
                            <img src={user} style={{ width: 200 }} />
                            :
                            <img src={profile.image} style={{ width: 200 }} />
                        }
                        <div className='ps-4'>
                            <div className='t-pink-f18'>
                                Full Name
                            </div>
                            <div className='t-grey-f18 mb-3'>
                                {profile.fullname}
                            </div>
                            <div className='t-pink-f18'>
                                Email
                            </div>
                            <div className='t-grey-f18 mb-3'>
                                {profile.email}
                            </div>
                            <div className='t-pink-f18'>
                                Phone
                            </div>
                            <div className='t-grey-f18 mb-3'>
                                {profile.phone ? profile.phone : '-'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-100'>
                    <div className='fs-36 fw-bold mb-4'>
                        History Transaction
                    </div>
                    {/* data here */}
                    {!film[0]?.id ? <></> : film.map((item, index) => {
                        return (
                            <div className='p-3 mb-3' style={{ background: 'rgba(205, 46, 113, 0.44)' }} key={index}>
                                <div className='fs-14'>
                                    {item.film.title}
                                </div>
                                <div className=''>

                                    <span className='fs-12'>{day(item.createdAt)}, </span>{/* day */}
                                    <span className='fs-12'>{date(item.createdAt)}</span>
                                </div>
                                <div className='d-flex'>
                                    <div className='text-pink fs-12' style={{ width: '210%' }}>
                                        Total : {item.film.price}
                                    </div>
                                    {item.status == 'Approved' ?
                                        <div className='w-100 status-finished'>
                                            Finished
                                        </div>
                                        : item.status == 'Pending' ?
                                            <div className='w-100 bg-warning text-white status-finished'>
                                                Pending
                                            </div>
                                            :
                                            <div className='w-100 bg-danger text-white status-finished'>
                                                Rejected
                                            </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                    {/* end of data */}
                </div>
            </div>
        </>
    )
}