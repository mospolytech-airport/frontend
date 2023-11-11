import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const scheduleModule = {
    namespaced: true,
    state: () => ({ 
        status: 'init', // init, loading, success, error
        error: null,
        schedules: [],
        duplicate_count: 0,
        missing_fields_count: 0,
        success_count: 0
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setSchedules: (state, schedules) => state.schedules = schedules,
        setDuplicate: (state, duplicate_count) => state.duplicate_count = duplicate_count,
        setMissingFields: (state, missing_fields_count) => state.missing_fields_count = missing_fields_count,
        setSuccess: (state, success_count) => state.success_count = success_count
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
        cancelSchedule: async ({ commit }, id) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.cancelSchedule({ token, id });
                commit('setStatus','success');
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        updateSchedule: async ({ commit }, props) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.updateSchedule({ token, ...props});
                commit('setStatus','success');
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        importSchedules: async ({ commit }, formData) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const {
                    data: { duplicate_count, missing_fields_count, success_count }
                } = await api.importSchedules({ token, formData });
                commit('setDuplicate', duplicate_count);
                commit('setMissingFields', missing_fields_count);
                commit('setSuccess', success_count);
                commit('setStatus', 'success');
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
      success_count: state => state.success_count,
      duplicate_count: state => state.duplicate_count,
      missing_fields_count: state => state.missing_fields_count,
    }
}