import { Dropdown, Table } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';

//import icon
import flipTiangle from '../assets/icons/flipTiangle.svg';
import { QUERY_KEYS } from '../config/queryKeys';
import { fetchIncomingTransactions, updateTransactionStatus } from '../config/services';

export default function InTransaction() {
  const title = 'Incoming Transaction';
  document.title = title + ' | Cinema Online';

  const { data: transactions = [] } = useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS,
    queryFn: fetchIncomingTransactions,
  });

  const queryClient = useQueryClient();
  const statusMutation = useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_TRANSACTIONS });
    },
  });

  const handleTransactionUpdate = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  return (
    <>
      <Header isAdmin />
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
            {transactions.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.user.fullname}</td>
                <td>
                  <a href={item.buktiTF} className='text-white' target='_blank' rel="noreferrer">
                    {item.buktiTF}
                  </a>
                </td>
                <td>{item.film.title}</td>
                <td>{item.accountNum}</td>
                <td className={
                  item.status === 'Pending'
                    ? 'text-warning'
                    : item.status === 'Rejected'
                      ? 'text-danger'
                      : 'text-success'
                }>
                  {item.status}
                </td>
                <td className='text-center'>
                  <Dropdown>
                    <Dropdown.Toggle className='p-0' style={{ background: 'unset', border: 'unset', boxShadow: 'unset' }}>
                      <img src={flipTiangle} alt="toggle" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                      {item.status === 'Pending' ? (
                        <>
                          <Dropdown.Item
                            style={{ color: '#0ACF83' }}
                            onClick={() => handleTransactionUpdate(item.id, 'approve')}
                          >
                            Approved
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ color: '#FF0000' }}
                            onClick={() => handleTransactionUpdate(item.id, 'reject')}
                          >
                            Rejected
                          </Dropdown.Item>
                        </>
                      ) : (
                        <Dropdown.Item
                          style={{ color: 'yellow' }}
                          onClick={() => handleTransactionUpdate(item.id, 'pending')}
                        >
                          Pending
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}

          </tbody>
        </Table>
      </div>
    </>
  );
}
