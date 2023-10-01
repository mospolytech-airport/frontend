import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './login.vue';
import HomePage from './home.vue';
import { ACCESS_TOKEN, PATHS } from '../constants';
import { cookie } from '../utils/cookie';

const routes = [
  {
    path: PATHS.LOGIN,
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: PATHS.HOME,
    name: 'HomePage',
    component: HomePage,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!cookie.getCookie(ACCESS_TOKEN)) {
      next({ name: 'LoginPage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export { router };