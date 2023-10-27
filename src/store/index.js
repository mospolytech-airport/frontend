import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { officeModule } from './modules/office';
import { surveyModule } from './modules/surveys';

export const store = createStore({
    modules: {
        auth: authModule,
        office: officeModule,
        surveys: surveyModule,
    }
});
