import { apiPath } from '../config';
import axiosInstance from './axiosInstance';

const routesPrefix = 'auth'

export const loginUserAPI = (credentials: { email: string; password: string }) => {
  return axiosInstance.post(`${apiPath}/${routesPrefix}/login`, credentials);
};

export const registerUserAPI = (userData: { name: string; email: string; password: string; }) => {
  return axiosInstance.post(`${apiPath}/${routesPrefix}/register`, userData);
};

export const looutUserAPI = () => {
  return axiosInstance.post(`${apiPath}/${routesPrefix}/logout`);
};

export const fetchUserProfileAPI = () => {
  return axiosInstance.get(`${apiPath}/${routesPrefix}/profile`);
};
