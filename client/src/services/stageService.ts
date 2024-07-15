import { apiPath } from '../config';
import axiosInstance from './axiosInstance';

const routesPrefix = 'stages';

export const fetchStagesAPI = () => {
  return axiosInstance.get(`${apiPath}/${routesPrefix}`);
};
