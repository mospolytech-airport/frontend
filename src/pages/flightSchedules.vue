<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button>Add User</button>
            <button @click="logout">
                Exit
            </button>
        </div>
        <div class="content">
			<div class="filters">
				<!-- <p style="position:relative">Filtered by:</p> -->
				<label>
					From
					<select
						class="filter+"
						placeholder="Choose office"
					>
						<!-- <option
							v-for="office in offices"
							:key="office.id"
							:value="office.title"
							>
							{{ office.title }}
						</option> -->
					</select>
				</label>
				<label>
					To
					<select
						class="filter+"
						placeholder="Choose office"
					>
						<!-- <option
							v-for="office in offices"
							:key="office.id"
							:value="office.title"
							>
							{{ office.title }}
						</option> -->
					</select>
				</label>
				<label>
					Sort by
					<select
						class="filter+"
						placeholder="Choose office"
					>
						<!-- <option
							v-for="office in offices"
							:key="office.id"
							:value="office.title"
							>
							{{ office.title }}
						</option> -->
					</select>
				</label>
				<label>
					Outbound
					<select
						class="filter+"
						placeholder="Choose office"
					>
						<!-- <option
							v-for="office in offices"
							:key="office.id"
							:value="office.title"
							>
							{{ office.title }}
						</option> -->
					</select>
				</label>
				<label>
					Flight Number
					<select
						class="filter+"
						placeholder="Choose office"
					>
						<!-- <option
							v-for="office in offices"
							:key="office.id"
							:value="office.title"
							>
							{{ office.title }}
						</option> -->
					</select>
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
                    class="table_row" 
                    v-for="({id, Date, Time, Route: {DepartureAirport, ArrivalAirport}, FlightNumber, EconomyPrice, Aircraft }) in schedules" :key="id"
                >
                    <td>{{ editDate(Date) }}</td>
                    <td>{{ Time }}</td>
                    <td>{{ DepartureAirport.IATACode }}</td>
                    <td>{{ ArrivalAirport.IATACode }}</td>
                    <td>{{ FlightNumber }}</td>
                    <td>{{ Aircraft.Name }}</td>
                    <td>${{ Math.round(EconomyPrice)}}</td>
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
        }  
    },    
    computed: {
        schedules() {
            return this.$store.state.schedule.schedules;
        }
    },
    created() {
        this.$store.dispatch('schedule/schedules', this.user);
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
      	},
        editDate(date) {
			const [year, month, day] = date.split('-');
			return `${day}.${month}.${year}`
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