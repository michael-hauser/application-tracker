import axios from 'axios';

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const isTokenSet = !!token;
    if (isTokenSet) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
    return isTokenSet;
};

export const saveAuthToken = (token: string): void => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};
