import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";

import { router } from './pages/routes';
import { store } from './store';

import App from './app.vue';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue);
app.mount('#app');
