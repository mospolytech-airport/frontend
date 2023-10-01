import { api } from '../../api';
import { cookie } from '../../utils/cookie';
import { ACCESS_TOKEN } from '../../constants';

export const authModule = {
    namespaced: true,
    state: () => ({ 
        user: null,
        status: 'init', // init, loading, success, error
        error: null
    }),
    mutations: {
        setUser: (state, user) => state.user = user,
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error
    },
    actions: {
        login: async ({ commit }, { username, password }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            try {
                const { data: { access, data } } = await api.login({ 
                    username,
                    password 
                });

                if (!data.is_active) {
                    throw new Error('Пользователь заблокирован');
                }

                cookie.setCookie(ACCESS_TOKEN, access);

                commit('setStatus','success');
                commit('setUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        me: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.me({ token });

                commit('setStatus','success');
                commit('setUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        }
    },
    getters: {
        getUser: state => state.user,
        getIsAuth: state => !!state.user,
        getStatus: state => state.status,
        getError: state => state.error
    }
}