<template>
    <div class="survey-page">
        <div class="header-cont">
            <p>Flight Satisfactions Survey Reports</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button>    
                <router-link to="/reports-survey">
                    View Results Summary |
                </router-link>
            </button>
            <button>            
                <router-link to="/reports-survey/detail">
                    View Detailed Results |
                </router-link>
            </button>
            <button @click="logout">
                Exit
            </button>
        </div>
        <div class="main">
            <div class="user-info">
                <p>Fieldwork: {{ fieldworkStartDate }} - {{ fieldworkEndDate }}</p>
                <p>Sample Size: {{ surveys?.length }}</p> 
            </div>
            <table class="table">
                <!-- Заголовок таблицы -->
                <tr class="table_header">
                    <th colspan="2">
                        Gender
                    </th>
                    <th colspan="4">
                        Age
                    </th>
                    <th colspan="3">
                        Cabin Type
                    </th>
                    <th colspan="5">
                        Destination Airport
                    </th>
                </tr>
                <!-- Субзаголовок таблицы -->
                <tr class="table_subheader">
                    <th>Male</th>
                    <th>Female</th>

                    <th>18-24</th>
                    <th>25-39</th>
                    <th>40-59</th>
                    <th>60+</th>

                    <th>Economy</th>
                    <th>Business</th>
                    <th>First</th>

                    <th>AUH</th>
                    <th>BAH</th>
                    <th>DOH</th>
                    <th>RUH</th>
                    <th>CAI</th>
                </tr>
                <tr class="table_row">
                    <td>{{ countGender('M') }}</td>
                    <td>{{ countGender('F') }}</td>
                    <td>{{ countAgeRange(18, 24) }}</td>
                    <td>{{ countAgeRange(25, 39) }}</td>
                    <td>{{ countAgeRange(40, 59) }}</td>
                    <td>{{ countAgeRange(60, 999) }}</td>
                    <td>{{ countCabinType('Economy') }}</td>
                    <td>{{ countCabinType('Business') }}</td>
                    <td>{{ countCabinType('First') }}</td>
                    <td>{{ countAirport('AUH') }}</td>
                    <td>{{ countAirport('BAH') }}</td>
                    <td>{{ countAirport('DOH') }}</td>
                    <td>{{ countAirport('RUH') }}</td>
                    <td>{{ countAirport('CAI') }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { PATHS } from '../constants';

export default {
    name: 'ReportsSurvey',
    computed: {
        surveys() {
            return this.$store.state.survey.surveys;
        },
        fieldworkStartDate() {
            return this.formatDate(this.surveys[0]?.month);
        },
        fieldworkEndDate() {
            return this.formatDate(this.surveys[this.surveys.length - 1]?.month);
        }
    },

    created() {
        this.$store.dispatch('survey/surveys');
    },
    methods: {
        countGender(gender) {
            return this.surveys.filter(item => item.gender === gender).length;
        },
        countAgeRange(min, max) {
            return this.surveys.filter(item => item.age >= min && item.age <= max).length;
        },
        countCabinType(cabinType) {
            return this.surveys.filter(item => item.cabintype === cabinType).length;
        },
        countAirport(airport) {
            return this.surveys.filter(item => item.arrival === airport).length;
        },
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        formatDate(dateString) {
            if (!dateString) {
                return "";
            }
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        },    
    },
}
</script>

<style lang="scss" scoped>
.users-menu {
    width: 100vw;
    height: 100vh;
    border: solid 3px;
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
.main {
    margin: 35px 20px;
}
.user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 2px;
    margin-bottom: 20px;
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
    &_subheader {
        background: grey;
        border: 3px solid black;
        th {
            text-align: start;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
    &_row {
        td {
            padding: 2px;
            border-left: 3px solid black;
        }
    }
}

</style>