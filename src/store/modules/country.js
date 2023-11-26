import { api } from '../../api';

export const countryModule = {
    namespaced: true,
    state: () => ({
        status: 'init', // init, loading, success, error
        error: null,
        countries: []
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setCountries: (state, countries) => state.countries = countries,
    },
    actions: {
        getCountries: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data } = await api.getCountries();

                commit('setStatus','success');
                commit('setCountries', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        }
    },
    getters: {
        countries: state => state.countries,
        status: state => state.status,
        error: state => state.error,
    }
}

