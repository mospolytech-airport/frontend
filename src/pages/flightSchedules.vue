<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button @click="logout">
                Exit
            </button>
        </div>
        <div class="content">
            <div class="filters">
                <!-- <p style="position:relative">Filtered by:</p> -->
                <label style="position: relative;">
                    From
                    <select class="filter" v-model="from">
                        <option
                        v-for="{IATACode}, key in airports"
                        :key="key"
                        :value="IATACode"
                        >
                        {{ IATACode }}
                    </option>
                </select>
                <span class="clear-button" style="position:" v-if="from" @click="removeFilter('from')">x</span>
            </label>
                <label style="position: relative;">
                    To
                    <select class="filter" v-model="to">
                        <option
							v-for="{IATACode}, key in airports"
							:key="key"
							:value="IATACode"
							>
							{{ IATACode }}
						</option>
                    </select>
                    <span class="clear-button" v-if="to" @click="removeFilter('to')">x</span>
                </label>
                <label style="position: relative;">
                    Sort by
                    <select
                        class="filter"
                        v-model="sort"
                    >
                        <option
							v-for="item, key in sortBy"
							:key="key"
							:value="item"
							>
							{{ item }}
						</option>
                    </select>
                    <span class="clear-button" v-if="sort" @click="removeFilter('sort')">x</span>
                </label>
                <label style="position: relative;">
                    Outbound
                    <select
                        class="filter"
                        v-model="outbound"
                    >
                        <option
							v-for="outbound, key in outbounds"
							:key="key"
							:value="outbound"
							>
							{{ outbound }}
						</option>
                    </select>
                    <span class="clear-button" v-if="outbound" @click="removeFilter('outbound')">x</span>
                </label>
                <label style="position: relative;">
                    Flight Number
                    <select
                        class="filter"
                        v-model="flightNumber"
                    >
                        <option
							v-for="flightNumber, key in flightNumbers"
							:key="key"
							:value="flightNumber"
							>
							{{ flightNumber }}
						</option>
                    </select>
                    <span class="clear-button" v-if="flightNumber" @click="removeFilter('flightNumber')">x</span>
                </label>
                <button>Apply</button>
            </div>
            <table class="table">
                <tr class="table_header">
                    <th>Date</th>
                    <th>Time</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Flight Number</th>
                    <th>Aircraft</th>
                    <th>Economy price</th>
                    <th>Business price</th>
                    <th>First class price</th>
                </tr>
                <tr 
                    v-for="({id, Date, Time, Route: {DepartureAirport, ArrivalAirport}, FlightNumber, EconomyPrice, Aircraft }) in schedules" 
                    :key="id"
                    class="table_row"
                >
                    <td>{{ editDate(Date) }}</td>
                    <td>{{ Time }}</td>
                    <td>{{ DepartureAirport.IATACode }}</td>
                    <td>{{ ArrivalAirport.IATACode }}</td>
                    <td>{{ FlightNumber }}</td>
                    <td>{{ Aircraft.Name }}</td>
                    <td>${{ Math.round(EconomyPrice) }}</td>
                    <td>${{ Math.round(EconomyPrice * 1.4) }}</td>
                    <td>${{ Math.round(EconomyPrice * 1.8) }}</td>
                </tr>
            </table>
            <div class="buttons">
                <div style="display: flex; gap: 3rem;">
                    <button>
                        Cancel Flight
                    </button>
                    <button>
                        Edit Flight
                    </button>
                </div>
                <button>Import Changes</button>
            </div>	
        </div>
    </main>
</template>

<script>
import { PATHS } from '../constants';

export default {
    name: 'FlightSchedules',
    data() {
        return {
            from: '',
            to: '',
            outbound: '',
            flightNumber: '',
            sort: ''
        }  
    },    
    computed: {
        schedules() {
            return this.$store.state.schedule.schedules;
        },
        airports() {
            return this.$store.state.airport.airports;
        },
        outbounds() {
            const outbounds = this.schedules.map(item => item.Date);
            return new Set(outbounds);
        },
        flightNumbers() {
            const numbers = this.schedules.map(item => item.FlightNumber);
            return new Set(numbers);
        },
        sortBy() {
            return ["Date",
                    "Time",
                    "From",
                    "To",
                    "Flight Number",
                    "Aircraft",
                    "Economy price",
                    "Business price",
                    "First class price"]
        }
    },
    created() {
        this.$store.dispatch('schedule/schedules');
        this.$store.dispatch('airport/airports');
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        editDate(date) {
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`
        },
        removeFilter(field) {
            this[field] = "";
        }
    }
}
</script>

<style scoped lang="scss">
.admin-menu {
    width: 100vw;
    height: 100%;
    border: solid 3px;
}
.header-button {
	display: flex;
	gap: 1rem;
}
.office-selector {
	margin: 1rem 0;
	width: 15rem;
}
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
.header-button{
    border-bottom: solid 3px;
    button {
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
}
.content {
    padding: 0 18px;
}
.filters {
	padding: 1rem 3rem;
	border: solid 3px;	
	margin: 1rem 0;
	display: grid;
	grid-template: "a a a"
				   "b b b";
	justify-items: end;
	column-gap: 5rem;
	label {
		
		select {
			width: 5rem;
		}
	}
	button {
		border: 2ps solid black;
		border-radius: 0;
		cursor: pointer;
		font-size: 16px;
		background: 0;
		width: 8rem;
	}
}
.office {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.buttons {
	display: flex;
	justify-content: space-between;
    margin: 1rem 0;
	gap: 4rem;
	button {
		border: 2ps solid black;
		border-radius: 0;
		cursor: pointer;
		font-size: 16px;
		background: 0;
	}
}

.clear-button {
    position: absolute;
    right: 16px;
    top: -1px;
    cursor: pointer;
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
        }
    }
    .active {
        background: rgb(223, 223, 223) !important;
    }
    .enabled {
        background: rgb(144, 231, 139);
    }
    .disabled {
        background-color: red;
        color: white; 
    }
    &_row {
        td {
            cursor: pointer;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
}
</style>