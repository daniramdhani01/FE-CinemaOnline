import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css'
import './style/style.css'
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './config/queryKeys';
import { checkAuthRequest } from './config/services';

//import page
import LandingPage from './page/LandingPage';
import DetailFilm from './page/DetailFIlm';
import Profile from './page/Profile';
import MylistFilm from './page/MylistFilm';
import InTransaction from './page/InTransaction';
import AddFilm from './page/AddFilm';
import { getLocalStorage } from './helper';

function App() {
  const [, dispatch] = useContext(UserContext)

  const token = getLocalStorage("AUS","token");

  const { data: authData, error: authError } = useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: checkAuthRequest,
    enabled: Boolean(token),
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    if (authError || authData?.status === 'failed') {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    const userPayload = authData?.data?.user;
    if (userPayload) {
      dispatch({
        type: 'USER_SUCCESS',
        payload: { ...userPayload, token },
      });
    }
  }, [authData, authError, token, dispatch]);

  return (
    <Routes>
      <Route exact path='/' element={<LandingPage />} />
      <Route exact path='/detail-film/:id' element={<DetailFilm />} />
      {getLocalStorage("AUS","isLogin") && 
      <>
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/my-list-film' element={<MylistFilm />} />
        <Route exact path='/list-transaction' element={getLocalStorage("AUS","isAdmin") ? <InTransaction /> : <Navigate to={"/"}/>} />
        <Route exact path='/add-film' element={<AddFilm />} />
      </>}
      <Route path='*' element={<Navigate to={"/"}/>} />
    </Routes>
  )
}


export default App;
