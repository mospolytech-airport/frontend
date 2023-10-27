import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { surveyModule } from './modules/survey';
import { officeModule } from './modules/office';
import { scheduleModule } from './modules/schedule';

export const store = createStore({
    modules: {
        auth: authModule,
        office: officeModule,
        surveys: surveyModule,
        schedule: scheduleModule,
    }
});
