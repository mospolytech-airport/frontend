<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="booking">
            <label style="position: relative">
                Flight Number
                <input
                    v-model="bookingnum"
                    class="filter"
                    placeholder="XXXXXX"
                >
            </label>
            <button @click="search">
                OK
            </button>
        </div>
        <template v-if="booking != null">
            <fieldset>
                <legend>Flight list</legend>
                <label style="position: relative">
                    Choose your flights
                    <select
                        v-model="currentschedule"
                        name="schedule"
                        @change="showInfo = false"
                    >
                        <option
                            v-for="(schedule, index) in schedulename"
                            :key="index"
                            :value="schedule.id"
                        >
                            {{ schedule.value }}
                        </option>
                    </select>
                </label>
                <button @click="changeSchedule">
                    Show Amenities
                </button>
            </fieldset>
            <template v-if="showInfo">
                <div class="personal">
                    <div>
                        <p>Full name:</p>
                        <p>{{ currentUser.first_name }} {{ currentUser.last_name }}</p>
                    </div>
                    <div>
                        <p>Passport number:</p>
                        <p>{{ currentUser.passport_number }}</p>
                    </div>
                    <div>
                        <p>Your cabin class is:</p>
                        <p>{{ currentcabin.cabin_type }}</p>
                    </div>
                </div>
                <fieldset class="amenities">
                    <legend>AMONIC Airlines Amenities</legend>
                    <label
                        v-for="(amenity, index) in services"
                        :key="index"
                        class="amenities__element"
                    >
                        {{ amenity.service }} ({{ amenity.price }}$)
                        <input
                            v-model="currentAmenities"
                            type="checkbox"
                            :value="amenity.id"
                            name="amenity"
                            :disabled="
                                defaultAmenities.includes(amenity.id) || amenity.price == 'Free'
                            "
                        >
                    </label>
                </fieldset>
                <div class="result">
                    <div class="result__strings">
                        <div class="result__item">
                            <p>Items selected:</p>
                            <p>{{ items }}$</p>
                        </div>
                        <div class="result__item">
                            <p>Duties and taxes:</p>
                            <p>{{ duties }}$</p>
                        </div>
                        <div class="result__item">
                            <p>Total payable:</p>
                            <p>{{ total }}$</p>
                        </div>
                    </div>
                    <div class="result__buttons">
                        <button @click="confirmAmenityTicket">
                            Save and confirm
                        </button>
                        <button>Cancel</button>
                    </div>
                </div>
            </template>
        </template>
    </main>
</template>
<script>
import { mapGetters } from 'vuex';
import { PATHS } from '../constants';

