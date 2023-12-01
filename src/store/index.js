import { createStore } from 'vuex';

import { authModule } from './modules/auth';
import { officeModule } from './modules/office';
import { surveyModule } from './modules/survey';
import { scheduleModule } from './modules/schedule';
import { flightModule } from "./modules/flight";
import { airportModule } from "./modules/airport";
import { countryModule } from "./modules/country";
import { ticketModule } from "./modules/ticket";
import { amenitiesModule } from './modules/amenity';

export const store = createStore({
    modules: {
        auth: authModule,
        office: officeModule,
        survey: surveyModule,
        schedule: scheduleModule,
        flight: flightModule,
        airport: airportModule,
        country: countryModule,
        ticket: ticketModule,
        amenity: amenitiesModule
    }
});
