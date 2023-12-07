import { api } from '../../api';
import {cookie} from "@/utils/cookie.js";
import {ACCESS_TOKEN} from "@/constants.js";

export const ticketModule = {
    namespaced: true,
    state: () => ({
        status: 'init', // init, loading, success, error
        error: null,
        tickets: []
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setTickets: (state, tickets) => state.tickets = tickets,
    },
    actions: {
        getTickets: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data } = await api.getTickets();
                commit('setStatus', 'success');
                commit('setTickets', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },

        createTickets: async ({ commit }, { users, outboundFlights, returnFlights }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const reqArray = [];

                users.forEach(({ firstName, lastName, passportNumber, passportCountry, phone }) => {
                    if (outboundFlights) {
                        outboundFlights.ids.forEach((id) => {
                            reqArray.push(api.createTicket({
                                data: {
                                    schedule_id: id,
                                    cabin_type: outboundFlights.cabin_type,
                                    first_name: firstName,
                                    last_name: lastName,
                                    phone,
                                    passport_number: passportNumber,
                                    country: passportCountry.name
                                },
                                token
                            }));
                        });
                    }

                    if (returnFlights) {
                        returnFlights.ids.forEach((id) => {
                            reqArray.push(api.createTicket({
                                data: {
                                    schedule_id: id,
                                    cabin_type: returnFlights.cabin_type,
                                    first_name: firstName,
                                    last_name: lastName,
                                    phone,
                                    passport_number: passportNumber,
                                    country: passportCountry.name
                                },
                                token
                            }));
                        });
                    }
                });

                const results = await Promise.all(reqArray);
                const tickets = results.map(({ data }) => data.ticket);

                commit('setStatus','success');
                commit('setTickets', tickets);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        removeTickets: ({ commit }) => {
            commit('setTickets', []);
        }
    },
    getters: {
        tickets: state => state.tickets,
        status: state => state.status,
        error: state => state.error,
    }
}

