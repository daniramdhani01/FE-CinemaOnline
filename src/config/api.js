import axios from 'axios';
import { getLocalStorage } from '../helper';

const baseURL = process.env.REACT_APP_BASE_URL+"/api/v1/"

export const API = axios.create({
    baseURL
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
        delete API.defaults.headers.common["Authorization"];
    }
};
