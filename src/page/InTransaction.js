import { Link } from 'react-router-dom'
import { API } from '../config/api'
import { Dropdown, Table } from 'react-bootstrap'
import Header from '../components/Header'

//import icon
import flipTiangle from '../assets/icons/flipTiangle.svg'
import { useEffect, useState } from 'react'

export default function InTransaction() {
    const title = 'Incoming Transaction'
    document.title = title + ' | Cinema Online'

    const [isupdate, setIsUpdate] = useState(false)
    const [transac, setTransac] = useState([{
        buktiTF: '',
        createdAt: '',
        film: { title: '' },
        id: '',
        idFilm: '',
        iduser: '',
        status: '',
        updatedAt: '',
        user: { fullname: '' },
        accountNum: '',
    }])

    const getData = async () => {
        try {
            const response = await API.get('/incoming-transac')
            setTransac(response.data.data.transac)
        } catch (err) {
            console.log(err)
        }
    }

    const handleApprove = (id) => {
        API.patch('/approve/' + id)
            .catch((err) => console.log(err))
            .finally(()=>setIsUpdate(!isupdate))
    }
    const handleReject = (id) => {
        API.patch('/reject/' + id)
            .catch((err) => console.log(err))
            .finally(()=>setIsUpdate(!isupdate))
    }
    const handlePending = (id) => {
        API.patch('/pending/' + id)
            .catch((err) => console.log(err))
            .finally(()=>setIsUpdate(!isupdate))
    }

    useEffect(() => {
        getData()

        return () => {
            setTransac([{
                buktiTF: '',
                createdAt: '',
                film: { title: '' },
                id: '',
                idFilm: '',
                iduser: '',
                status: '',
                updatedAt: '',
                user: { fullname: '' },
                accountNum: '',
            }])
        }
    }, [isupdate])

    return (
        <>
            <Header isAdmin={true} />
            <div className='' style={{ paddingLeft: '7%', paddingRight: '7%' }}>
                <div className='my-4' style={{ fontSize: 24 }}>
                    Incoming Transaction
                </div>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr style={{ color: '#E50914' }}>
                            <th>No</th>
                            <th>Users</th>
                            <th>Bukti Transfer</th>
                            <th>Film</th>
                            <th>Number Account</th>
                            <th>Status Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transac.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td >{index + 1}</td>
                                    <td>{item.user.fullname}</td>
                                    <td>
                                        <a href={item.buktiTF} className='text-white' target='_blank'>
                                            {item.buktiTF}
                                        </a>
                                    </td>
                                    <td>{item.film.title}</td>
                                    <td>{item.accountNum}</td>
                                    <td className={item.status == 'Pending' ? 'text-warning' : item.status == 'Rejected' ? 'text-danger' : 'text-success'}
                                    >
                                        {item.status}
                                    </td>
                                    <td className='text-center'>
                                        <Dropdown>
                                            <Dropdown.Toggle className='p-0' style={{ background: 'unset', border: 'unset', boxShadow: 'unset' }}>
                                                <img src={flipTiangle} />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu variant="dark">
                                                {item.status == 'Pending' ?
                                                    <>
                                                        <Dropdown.Item style={{ color: '#0ACF83' }} onClick={() => handleApprove(item.id)}>Approved</Dropdown.Item>
                                                        <Dropdown.Item style={{ color: '#FF0000' }} onClick={() => handleReject(item.id)}>Rejected</Dropdown.Item>
                                                    </> :
                                                    item.status == 'Approved' ?
                                                        <Dropdown.Item style={{ color: 'yellow' }} onClick={() => handlePending(item.id)}>Pending</Dropdown.Item>
                                                        :
                                                        <Dropdown.Item style={{ color: 'yellow' }} onClick={() => handlePending(item.id)}>Pending</Dropdown.Item>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </Table>
            </div>
        </>
    )
}