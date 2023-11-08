import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const airportModule = {
    namespaced: true,
    state: () => ({ 
        status: 'init', // init, loading, success, error
        error: null,
        airports: []
    }),
  mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setAirports: (state, airports) => state.airports = airports,
    },
    actions: {
        airports: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.airports({ token });
                commit('setStatus','success');
                commit('setAirports', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
      },
    },
    getters: {
      airports: state => state.airports,
      airport: state => airport_id => state.airports.filter(airport => airport.id === airport_id),
      status: state => state.status,
      error: state => state.error,
    }
}