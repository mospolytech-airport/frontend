import axios from 'axios';

import { BACKEND_URL } from './config';

const instanceApi = axios.create({
    baseURL: BACKEND_URL
});

export const api = {
    login: ({ username, password }) => instanceApi.post('/auth/login/', { email: username, password }),
    register: ({ username, password }) => instanceApi.post('/auth/register/', { username, password }),
    me: ({ token }) => instanceApi.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
    logout: ({ token }) => instanceApi.post('/auth/logout/', null, {
        headers: { Authorization: `Bearer ${token}` }
    })
};
