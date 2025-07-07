import axios from 'axios';
import { BASE_URL } from './URL';
const USER_TOKEN = localStorage.getItem("token");

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "Authorization": USER_TOKEN ? `Bearer ${USER_TOKEN}` : '',
    },
});

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear localStorage on 401 (Unauthorized)
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            // Redirect to login page
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);


export const _get = async (url, params = {}) => {
    try {
        const res = await apiClient.get(url, { params });
        if (['200'].includes(res.status.toString())) {
            return res.data;
        } else {
            console.log('res', res);
            throw Error("")
        }
    } catch (error) {
        return error;
    }
};

export const _post = async (url, data = {}, config = {}) => {
    try {
        const res = await apiClient.post(url, data, config);
        return res.data;
    } catch (error) {
        console.log(error, "error===>>>");
        return error?.response;
    }
};