import axios from 'axios';
import { apiPath } from '../config';

const routesPrefix = 'auth'

export const loginUserAPI = (credentials: { email: string; password: string }) => {
  return axios.post(`${apiPath}/${routesPrefix}/login`, credentials);
};

export const registerUserAPI = (userData: { name: string; email: string; password: string; }) => {
  return axios.post(`${apiPath}/${routesPrefix}/register`, userData);
};

export const looutUserAPI = () => {
  return axios.post(`${apiPath}/${routesPrefix}/logout`);
};

export const fetchUserProfileAPI = () => {
  return axios.get(`${apiPath}/${routesPrefix}/profile`);
};
