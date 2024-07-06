import axios from 'axios';
import { Application } from '../models/Application.model';

export const fetchApplicationsAPI = () => {
  return axios.get('/api/applications');
};

export const addApplicationAPI = (newApplication: Omit<Application, 'id'>) => {
  return axios.post('/api/applications', newApplication);
};

export const updateApplicationAPI = (updatedApplication: Application) => {
  return axios.put(`/api/applications/${updatedApplication.id}`, updatedApplication);
};

export const deleteApplicationAPI = (applicationId: string) => {
  return axios.delete(`/api/applications/${applicationId}`);
};
