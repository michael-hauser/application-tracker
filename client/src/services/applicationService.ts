import axios from 'axios';
import { apiPath } from '../config';
import { Application } from '../models/Application.model';

const routesPrefix = 'applications'

export const fetchApplicationsAPI = () => {
  return axios.get(`${apiPath}/${routesPrefix}`);
};

export const addApplicationAPI = (newApplication: Omit<Application, 'id'>) => {
  return axios.post(`${apiPath}/${routesPrefix}`, newApplication);
};

export const updateApplicationAPI = (updatedApplication: Application) => {
  return axios.put(`${apiPath}/${routesPrefix}/${updatedApplication.id}`, updatedApplication);
};

export const deleteApplicationAPI = (applicationId: string) => {
  return axios.delete(`${apiPath}/${routesPrefix}/${applicationId}`);
};
