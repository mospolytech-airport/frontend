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
    getBooking: ({booking_reference}) => instanceApi.post('/tickets/searchbooking/', {booking_reference}),
    getUser: ({ id, token }) => instanceApi.get(`/auth/user/${id}`, { headers: { Authorization: `Bearer ${token}` }}),
    users: ({ token }) => instanceApi.get('/auth/users/', { headers: { Authorization: `Bearer ${token}` } }),
    offices: ({ token }) => instanceApi.get('/office/', { headers: { Authorization: `Bearer ${token}` } }),
    officesRegister: () => instanceApi.get('/office'),
    amenities: ({ token }) => instanceApi.get('/amenity', { headers: { Authorization: `Bearer ${token}` } }),
    logout: ({ token, error }) => instanceApi.post('/auth/logout/', { error }, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    edit: ({ token, email, ...props }) => instanceApi.patch('/auth/edit/', { email, ...props }, {
        headers: { Authorization: `Bearer ${token}` }
    }),
    surveys: ({ token }) => instanceApi.get('/survey/', { headers: { Authorization: `Bearer ${token}` } }),
    getFlight: (flight) => instanceApi.post('/tickets/search/', flight),
    getAirports: () => instanceApi.get('/airport'),
    schedules: ({ token }) => instanceApi.get('/schedules/', { headers: { Authorization: `Bearer ${token}` } }),
    cancelSchedule: ({ token, id }) => instanceApi.patch(`/schedules/${id}/`, { Confirmed: false }, { headers: { Authorization: `Bearer ${token}` } }),
    updateSchedule: ({ token, id, Date, Time, EconomyPrice }) =>
        instanceApi.patch(`/schedules/${id}/`, { Date, Time, EconomyPrice }, { headers: { Authorization: `Bearer ${token}` } }),
    importSchedules: ({ token, formData }) =>
        instanceApi.post('/schedules/import/', formData, { headers: { Authorization: `Bearer ${token}` } }),
    getCountries: () => instanceApi.get('/country'),
    createTicket: ({ data, token }) => instanceApi.post('/tickets/booking/', data, { headers: { Authorization: `Bearer ${token}` } }),
    cabinType: () => instanceApi.get('/cabintype/'),
    amenityCabin: () => instanceApi.get('/amenity-cabin/'),
    amenityTicket: () => instanceApi.get('/amenity-ticket/'),
    getTickets: () => instanceApi.get('/tickets/'),
    confirmAmenityTicket: ({ token, ticket, amenity, price }) => instanceApi.post('/amenity-ticket/', { ticket, amenity, price },
    { headers: { Authorization: `Bearer ${token}` } }),
};
