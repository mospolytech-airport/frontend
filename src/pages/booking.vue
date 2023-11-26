<template>
    <div class="container">
        <h2>Outbound flight details</h2>
        <template v-if="outboundFlights.ids?.length">
            <div
                v-for="(item, index) in outboundFlights.ids"
                :key="item"
                class="flex"
            >
                <div>From: {{ outboundFlights.routes[index].from }}</div>
                <div>To: {{ outboundFlights.routes[index].to }}</div>
                <div>Cabin Type: {{ outboundFlights.cabin_type }}</div>
                <div>Date: {{ outboundFlights.date[index] }}</div>
                <div>Flight number: {{ outboundFlights.flight_number[index] }}</div>
            </div>
        </template>
        <h2>Return flight details</h2>
        <template v-if="returnFlights.ids?.length">
            <div
                v-for="(item, index) in returnFlights.ids"
                :key="item"
                class="flex"
            >
                <div>From: {{ returnFlights.routes[index].from }}</div>
                <div>To: {{ returnFlights.routes[index].to }}</div>
                <div>Cabin Type: {{ returnFlights.cabin_type }}</div>
                <div>Date: {{ returnFlights.date[index] }}</div>
                <div>Flight number: {{ returnFlights.flight_number[index] }}</div>
            </div>
        </template>
        <h2>Passenger details</h2>
        <div class="form">
            <div class="fields">
                <div>Firstname: <InputText v-model="firstName" /></div>
                <div>Lastname: <InputText v-model="lastName" /></div>
                <div>Birthday: <Calendar v-model="birthday" /></div>
            </div>
            <div class="fields">
                <div>Passport number: <InputNumber v-model="passportNumber" /></div>
                <div>
                    Passport country: <Dropdown
                        v-model="passportCountry"
                        placeholder="Country"
                        :options="countries"
                        option-label="name"
                    />
                </div>
                <div>
                    Phone <InputMask
                        v-model="phone"
                        mask="9 (999) 999 99-99"
                    />
                </div>
            </div>
            <Button
                class="button"
                label="Add passenger"
                @click="addPassenger"
            />
        </div>
        <template v-if="users.length">
            <h2>Passenger list</h2>
            <table class="table">
                <tr class="table_header">
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Birthday</th>
                    <th>Passport number</th>
                    <th>Passport country</th>
                    <th>Phone</th>
                </tr>
                <tr
                    v-for="(user, index) in users"
                    class="table_row"
                    :class="{
                        active: index === selectedUser,
                    }"
                    @click="selectUser(index)"
                >
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ format(new Date(user.birthday), 'dd-MM-yyyy') }}</td>
                    <td>{{ user.passportNumber }}</td>
                    <td>{{ user.passportCountry.name }}</td>
                    <td>{{ user.phone }}</td>
                </tr>
            </table>
            <div class="remove-button">
                <Button
                    label="Remove passenger"
                    @click="removePassenger"
                />
            </div>
        </template>
        <div
            v-if="users.length"
            class="actions"
        >
            <Button
                label="Back to search for flights"
                @click="backForFlights"
            />
            <Button
                label="Confirm booking"
                @click="confirm"
            />
        </div>
        <Dialog
            :visible="isModalOpen"
            modal
        >
            <div class="title">
                Total amount: {{ (outboundFlights.price || 0 + returnFlights.price || 0) * users.length }}
            </div>
            <div class="title">
                Paid using:
            </div>
            <div class="paid-using-actions">
                <label><RadioButton
                    v-model="paidUsing"
                    name="paidUsing"
                    value="Credit card"
                /> Credit card</label>
                <label><RadioButton
                    v-model="paidUsing"
                    name="paidUsing"
                    value="Cash"
                /> Cash</label>
                <label><RadioButton
                    v-model="paidUsing"
                    name="paidUsing"
                    value="Voucher"
                /> Voucher</label>
            </div>
            <template v-if="tickets.length">
                <div
                    v-for="(ticket, index) in tickets"
                    :key="index"
                    class="passenger"
                >
                    <div>Номер билета: {{ ticket.id }}</div>
                    <div>Пассажир: {{ ticket.first_name }} {{ ticket.last_name }}</div>
                </div>
            </template>
            <div class="issue-tickets-actions">
                <Button
                    label="Issue tickets"
                    @click="issueTickets"
                />
                <Button
                    label="Cancel"
                    @click="cancel"
                />
            </div>
        </Dialog>
    </div>
</template>

<script>
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import { format } from 'date-fns';
import { mapGetters } from 'vuex';
import {PATHS} from "@/constants.js";

export default {
    name: 'Booking',
    components: {
        InputText,
        Calendar,
        InputNumber,
        InputMask,
        Dropdown,
        Button,
        Dialog,
        RadioButton
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            birthday: '',
            passportNumber: null,
            passportCountry: '',
            phone: '',
            users: [],
            selectedUser: null,
            isModalOpen: false,
            paidUsing: ''
        };
    },
    computed: {
        ...mapGetters('flight', ['outboundFlights', 'returnFlights']),
        ...mapGetters('country', ['countries']),
        ...mapGetters('ticket', ['tickets'])
    },
    created() {
        this.$store.dispatch('country/getCountries');
    },
    methods: {
        format,
        addPassenger() {
            this.users.push({
                firstName: this.firstName,
                lastName: this.lastName,
                birthday: this.birthday,
                passportNumber: this.passportNumber,
                passportCountry: this.passportCountry,
                phone: this.phone,
            });

            this.firstName = '';
            this.lastName = '';
            this.birthday = '';
            this.passportNumber = null;
            this.passportCountry = '';
            this.phone = '';
        },
        selectUser(index) {
            if (index === this.selectedUser) {
                this.selectedUser = null;
            }

            this.selectedUser = index;
        },
        removePassenger() {
            this.users.splice(this.selectedUser, 1);
            this.selectedUser = null;
        },
        confirm() {
            this.isModalOpen = true;
        },
        cancel() {
            this.isModalOpen = false;
            this.$store.dispatch('ticket/removeTickets');
        },
        issueTickets() {
            this.$store.dispatch('ticket/createTickets', {
                users: this.users,
                outboundFlights: this.outboundFlights,
                returnFlights: this.returnFlights
            });
        },
        backForFlights() {
            this.$router.push(PATHS.FLIGHT);
        }
    },
}
</script>

<style scoped lang="scss">
h2 {
  margin: 24px 0;
}

.form {
  display: flex;
  flex-direction: column;
}

.fields {
  display: flex;
  justify-content: space-between;
  padding: 16px 0 16px;
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 64px;
}

.remove-button {
    display: flex;
    justify-content: flex-end;
}

.button {
  align-self: end;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #000;
}

.active {
  background: rgb(223, 223, 223) !important;
}

.table {
  width: 100%;
  border: 3px solid black;
  border-collapse: collapse;
  margin: 16px 0 32px;

  &_header {
    background: grey;
    border: 3px solid black;

    th {
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

.paid-using-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.issue-tickets-actions {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 64px;
}

.title {
  margin-bottom: 16px;
}

.passenger {
  border: 1px solid #000000;
  padding: 12px;
}
</style>
