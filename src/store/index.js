import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { appsModule } from './modules/apps';

export const store = createStore({
    modules: {
        auth: authModule,
        apps: appsModule
    }
});
