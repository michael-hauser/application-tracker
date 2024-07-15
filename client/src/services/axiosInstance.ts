import axios from 'axios';
import { looutUserAPI } from './userService';
import { removeAuthToken } from '../utils/auth';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

// Custom interceptor to handle 403 errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;
        if (response && response.status === 403 && response.data.error === "csrf validation error") {
            // Log out user if CSRF token is invalid, this could happen after a server restart
            looutUserAPI().finally(() => {
                removeAuthToken();
                window.location.href = '/';
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
