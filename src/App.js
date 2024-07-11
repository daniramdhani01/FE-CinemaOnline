import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, } from 'react-router-dom'
import { UserContext } from './context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css'
import './style/style.css'
import { API, setAuthToken } from './config/api';

//import page
import LandingPage from './page/LandingPage';
import DetailFilm from './page/DetailFIlm';
import Profile from './page/Profile';
import MylistFilm from './page/MylistFilm';
import InTransaction from './page/InTransaction';
import AddFilm from './page/AddFilm';
import { getLocalStorage } from './helper';

function App() {
  const [state, dispatch] = useContext(UserContext)

  const checkUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + getLocalStorage("AUS","token"),
          'Content-Type': 'application/json',
        },
      };

      const response = await API.get('/check-auth', config);

      // If the token incorrect
      if (response.data.status === 'failed') {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data.data.user

      // Get token from local storage
      payload.token = getLocalStorage("AUS","token");

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

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
