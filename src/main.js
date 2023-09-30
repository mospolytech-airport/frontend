import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './pages/routes';
import { store } from './store';

import App from './app.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});


const app = createApp(App);

app.use(router);
app.use(store);
app.mount('#app');
