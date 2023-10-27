import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { officeModule } from './modules/office';
import { surveyModule } from './modules/survey';
import { scheduleModule } from './modules/schedule';

export const store = createStore({
    modules: {
        auth: authModule,
        office: officeModule,
        survey: surveyModule,
        schedule: scheduleModule,
    }
});
