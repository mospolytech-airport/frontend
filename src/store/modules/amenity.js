import { api } from '@/api';
import { cookie } from '@/utils/cookie';
import { ACCESS_TOKEN } from '@/constants';

export const amenitiesModule = {
    namespaced: true,
    state: () => ({
        status: 'init', // init, loading, success, error
        error: null,
        amenities: [],
        booking: null,
        cabintype: null,
        amenityCabin: null,
        amenityTicket: null,
        newAmenityTicket: []
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setAmenityCabin: (state, amenityCabin) => state.amenityCabin = amenityCabin,
        setAmenities: (state, amenities) => state.amenities = amenities,
        setBooking: (state, booking) => state.booking = booking,
        setCabintype: (state, cabintype) => state.cabintype = cabintype,
        setAmenityTicket: (state, amenityTicket) => state.amenityTicket = amenityTicket,
        setNewAmenityTicket: (state, amenityTicket) => state.newAmenityTicket.push(amenityTicket)
    },
    actions: {
        confirmAmenityTicket: async ({ commit }, { ticket, amenity, price }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.confirmAmenityTicket({ ticket, amenity, price, token });

                commit('setStatus', 'success');
                commit('setNewAmenityTicket', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        getAmenities: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.amenities({ token });
                commit('setStatus', 'success');
                commit('setAmenities', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        getCabintype: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data } = await api.cabinType();
                commit('setStatus', 'success');
                commit('setCabintype', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        getAmenityCabintype: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data } = await api.amenityCabin();
                commit('setStatus', 'success');
                commit('setAmenityCabin', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        getAmenityTicket: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data } = await api.amenityTicket();
                commit('setStatus', 'success');
                commit('setAmenityTicket', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        search: async ({ commit }, booking_reference ) => {
            commit('setStatus', 'loading');
            commit('setError', null);
            console.log(booking_reference)
            try {
                const { data } = await api.getBooking({
                    booking_reference
                });

                commit('setStatus', 'success');
                commit('setBooking', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
    },
    getters: {
        amenities: state => state.amenities,
        booking: state => state.booking,
        amenityCabin: state => state.amenityCabin,
        amenityTicket: state => state.amenityTicket,
        newAmenityTicket: state => state.newAmenityTicket,
        cabintype: state => state.cabintype,
        status: state => state.status,
        error: state => state.error,
    }
}
