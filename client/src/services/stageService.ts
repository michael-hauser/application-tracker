import axios from 'axios';
import { apiPath } from '../config';

const routesPrefix = 'stages';

export const fetchStagesAPI = () => {
  return axios.get(`${apiPath}/${routesPrefix}`);
};
