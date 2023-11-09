import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const scheduleModule = {
    namespaced: true,
    state: () => ({ 
        status: 'init', // init, loading, success, error
        error: null,
        schedules: []
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setSchedules: (state, schedules) => state.schedules = schedules,
    },
    actions: {
        schedules: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.schedules({ token });
                commit('setStatus','success');
                commit('setSchedules', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        cancelFlight: async ({ commit }, id) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.cancelFlight({ token, id });
                commit('setStatus','success');
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        }
    },
    getters: {
      schedules: state => state.schedules,
      schedule: state => schedule_id => state.schedules.filter(schedule => schedule.id === schedule_id),
      status: state => state.status,
      error: state => state.error,
    }
}