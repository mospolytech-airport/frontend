import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const surveyModule = {
    namespaced: true,
    state: () => ({ 
        status: 'init', // init, loading, success, error
        error: null,
        surveys: []
    }),
    mutations: {
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setSurveys: (state, surveys) => state.surveys = surveys,
    },
    actions: {
        fetchSurveys: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.fetchSurveys({ token });
                commit('setStatus', 'success');
                commit('setSurveys', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
    },
    getters: {
        surveys: state => state.surveys,
        survey: state => surveyId => state.surveys.find(survey => survey.id === surveyId),
        status: state => state.status,
        error: state => state.error,
    }
}
