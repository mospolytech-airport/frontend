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
                <label style="position: relative">
                    From
                    <select
                        v-model="from"
                        class="f ilter"
                        @change="selectFilter"
                    >
                        <option
                            v-for="({ IATACode }, key) in airports"
                            :key="key"
                            :value="IATACode"
                            :disabled="to === IATACode"
                        >
                            {{ IATACode }}
                        </option>
                    </select>
                    <span
                        v-if="from"
                        class="clear-button"
                        style="position: "
                        @click="removeFilter('from')"
                    >
                        x
                    </span>
                </label>
                <label style="position: relative">
                    To
                    <select
                        v-model="to"
                        class="filter"
                        @change="selectFilter"
                    >
                        <option
                            v-for="({ IATACode }, key) in airports"
                            :key="key"
                            :value="IATACode"
                            :disabled="from === IATACode"
                        >
                            {{ IATACode }}
                        </option>
                    </select>
                    <span
                        v-if="to"
                        class="clear-button"
                        @click="removeFilter('to')"
                    >x
                    </span>
                </label>
                <label style="position: relative">
                    Sort by
                    <select
                        v-model="sort"
                        class="filter"
                    >
                        <option
                            v-for="(name, key) in sortBy"
                            :key="key"
                            :value="name"
                        >
                            {{ name }}
                        </option>
                    </select>
                    <span
                        v-if="sort"
                        class="clear-button"
                        @click="sort = sortBy[0]"
                    >x
                    </span>
                </label>
                <label style="position: relative">
                    Outbound
                    <input
                        v-model="outbound"
                        class="filter"
                        placeholder="dd.mm.yyyy"
                    >

                    <span
                        v-if="outbound"
                        class="clear-button"
                        @click="removeFilter('outbound')"
                    >x
                    </span>
                </label>
                <label style="position: relative">
                    Flight Number
                    <input
                        v-model="flightNumber"
                        class="filter"
                        placeholder="xxxx"
                    >
                    <span
                        v-if="flightNumber"
                        class="clear-button"
                        @click="removeFilter('flightNumber')"
                    >
                        x
                    </span>
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
                    v-for="{
                        Confirmed,
                        id,
                        Date,
                        Time,
                        Route: { DepartureAirport, ArrivalAirport },
                        FlightNumber,
                        EconomyPrice,
                        Aircraft,
                    } in schedules"
                    :key="id"
                    class="table_row"
                    :class="{
                        active: id === selectedRow?.id,
                        disabled: !Confirmed,
                    }"
                    @click="selectRow(id)"
                >
                    <td>{{ formateDate(Date) }}</td>
                    <td>{{ Time }}</td>
                    <td>{{ DepartureAirport.IATACode }}</td>
                    <td>{{ ArrivalAirport.IATACode }}</td>
                    <td>{{ FlightNumber }}</td>
                    <td>{{ Aircraft.Name }}</td>
                    <td>${{ Math.round(EconomyPrice) }}</td>
                    <td>${{ Math.round(EconomyPrice * 1.35) }}</td>
                    <td>${{ Math.round(EconomyPrice * 1.35 * 1.3) }}</td>
                </tr>
            </table>
            <div class="buttons">
                <div style="display: flex; gap: 3rem">
                    <button
                        :disabled="!selectedRow"
                        @click="cancelSchedule"
                    >
                        Cancel Flight
                    </button>
                    <button
                        :disabled="!selectedRow"
                        @click="updateModalStatus(true)"
                    >
                        Edit Flight
                    </button>
                </div>
                <button @click="updateSecondModalStatus(true)">
                    Import Changes
                </button>
            </div>
        </div>
        <Modal
            v-if="isModalOpen"
            @update:isOpen="updateModalStatus"
        >
            <template #header>
                <p>Schedule edit</p>
            </template>
            <template #content>
                <p class="modal-p">
                    Flight route
                </p>
                <div class="modal-content">
                    <p>
                        From:
                        {{ selectedRow?.Route?.DepartureAirport?.IATACode }}
                    </p>
                    <p>
                        To:
                        {{ selectedRow?.Route?.ArrivalAirport?.IATACode }}
                    </p>
                    <p>Aircraft: {{ selectedRow?.Aircraft.Name }}</p>
                </div>
                <div class="modal-edit">
                    <label style="position: relative">
                        Date:
                        <input
                            v-model="editDate"
                            class="filter"
                            placeholder="yyyy-mm-dd"
                        >
                    </label>
                    <label style="position: relative">
                        Time:
                        <input
                            v-model="editTime"
                            class="filter"
                            placeholder="hh:mm:ss"
                        >
                    </label>
                    <label style="position: relative">
                        Economy Price: $
                        <input
                            v-model.number="editPrice"
                            class="filter"
                            placeholder="xxxx"
                        >
                    </label>
                </div>
            </template>
            <template #footer>
                <button
                    class="footer-button"
                    @click="updateSchedule"
                >
                    Update
                </button>
                <button
                    class="footer-button"
                    @click="updateModalStatus(false)"
                >
                    Cancel
                </button>
            </template>
        </Modal>
        <Modal
            v-if="isSecondModalOpen"
            @update:isOpen="updateSecondModalStatus"
        >
            <template #header>
                <p>Apply Schedule Changes</p>
            </template>
            <template #content>
                <div class="modal-import">
                    <p>Please select the text file with the changes</p>
                    <div class="modal-files">
                        <input
                            type="file"
                            @change="handleFileChange"
                        >
                        <button @click="importFile">
                            Import
                        </button>
                    </div>
                </div>

                <p class="modal-results">
                    Results
                </p>
                <div class="modal-changes">
                    <p>Successful Changes Applied: {{ success_count }}</p>
                    <p>Duplicate Records Discarded: {{ duplicate_count }}</p>
                    <p>Records with missing fields discarded: {{ missing_fields_count }}</p>
                </div>
            </template>
            <template #footer />
        </Modal>
    </main>
