import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { appsModule } from './modules/apps';
import { surveyModule } from './modules/surveys';

export const store = createStore({
    modules: {
        auth: authModule,
        apps: appsModule,
        surveys: surveyModule,
    }
});
