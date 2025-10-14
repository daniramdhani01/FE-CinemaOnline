import { UserContext } from '../context/userContext'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, } from 'react-bootstrap'
import '../style/style.css'

//import components
import Register from './Register'
import Login from './Login'

//import icons and pic
import clapperboard from '../assets/icons/clapperboard.svg'
import addfilmIcon from '../assets/icons/addfilmIcon.svg' //addfilmIcon for admin
import logout from '../assets/icons/logout.svg'
import user from '../assets/icons/user.svg'
import zain from '../assets/dummyPic/zain.png'
import Icon from '../assets/icons/Icon.png'


export default function Header({ isAdmin }) {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)

    const [modalRegister, setmodalregister] = useState(false)
    const [modalLogin, setmodallogin] = useState(false)

    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT',
        })
        navigate('/')
    }

    return (
        <div className='d-flex align-items-center mt-4' style={{ hight: 50 }}>
            <div className='w-50'>
                <button onClick={() => navigate('/')} style={{ background: 'unset', border: 'unset' }}>
                    <img src={Icon} />
                </button>
            </div>
            <div className='w-50 d-flex justify-content-end align-items-center'>
                {state.isLogin ?
                    <>
                        <>
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-button-dark-example1" variant="unset" style={{ boxShadow: 'unset' }}>
                                    {state.user.image ? state.user.image.slice(-4) != 'null' && state.user.image.slice(-9) != 'undefined' ?
                                        <img src={state.user.image} style={{ height: 50, width: 50, objectFit: 'cover', border: 'solid 2px  #CD2E71', boxSizing: 'border-box', borderRadius: 10000 }} />
                                        :
                                        <img src={user} style={{ height: 50, width: 50, objectFit: 'cover', border: 'solid 2px  #CD2E71', boxSizing: 'border-box', borderRadius: 10000 }} />
                                        :
                                        <img src={user} style={{ height: 50, width: 50, objectFit: 'cover', border: 'solid 2px  #CD2E71', boxSizing: 'border-box', borderRadius: 10000 }} />
                                    }
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark">
                                    {state.user.isAdmin ?
                                        <>
                                            <Dropdown.Item className='d-flex align-items-center fs-5' onClick={() => navigate('/add-film')}>
                                                <img src={addfilmIcon} style={{ marginRight: 10, width: 35 }} />
                                                Add Film
                                            </Dropdown.Item>
                                            <Dropdown.Item className='d-flex align-items-center fs-5' onClick={() => navigate('/list-transaction')}>
                                                <img src={addfilmIcon} style={{ marginRight: 10, width: 35 }} />
                                                Incoming Transaction
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                        </>
                                        : <></>}
                                    <Dropdown.Item className='d-flex align-items-center fs-5' onClick={() => navigate('/profile')}>
                                        <img src={user} style={{ marginRight: 10, width: 35 }} />
                                        Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item className='d-flex align-items-center fs-5' onClick={() => navigate('/my-list-film')}>
                                        <img src={clapperboard} style={{ marginRight: 10, width: 35 }} />
                                        My List FIlm
                                    </Dropdown.Item>

                                    <Dropdown.Divider />
                                    <Dropdown.Item className='d-flex align-items-center fs-5' onClick={handleLogout}>
                                        <img src={logout} style={{ marginRight: 10 }} />
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>

                    </>
                    :
                    <>
                        <button type="button" className="bnt-white" onClick={() => { setmodallogin(true) }}>Login</button>
                        <button type="button" className="btn-pink" onClick={() => { setmodalregister(true) }}>Register</button>
                        <Register
                            show={modalRegister}
                            onHide={() => setmodalregister(false)}
                            setmodallogin={setmodallogin}
                            setmodalregister={setmodalregister} />

                        <Login
                            show={modalLogin}
                            onHide={() => setmodallogin(false)}
                            setmodallogin={setmodalregister}
                            setmodalregister={setmodallogin} />
                    </>
                }
            </div>
        </div>
    )
}