</template>

<script>
import { PATHS } from '../constants';
import Modal from '../components/modal.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'FlightSchedules',
    components: {
        Modal,
    },
    data() {
        return {
            isModalOpen: false,
            isSecondModalOpen: false,
            selectedRow: null,
            from: '',
            to: '',
            outbound: '',
            flightNumber: '',
            sort: 'Date',
            editDate: null,
            editTime: null,
            editPrice: null,
            excelFile: null,

        };
    },
    computed: {
        ...mapGetters('schedule', [ "duplicate_count", "missing_fields_count", "success_count"]),
        schedules() {
            // я надеюсь, что это никто не увидит (времени было мало)
            let schedules = this.$store.state.schedule.schedules;

            if (this.from) {
                schedules = schedules.filter(
                    (item) => item.Route.DepartureAirport.IATACode === this.from
                );
            }
            if (this.to) {
                schedules = schedules.filter(
                    (item) => item.Route.ArrivalAirport.IATACode === this.to
                );
            }
            if (this.outbound) {
                schedules = schedules.filter((item) =>
                    this.formateDate(item.Date).includes(this.outbound)
                );
            }
            if (this.flightNumber) {
                schedules = schedules.filter(
                    (item) => item.FlightNumber === this.flightNumber
                );
            }
            switch (this.sort) {
            case 'From':
                return schedules.sort((a, b) => {
                    if (
                        a.Route.DepartureAirport.IATACode <
                        b.Route.DepartureAirport.IATACode
                    )
                        return -1;
                    if (
                        a.Route.DepartureAirport.IATACode >
                        b.Route.DepartureAirport.IATACode
                    )
                        return 1;
                });
            case 'To':
                return schedules.sort((a, b) => {
                    if (
                        a.Route.ArrivalAirport.IATACode < b.Route.ArrivalAirport.IATACode
                    )
                        return -1;
                    if (
                        a.Route.ArrivalAirport.IATACode > b.Route.ArrivalAirport.IATACode
                    )
                        return 1;
                });
            case 'Aircraft':
                return schedules.sort((a, b) => {
                    if (a.Aircraft.Name < b.Aircraft.Name) return -1;
                    if (a.Aircraft.Name > b.Aircraft.Name) return 1;
                });
            case 'Economy Price':
                return schedules.sort((a, b) => {
                    if (~~a.EconomyPrice < ~~b.EconomyPrice) return -1;
                    if (~~a.EconomyPrice > ~~b.EconomyPrice) return 1;
                });
            case 'Flight Number':
                return schedules.sort((a, b) => {
                    if (~~a.FlightNumber < ~~b.FlightNumber) return -1;
                    if (~~a.FlightNumber > ~~b.FlightNumber) return 1;
                });
            case 'Time':
                return schedules.sort((a, b) => {
                    if (a.Time < b.Time) return -1;
                    if (a.Time > b.Time) return 1;
                });
            default:
                return schedules.sort((a, b) => {
                    if (a.Date < b.Date) return -1;
                    if (a.Date > b.Date) return 1;
                });
            }
        },
        airports() {
            let airports = this.$store.state.airport.airports;
            return airports;
        },
        sortBy() {
            return [
                'Date',
                'Time',
                'From',
                'To',
                'Flight Number',
                'Aircraft',
                'Economy Price',
            ];
        },
    },
    created() {
        this.$store.dispatch('schedule/schedules');
        this.$store.dispatch('airport/getAirports');
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        formateDate(date) {
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`;
        },
        removeFilter(field) {
            this[field] = null;
        },
        selectRow(id) {
            this.selectedRow = this.schedules.find((item) => item.id === id);
        },
        async cancelSchedule() {
            try {
                await this.$store.dispatch(
                    'schedule/cancelSchedule',
                    this.selectedRow.id
                );
            } catch (e) {
                console.log(e);
            }
            this.selectedRow.Confirmed = false;
        },
        updateModalStatus(isOpen) {
            if (isOpen) {
                this.editDate = this.selectedRow.Date;
                this.editTime = this.selectedRow.Time;
                this.editPrice = this.selectedRow.EconomyPrice;
            }
            this.isModalOpen = isOpen;
        },
        async updateSchedule() {
            this.selectedRow.Date = this.editDate;
            this.selectedRow.Time = this.editTime;
            this.selectedRow.EconomyPrice = this.editPrice;
            try {
                await this.$store.dispatch('schedule/updateSchedule', this.selectedRow);
                this.updateModalStatus(false);
            } catch (e) {
                console.log(e);
            }
        },
        updateSecondModalStatus(isOpen) {
            this.isSecondModalOpen = isOpen;
        },
        handleFileChange(event) {
            this.excelFile = event.target.files[0];
        },
        async importFile() {
            const formData = new FormData();
            formData.append('excel_file', this.excelFile);

            await this.$store.dispatch('schedule/importSchedules', formData);
        },
    },
};
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

.header-button {
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
  grid-template:
    'a a a'
    'b b b';
  justify-items: end;
  column-gap: 5rem;
  row-gap: 1rem;

  label {
    .filter {
      width: 9rem;
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
input[type='number'] {
  -moz-appearance: textfield;
}

.footer-button {
  border: none;
  background: transparent !important;
  border: 2px solid black;
  border-radius: 0;
  cursor: pointer;
  font-size: 16px;
  background: 0;
  width: 8rem;
  margin: 1rem;
}

.modal-content {
  border: 3px solid black;
  padding: 1rem;
  margin: 1rem;
  display: flex;
  gap: 2rem;
}

.modal-filter {
  display: flex;
  gap: 2rem;
}

.modal-edit {
  margin: 1rem;
  display: flex;
  gap: 1rem;
}

.modal-p {
  position: relative;
  width: 6rem;
  text-align: center;
  top: -29px;
  right: -25px;
  background-color: white;
}
.modal-import {
  margin: 1rem;
}
.modal-files {
  button {
    margin-top: 10px;
    border-radius: 0;
    border: 2px solid black;
    background: transparent;
  }
}

.modal-changes {
  margin: 0 1rem;
  padding: 1rem;
  border: 3px solid black;
}
.modal-results {
  position: relative;
  width: 4rem;
  text-align: center;
  top: 13px;
  right: -23px;
  background-color: white;
}
</style>
