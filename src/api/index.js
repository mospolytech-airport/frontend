import axios from 'axios';

import { BACKEND_URL } from './config';

const instanceApi = axios.create({
    baseURL: BACKEND_URL
});

export const api = {
    login: ({ username, password }) => instanceApi.post('/auth/login/', { email: username, password }),
    register: ({ email, first_name, last_name, office, birthday, password }) => instanceApi.post('/auth/register/', { email, first_name, last_name, office, birthday, password }),
    me: ({ token }) => instanceApi.get('/auth/me/', { headers: { Authorization: `Bearer ${token}` } }),
    users: ({ token }) => instanceApi.get('/auth/', { headers: { Authorization: `Bearer ${token}` } }),
    offices: ({ token }) => instanceApi.get('/office/', { headers: { Authorization: `Bearer ${token}` } }),
    logout: ({ token }) => instanceApi.post('/auth/logout/', null, {headers: { Authorization: `Bearer ${token}` }}),
    officesRegister: () => instanceApi.get('/office')
};
