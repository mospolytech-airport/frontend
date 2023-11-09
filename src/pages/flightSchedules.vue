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
                    <select class="filter" v-model="from" @change="selectFilter">
                        <option
                            v-for="{IATACode}, key in airports"
                            :key="key"
                            :value="IATACode"
                            :disabled="to === IATACode"
                        >
                            {{ IATACode }}
                        </option>
                    </select>
                    <span class="clear-button" style="position:" v-if="from" @click="removeFilter('from')">x</span>
                </label>
                <label style="position: relative;">
                    To
                    <select class="filter" v-model="to"  @change="selectFilter">
                        <option
							v-for="{IATACode}, key in airports"
							:key="key"
							:value="IATACode"
                            :disabled="from === IATACode"
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
							v-for="name, key in sortBy"
							:key="key"
							:value="name"
						>
							{{ name }}
						</option>
                    </select>
                    <span class="clear-button" v-if="sort" @click="sort = sortBy[0]">x</span>
                </label>
                <label style="position: relative;">
                    Outbound
                    <input
                        class="filter"
                        v-model="outbound"
                        placeholder="dd.mm.yyyy"
                    />
                        
                    <span class="clear-button" v-if="outbound" @click="removeFilter('outbound')">x</span>
                </label>
                <label style="position: relative;">
                    Flight Number
                    <input
                        class="filter"
                        v-model="flightNumber"
                        placeholder="xxxx"
                    />
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
                    v-for="({Confirmed, id, Date, Time, Route: {DepartureAirport, ArrivalAirport}, FlightNumber, EconomyPrice, Aircraft }) in schedules" 
                    :key="id"
                    class="table_row"
                    :class="{ active: id === selectedRow?.id, disabled: !Confirmed}"
                    @click="selectRow(id)"
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
                    <button @click="cancelFlight">
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
            selectedRow: null,
            from: '',
            to: '',
            outbound: '',
            flightNumber: '',
            sort: "Date"
        }  
    },    
    computed: {
        schedules() {
            // я надеюсь, что это никто не увидит (времени было мало)
            let schedules = this.$store.state.schedule.schedules;

            if (this.from) {
                schedules = schedules.filter(item => item.Route.DepartureAirport.IATACode === this.from)
            }
            if (this.to) {
                schedules = schedules.filter(item => item.Route.ArrivalAirport.IATACode === this.to)
            }
            if (this.outbound) {
                schedules = schedules.filter(item => this.editDate(item.Date).includes(this.outbound))
            }
            if (this.flightNumber) {
                schedules = schedules.filter(item => item.FlightNumber === this.flightNumber)
            }
            switch (this.sort) {
                case "From":
                    return schedules.sort((a, b) => {
                        if (a.Route.DepartureAirport.IATACode < b.Route.DepartureAirport.IATACode) return -1;
                        if (a.Route.DepartureAirport.IATACode > b.Route.DepartureAirport.IATACode) return 1;
                    })  
                case "To":
                    return schedules.sort((a, b) => {
                        if (a.Route.ArrivalAirport.IATACode < b.Route.ArrivalAirport.IATACode) return -1;
                        if (a.Route.ArrivalAirport.IATACode > b.Route.ArrivalAirport.IATACode) return 1;
                    })  
                case "Aircraft":
                    return schedules.sort((a, b) => {
                        if (a.Aircraft.Name < b.Aircraft.Name) return -1;
                        if (a.Aircraft.Name > b.Aircraft.Name) return 1;
                    })  
                case "Economy Price":
                    return schedules.sort((a, b) => {
                        if (~~a.EconomyPrice < ~~b.EconomyPrice) return -1;
                        if (~~a.EconomyPrice > ~~b.EconomyPrice) return 1;
                    })  
                case "Flight Number":
                    return schedules.sort((a, b) => {
                        if (~~a.FlightNumber < ~~b.FlightNumber) return -1;
                        if (~~a.FlightNumber > ~~b.FlightNumber) return 1;
                    })  
                case "Time":
                    return schedules.sort((a, b) => {
                        if (a.Time < b.Time) return -1;
                        if (a.Time > b.Time) return 1;
                    }) 
                default:
                    return schedules.sort((a, b) => {
                        if (a.Date < b.Date) return -1;
                        if (a.Date > b.Date) return 1;
                    })
            }
        },
        airports() {
            let airports = this.$store.state.airport.airports;
            return airports;
        },
        sortBy() {
            return ["Date",
                    "Time",
                    "From",
                    "To",
                    "Flight Number",
                    "Aircraft",
                    "Economy Price"]
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
            this[field] = null;
        },
        selectRow(id) {
            this.selectedRow = this.schedules.find(item => item.id === id);
        },
        async cancelFlight() {
            try {
                await this.$store.dispatch('schedule/cancelFlight', this.selectedRow.id);
            } catch (e) {
                console.log(e)
            }
            this.selectedRow.Confirmed = false;
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
    row-gap: 1rem;
	label {
		
		.filter {
			width: 10rem;
            height: 23.5px;
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>