import axios from 'axios';

import { BACKEND_URL } from './config';

const instanceApi = axios.create({
    baseURL: BACKEND_URL
});

export const api = {
    login: ({ username, password }) => instanceApi.post('/auth/login/', { email: username, password }),
    register: ({ username, password }) => instanceApi.post('/auth/register/', { username, password }),
    me: ({ token }) => instanceApi.get('/auth/me/', { headers: { Authorization: `Bearer ${token}` } }),
    users: ({ token }) => instanceApi.get('/auth/users/', { headers: { Authorization: `Bearer ${token}` } }),
    offices: ({ token }) => instanceApi.get('/office/', { headers: { Authorization: `Bearer ${token}` } }),
    logout: ({ token, error }) => instanceApi.post('/auth/logout/', { error }, {
        headers: { Authorization: `Bearer ${token}` }
    })
};
