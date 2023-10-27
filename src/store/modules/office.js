import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const officeModule = {
    namespaced: true,
    state: () => ({ 
        status: 'init', // init, loading, success, error
        error: null,
        offices: []
    }),
  mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setOffices: (state, offices) => state.offices = offices,
    },
    actions: {
        offices: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.offices({ token });
                commit('setStatus','success');
                commit('setOffices', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
      },
    },
    getters: {
      offices: state => state.offices,
      office: state => office_id => state.offices.filter(office => office.id === office_id),
      status: state => state.status,
      error: state => state.error,
    }
}