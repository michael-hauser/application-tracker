import axios from 'axios';

export const fetchStagesAPI = () => {
  return axios.get('/api/stages');
};
