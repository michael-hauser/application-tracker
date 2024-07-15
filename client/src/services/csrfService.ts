import { apiPath } from '../config';
import axiosInstance from './axiosInstance';

const routesPrefix = 'csrf'

export const fetchCsrfTokenAPI = () => {
  return axiosInstance.get(`${apiPath}/${routesPrefix}`);
};