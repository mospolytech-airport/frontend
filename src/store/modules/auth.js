import { api } from '@/api';
import { cookie } from '@/utils/cookie';
import { ACCESS_TOKEN } from '@/constants';

export const authModule = {
    namespaced: true,
    state: () => ({
        user: null,
        status: 'init', // init, loading, success, error
        error: null,
        users: [],
        offices: [],
        editUser: null
    }),
    mutations: {
        setUser: (state, user) => state.user = user,
        setStatus: (state, status) => state.status = status,
        setError: (state, error) => state.error = error,
        setUsers: (state, users) => state.users = users,
        setOffices: (state, offices) => state.offices = offices,
        setEditUser: (state, editUser) => state.editUser = editUser,
        setUsers: (state, users) => state.users = users,
        setUser: (state, editedUser) => state.users = state.users.map(
            user => user.id === editedUser.id ? editedUser : user
        )
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

                commit('setStatus', 'success');
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

                commit('setStatus', 'success');
                commit('setUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        getEditUser: async ({ commit }, { id }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.getUser({ id, token });

                commit('setStatus','success');
                commit('setEditUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        editUser: async ({ commit, state}, { email, ...props }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.editUser({ token, email, ...props });

                commit('setStatus', 'success');
                commit('setUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        users: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                const { data } = await api.users({ token });
                commit('setStatus', 'success');
                commit('setStatus','success');
                commit('setUsers', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        logout: async ({ commit }, body) => {
            commit('setStatus', 'loading');
            commit('setError', null);
          
            const { error } = body || { error: null };
            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
              await api.logout({ token, error });

              cookie.deleteCookie(ACCESS_TOKEN);

              commit('setStatus', 'init');
              commit('setUser', null);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        offices: async ({ commit }) => {
            commit('setStatus', 'loading');
            commit('setError', null);
            try {
                const { data } = await api.officesRegister();
                commit('setStatus', 'success');
                commit('setOffices', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        },
        register: async ({ commit }, { email, first_name, last_name, office, birthday, password }) => {
            commit('setStatus', 'loading');
            commit('setError', null);
            try {
                const { data: { access, data } } = await api.register({
                    email,
                    first_name,
                    last_name,
                    office,
                    birthday,
                    password
                });

                cookie.setCookie(ACCESS_TOKEN, access);

                commit('setStatus', 'success');
                commit('setUser', data);
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
          },
        edit: async ({ commit }, { email, ...props }) => {
            commit('setStatus', 'loading');
            commit('setError', null);

            const token = cookie.getCookie(ACCESS_TOKEN);

            try {
                await api.edit({ token, email, ...props });

                commit('setStatus', 'init');
            } catch (error) {
                if (error instanceof Error) {
                    commit('setStatus', 'error');
                    commit('setError', error.message);
                }
            }
        }
    },
    getters: {
        user: state => state.user,
        isAuth: state => !!state.user,
        status: state => state.status,
        error: state => state.error,
        users: state => state.users,
        editUser: state => ({
            email: state.editUser?.email || '',
            firstName: state.editUser?.firstName || '',
            lastName: state.editUser?.lastName || '',
            office: state.editUser?.office || '',
            role: state.editUser?.role || ''
        })
    }
}