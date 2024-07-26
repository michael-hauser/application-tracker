import { ICsrfModel } from "../models/CsrfModel";
import axiosInstance from "../services/axiosInstance";
import { fetchCsrfTokenAPI } from "../services/csrfService";

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const isTokenSet = !!token;
    if (isTokenSet) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
    return isTokenSet;
};

export const saveCsrfToken = (csrfToken: string): void => {
    axiosInstance.defaults.headers.common['x-csrf-token'] = csrfToken;
}

export const removeCsrfToken = (): void => {
    delete axiosInstance.defaults.headers.common['x-csrf-token'];
}

export const saveAuthToken = (token: string): void => {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    removeCsrfToken();
    getCsrfToken();
};

export const getCsrfToken = (): Promise<void> => {
    return fetchCsrfTokenAPI()
        .then((res) => {
            const data: ICsrfModel = res.data;
            saveCsrfToken(data.token);
        })
        .catch((error) => {
            console.error('Error reading CSRF token:', error);
        });
}