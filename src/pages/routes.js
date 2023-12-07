import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from './login.vue';
import HomePage from './home.vue';
import RegisterPage from './register.vue';
import AdminMenu from './adminMenu.vue';
import EditPage from './edit.vue';
import MenuUserPage from './menuUsers.vue';
import ReportsSurveyPage from './reportsSurvey.vue';
import FlightSchedules from './flightSchedules.vue';
import Flight from './flight.vue';
import SurveyDetailPage from './survey/surveyDetail.vue';
import Booking from './booking.vue';
import AdditionalServecis from './additionalServecis.vue';
import Review from './review.vue'
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
  },
  {
    path: PATHS.REVIEW,
    name: 'ReviewPage',
    component: Review,
  },
  {
    path: PATHS.REGISTER,
    name: 'RegisterPage',
    component: RegisterPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: PATHS.ADMIN,
    name: 'AdminMenu',
    component: AdminMenu,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.MENUUSER,
    name: 'MenuUserPage',
    component: MenuUserPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.SURVEYREPORTS,
    name: 'ReportsSurveyPage',
    component: ReportsSurveyPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.SURVEYDETAIL,
    name: 'SurveyDetailPage',
    component: SurveyDetailPage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.EDIT,
    name: 'EditPage',
    component: EditPage,
  },
  {
    path: PATHS.FLIGHT,
    name: 'FlightPage',
    component: Flight,
  },
  {
    path: PATHS.SCHEDULES,
    name: 'FlightSchedules',
    component: FlightSchedules,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.BOOKING,
    name: 'BookingPage',
    component: Booking,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: PATHS.ADDITIONALSERVECIS,
    name: 'AdditionalServecis',
    component: AdditionalServecis,
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
