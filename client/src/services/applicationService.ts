import { apiPath } from '../config';
import { Application } from '../models/Application.model';
import axiosInstance from './axiosInstance';

const routesPrefix = 'applications'

export const fetchApplicationsAPI = () => {
  return axiosInstance.get(`${apiPath}/${routesPrefix}`);
};

export const addApplicationAPI = (newApplication: Omit<Application, 'id'>) => {
  return axiosInstance.post(`${apiPath}/${routesPrefix}`, newApplication);
};

export const updateApplicationAPI = (updatedApplication: Application) => {
  return axiosInstance.put(`${apiPath}/${routesPrefix}/${updatedApplication._id}`, updatedApplication);
};

export const deleteApplicationAPI = (applicationId: string) => {
  return axiosInstance.delete(`${apiPath}/${routesPrefix}/${applicationId}`);
};
