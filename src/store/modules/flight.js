import { api } from '@/api';

export const flightModule = {
    namespaced: true,
    state: () => ({
        data: null,
        loading: false,
        error: null
    }),
    mutations: {
        setData: (state, data) => state.data = data,
        setLoading: (state, loading) => state.loading = loading,
        setError: (state, error) => state.error = error
    },
    actions: {
        getFlight: async ({ commit }, flight) => {
            commit('setLoading', true);
            commit('setError', null);

            try {
                const { data } = await api.getFlight(flight);

                commit('setData', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setError', error.message);
                }
            } finally {
                commit('setLoading', false);
            }
        },
    },
    getters: {
        outboundFlights: state => state.data?.outbound || {},
        returnFlights: state => state.data?.return || {},
        error: state => state.error,
        loading: state => state.loading
    }
}
