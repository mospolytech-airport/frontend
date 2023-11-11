import axios from 'axios';

import { BACKEND_URL } from './config';

const instanceApi = axios.create({
    baseURL: BACKEND_URL
});

export const api = {
    login: ({ username, password }) => instanceApi.post('/auth/login/', { email: username, password }),
    register: ({ email, first_name, last_name, office, birthday, password, role }) =>
        instanceApi.post('/auth/register/', { email, first_name, last_name, office, birthday, password, role }),
    me: ({ token }) => instanceApi.get('/auth/me/', { headers: { Authorization: `Bearer ${token}` } }),
    editUser: ({ token, email, ...props }) => instanceApi.patch('/auth/edit/', { email, ...props },
        { headers: { Authorization: `Bearer ${token}` } }
    ),
    getUser: ({ id, token }) => instanceApi.get(`/auth/user/${id}`, { headers: { Authorization: `Bearer ${token}` }}),
    users: ({ token }) => instanceApi.get('/auth/users/', { headers: { Authorization: `Bearer ${token}` } }),
    offices: ({ token }) => instanceApi.get('/office/', { headers: { Authorization: `Bearer ${token}` } }),
    officesRegister: () => instanceApi.get('/office'),
    logout: ({ token, error }) => instanceApi.post('/auth/logout/', { error }, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    edit: ({ token, email, ...props }) => instanceApi.patch('/auth/edit/', { email, ...props }, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    surveys: ({ token }) => instanceApi.get('/survey/', { headers: { Authorization: `Bearer ${token}` } }),
    schedules: ({ token }) => instanceApi.get('/schedules/', { headers: { Authorization: `Bearer ${token}` } }),
    airports: ({ token }) => instanceApi.get('/airport/', { headers: { Authorization: `Bearer ${token}` } }),
    cancelSchedule: ({ token, id }) => instanceApi.patch(`/schedules/${id}/`, { Confirmed: false }, { headers: { Authorization: `Bearer ${token}` } }),
    updateSchedule: ({ token, id, Date, Time, EconomyPrice }) =>
        instanceApi.patch(`/schedules/${id}/`, { Date, Time, EconomyPrice }, { headers: { Authorization: `Bearer ${token}` } }),
    importSchedules: ({ token, formData }) =>
        instanceApi.post('/schedules/import/', formData, { headers: { Authorization: `Bearer ${token}` } }),
};
