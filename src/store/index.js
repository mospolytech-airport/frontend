import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { appsModule } from './modules/apps';
import { surveyModule } from './modules/survey';

export const store = createStore({
    modules: {
        auth: authModule,
        apps: appsModule,
        survey: surveyModule,
    }
});
