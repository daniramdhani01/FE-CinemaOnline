import { API } from './api';

export const checkAuthRequest = async () => {
  const response = await API.get('/check-auth');
  return response.data;
};

export const loginRequest = async (payload) => {
  const response = await API.post('/login', payload);
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await API.post('/register', payload);
  return response;
};

export const fetchFilms = async () => {
  const response = await API.get('/film');
  return response.data?.data?.film ?? [];
};

export const fetchFilmDetail = async (id) => {
  const response = await API.get(`/detail-film/${id}`);
  return response.data?.data ?? {};
};

export const deleteFilmRequest = async (id) => {
  const response = await API.get(`/film-delete/${id}`);
  return response.data;
};

export const createFilmRequest = async (formData) => {
  const response = await API.post('/film', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchMyFilms = async () => {
  const response = await API.get('/my-film');
  return response.data?.data?.mylist ?? [];
};

export const fetchUserTransactions = async () => {
  const response = await API.get('/transac');
  return response.data?.data?.transac ?? [];
};

export const fetchUserProfile = async () => {
  const response = await API.get('/user');
  return response.data?.data?.user ?? {};
};

export const fetchIncomingTransactions = async () => {
  const response = await API.get('/incoming-transac');
  return response.data?.data?.transac ?? [];
};

const transactionStatusEndpoints = {
  approve: (id) => `/approve/${id}`,
  reject: (id) => `/reject/${id}`,
  pending: (id) => `/pending/${id}`,
};

export const updateTransactionStatus = async ({ id, status }) => {
  const endpoint = transactionStatusEndpoints[status];
  if (!endpoint) {
    throw new Error('Invalid transaction status update');
  }

  const response = await API.patch(endpoint(id));
  return response.data;
};

export const createTransactionRequest = async (formData) => {
  const response = await API.post('/transac', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
