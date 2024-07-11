import axios from 'axios';
import { getLocalStorage } from '../helper';

export const API = axios.create({
    // baseURL: "https://be-cinema-online.herokuapp.com/api/v1/",
    baseURL: "http://localhost:3001/api/v1/",
});

API.interceptors.request.use(async (config) => {
  const token = getLocalStorage("AUS","token")
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  config.timeout = 10 * 1000;
  return config;
}, (err) => Promise.reject(err));

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.commin["Authorization"];
    }
};