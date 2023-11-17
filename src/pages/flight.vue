<template>
    <h1>Search Parameters</h1>
    <div class="block">
        <div class="flex">
            <label>
                from <Dropdown
                    v-model="fromAirport"
                    :options="airports"
                    option-label="IATACode"
                    placeholder="Airport"
                />
            </label>
            <label>
                to <Dropdown
                    v-model="toAirport"
                    :options="airports"
                    option-label="IATACode"
                    placeholder="Airport"
                />
            </label>
            <label>
                Cabin Type <Dropdown
                    v-model="cabinType"
                    :options="cabinTypes"
                    option-label="title"
                    placeholder="Cabin Type"
                />
            </label>
        </div>
        <div class="flex">
            <div class="return-group">
                <label>
                    <RadioButton
                        v-model="isReturn"
                        name="return"
                        value="true"
                    />
                    <span>Return</span>
                </label>
                <label>
                    <RadioButton
                        v-model="isReturn"
                        name="return"
                        value="false"
                    />
                    <span>One way</span>
                </label>
            </div>
            <label>Outbound <Calendar v-model="outboundDate" /></label>
            <label>Return <Calendar v-model="returnDate" /></label>
            <Button
                label="Apply"
                @click="apply"
            />
        </div>
    </div>
    <table
        v-if="Object.keys(outboundFlights).length"
        class="table"
    >
        <tr class="table_header">
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Time</th>
            <th>Flight Number(s)</th>
            <th>Cabin price</th>
            <th>Number of stops</th>
        </tr>
        <tr class="table_row">
            <td>{{ outboundFlights.routes[0].from }}</td>
            <td>{{ outboundFlights.routes[1].to }}</td>
            <td>{{ outboundFlights.date[0] }}</td>
            <td>{{ outboundFlights.time[0] }}</td>
            <td>{{ outboundFlights.flight_number.join('-') }}</td>
            <td>{{ `$${outboundFlights.price}` }}</td>
            <td>${{ outboundFlights.number_of_stops }}</td>
        </tr>
    </table>
</template>

<script>
import { mapGetters } from 'vuex';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import { format } from 'date-fns';

export default {
    name: 'Flight',
    components: {
        Dropdown,
        Calendar,
        Button,
        RadioButton
    },
    data() {
        return {
            fromAirport: '',
            toAirport: '',
            cabinType: '',
            isReturn: '',
            outboundDate: null,
            returnDate: null,
        }
    },
    computed: {
        ...mapGetters('flight', ['outboundFlights']),
        airports() {
            return this.$store.state.airport.airports;
        },
        cabinTypes() {
            return [
                {
                    title: 'Economy'
                },
                {
                    title: 'Business'
                }
            ]
        }
    },
    created() {
        this.$store.dispatch('airport/getAirports');
    },
    methods: {
        apply() {
            const self = this;

            const req = {
                from_airport: this.fromAirport.IATACode,
                to_airport: this.toAirport.IATACode,
                outbound_date: format(new Date(this.outboundDate), 'yyyy-MM-dd'),
                cabin_type: this.cabinType.title.toLowerCase(),
                ...(this.returnDate && { return_date: format(new Date(this.returnDate), 'yyyy-MM-dd') })
            }

            this.$store.dispatch('flight/getFlight', req);
        }
    },
}
</script>

<style scoped lang="scss">
.block {
  display: inline-block;
  border: 1px solid #000;
  padding: 24px;
}

.return-group {
  display: flex;
  gap: 12px;
}

.flex {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
}

.table {
  width: 100%;
  border: 3px solid black;
  border-collapse: collapse;

  &_header {
    background: grey;
    border: 3px solid black;

    th {
      text-align: start;
      padding: 2px;
      border-left: 3px solid black;
      text-align: center;
    }
  }
  &_row {
    td {
      cursor: pointer;
      padding: 2px;
      border-left: 3px solid black;
      text-align: center;
    }
  }
}
</style>
