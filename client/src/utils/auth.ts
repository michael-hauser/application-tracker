import axiosInstance from "../services/axiosInstance";

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

export const saveAuthToken = (token: string, csrfToken: string): void => {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosInstance.defaults.headers.common['x-csrf-token'] = csrfToken;
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    delete axiosInstance.defaults.headers.common['x-csrf-token'];
};
