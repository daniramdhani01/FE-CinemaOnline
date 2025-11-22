import { useQuery } from '@tanstack/react-query';

//import page
import Header from '../components/Header';

//import pic
import user from '../assets/icons/user.svg';
import { QUERY_KEYS } from '../config/queryKeys';
import { fetchUserProfile, fetchUserTransactions } from '../config/services';
import {
  ProfileSkeleton,
  TransactionSkeleton
} from '../components/LoadingSkeleton';

export default function Profile() {
  const title = 'Profile';
  document.title = title + ' | Cinema Online';

  const { data: profile = {}, isLoading: isLoadingProfile } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: fetchUserProfile,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: QUERY_KEYS.USER_TRANSACTIONS,
    queryFn: fetchUserTransactions,
  });

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const day = (dateValue) => {
    const d = new Date(dateValue);
    return weekday[d.getDay()];
  };

  const date = (dateValue) => {
    const d = new Date(dateValue);
    return `${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`;
  };

  const profileImage = profile?.image?.slice(-4) === 'null' ? user : profile?.image;

  return (
    <>
      <Header />

      {/* container */}
      <div className='d-flex mt-5' style={{ paddingLeft: '7.5%', paddingRight: '7.5%' }}>
        <div className='col-7'>
          {isLoadingProfile ? (
            <ProfileSkeleton />
          ) : (
            <>
              <div className='fs-36 fw-bold'>My Profile</div >
              <div className='d-flex mt-4'>
                <img src={profileImage || user} style={{ width: 200 }} alt={profile?.fullname} />
                <div className='ps-4'>
                  <div className='t-pink-f18'>
                    Full Name
                  </div>
                  <div className='t-grey-f18 mb-3'>
                    {profile?.fullname}
                  </div>
                  <div className='t-pink-f18'>
                    Email
                  </div>
                  <div className='t-grey-f18 mb-3'>
                    {profile?.email}
                  </div>
                  <div className='t-pink-f18'>
                    Phone
                  </div>
                  <div className='t-grey-f18 mb-3'>
                    {profile?.phone ? profile.phone : '-'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='w-100'>
          <div className='fs-36 fw-bold mb-4'>
            History Transaction
          </div>
          {/* data here */}
          {isLoadingTransactions ? (
            <div>
              {Array.from({ length: 3 }).map((_, index) => (
                <TransactionSkeleton key={index} />
              ))}
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((item, index) => (
              <div className='p-3 mb-3' style={{ background: 'rgba(205, 46, 113, 0.44)' }} key={index}>
                <div className='fs-14'>
                  {item.film.title}
                </div>
                <div className=''>
                  <span className='fs-12'>{day(item.createdAt)}, </span>
                  <span className='fs-12'>{date(item.createdAt)}</span>
                </div>
                <div className='d-flex'>
                  <div className='text-pink fs-12' style={{ width: '210%' }}>
                    Total : {item.film.price}
                  </div>
                  {item.status === 'Approved' ? (
                    <div className='w-100 status-finished'>
                      Finished
                    </div>
                  ) : item.status === 'Pending' ? (
                    <div className='w-100 bg-warning text-white status-finished'>
                      Pending
                    </div>
                  ) : (
                    <div className='w-100 bg-danger text-white status-finished'>
                      Rejected
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted">
              <p>No transactions found</p>
            </div>
          )}
          {/* end of data */}
        </div>
      </div>
    </>
  );
}