export default {
    name: 'AddirionalServecis',
    data() {
        return {
            bookingnum: null,
            currentschedule: null,
            currentAmenities: [],
            showInfo: false,
        };
    },
    methods: {
        search() {
            const self = this;
            this.$store.dispatch('amenity/search', self.bookingnum);
            this.showInfo = false;
        },
        changeSchedule() {
            this.currentAmenities = this.defaultAmenities.concat(this.boughtAmenity);
            this.showInfo = true;
        },
        confirmAmenityTicket() {
            const self = this;

            self.resultAmenities.forEach((amenity) => {
                let pr;

                self.amenities.forEach((e) => {
                    if (e.id == amenity) {
                        pr = e.price + ".0000"
                    }
                });

                self.$store.dispatch('amenity/confirmAmenityTicket', { amenity, ticket: this.currentUser.id, price: pr});
            });

            self.$router.push(PATHS.HOME);
        }
    },
    computed: {
        ...mapGetters('amenity', [
            'amenities',
            'cabintype',
            'booking',
            'amenityCabin',
            'amenityTicket',
        ]),
        ...mapGetters('schedule', ['schedules']),

        services() {
            let service = [];
            this.amenities.forEach((element) => {
                if (element.price == '0.0000') {
                    element.price = 'Free';
                }
                if (element.price != 'Free') {
                    element.price = element.price.slice(0, -5);
                }
                service.push(element);
            });
            return service;
        },

        tickets() {
            let tickets = null;
            tickets = this.booking.ticket;
            return tickets;
        },

        scheduleid() {
            let ids = [];
            this.tickets.forEach((e) => {
                ids.push(e.schedule);
            });
            return ids;
        },

        schedulesf() {
            let schedules = [];
            this.schedules.forEach((a) => {
                this.scheduleid.forEach((b) => {
                    if (a.id == b) {
                        schedules.push(a);
                    }
                });
            });
            return schedules;
        },

        schedulename() {
            let schedules = [];
            this.schedulesf.forEach((e) => {
                let element = {};
                let a = '';
                a +=
                    e.id +
                    ', ' +
                    e.Route.DepartureAirport.IATACode +
                    '-' +
                    e.Route.ArrivalAirport.IATACode +
                    ', ' +
                    e.Date +
                    ', ' +
                    e.Time;
                element = {
                    id: e.id,
                    value: a,
                };
                schedules.push(element);
            });
            return schedules;
        },

        currentcabin() {
            let cabin = '';
            let cabinid = '';
            let result = {};
            this.tickets.forEach((e) => {
                if (e.schedule == this.currentschedule) {
                    cabinid = e.cabin_type;
                }
            });
            this.cabintype.forEach((e) => {
                if (e.id == cabinid) {
                    cabin = e.name;
                }
            });

            result = {
                cabin_id: cabinid,
                cabin_type: cabin,
            };
            return result;
        },

        currentUser() {
            let result = {};
            this.tickets.forEach((e) => {
                if (e.schedule == this.currentschedule) {
                    result = e;
                }
            });
            return result;
        },

        defaultAmenities() {
            let ids = [];
            this.amenityCabin.forEach((e) => {
                if (e.cabin_type == this.currentcabin.cabin_id) {
                    ids.push(e.amenity);
                }
            });
            return ids;
        },

        resultAmenities() {
            let result = [];
            result = this.currentAmenities.filter(
                (el) => !this.defaultAmenities.includes(el)
            );
            return result;
        },

        items() {
            let result = 0;
            let amenity = [];
            let bought = [];
            this.resultAmenities.forEach((a) => {
                this.amenities.forEach((b) => {
                    if (a == b.id) {
                        amenity.push(b);
                    }
                });
            });
            this.boughtAmenity.forEach((a) => {
                this.amenities.forEach((b) => {
                    if (a == b.id) {
                        bought.push(b);
                    }
                });
            });
            amenity.forEach((e) => {
                result += Number(e.price);
            });
            bought.forEach((e) => {
                result -= Number(e.price)
            })
            return result;
        },

        duties() {
            let result = null;
            result = this.items * 0.05;
            return result;
        },

        total() {
            let result = null;
            result = this.items * 1.05;
            return result;
        },

        boughtAmenity() {
            let result = [];
            this.amenityTicket.forEach((e) => {
                if (e.ticket == this.currentUser.id) {
                    result.push(e.amenity);
                }
            });
            return result;
        },
    },

    created() {
        this.$store.dispatch('amenity/getAmenities');
        this.$store.dispatch('amenity/getAmenityCabintype');
        this.$store.dispatch('amenity/getCabintype');
        this.$store.dispatch('amenity/getAmenityTicket');
        this.$store.dispatch('schedule/schedules');
    },
};
</script>
<style lang="scss" scoped>
.header-cont {
  padding: 0 5px;
  border-bottom: solid 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0;
  }

  button {
    background-color: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
}
button {
  border: 2px solid black;
  border-radius: 0;
  cursor: pointer;
  font-size: 16px;
  background: 0;
  min-width: 8rem;
}
.personal {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 20px;

  div {
    display: flex;
    flex-direction: row;
    column-gap: 5px;
    width: 34%;
    font-size: 1.1rem;
  }
}
.amenities {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &__element {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    width: 50%;
  }
}

.result {
  display: flex;
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;

  &__strings {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }

  &__item {
    display: flex;
    flex-direction: row;
    min-width: 200px;
    justify-content: space-between;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    height: 35px;

    button {
      min-width: 13rem;
    }
  }
}
</style>
