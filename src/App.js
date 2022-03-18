import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, } from 'react-router-dom'
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

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const navigate = useNavigate()

  const [state, dispatch] = useContext(UserContext)

  // console.log(state)

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin == false) {
      navigate("/landing-page");
      // console.log('update')
    }
    else {
      if (state.user.isAdmin === true) {
        navigate("/list-transaction");
      }
      else {
        navigate("/");
      }
    }
  }, [state]);


  const checkUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.token,
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
      payload.token = localStorage.token;

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
      <Route exact path='/landing-page' element={<LandingPage />} />
      <Route exact path='/' element={<LandingPage />} />
      <Route exact path='/detail-film/:id' element={<DetailFilm />} />
      <Route exact path='/profile' element={<Profile />} />
      <Route exact path='/my-list-film' element={<MylistFilm />} />
      <Route exact path='/list-transaction' element={<InTransaction />} />
      <Route exact path='/add-film' element={<AddFilm />} />
    </Routes>
  )
}


export default App;
