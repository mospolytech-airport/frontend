<template>
    <div class="survey-page">
        <div class="header-cont">
            <p>Flight Satisfactions Survey Reports</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button @click="logout">
                View Results Summary
            </button>
            <button @click="logout">
                View Detailed Results
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
                    <th colspan="2">Gender</th>
                    <th colspan="4">Age</th>
                    <th colspan="3">Cabin Type</th>
                    <th colspan="5">Destination Airport</th>
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
                    <th>RYU</th>
                    <th>CAI</th>
                </tr>
                <tr 
                    class="table_row" 
                    v-for="({id, departure, arrival, age, gender, cabintype, q1,q2,q3,q4 }) in surveys" :key="id"
                >
                    <td>{{ loginDate }}</td>
                    <td>{{ loginTime }}</td>
                    <td>{{ error }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { PATHS } from '../constants';

export default {
    name: 'ReportsSurvey',

    created() {
            this.$store.dispatch('surveys/surveys');
        },
    computed: {
        surveys() {
            return this.$store.state.surveys.surveys;
        },
        fieldworkStartDate() {
            return this.formatDate(this.surveys[0]?.month);
        },
        fieldworkEndDate() {
            return this.formatDate(this.surveys[this.surveys.length - 1]?.month);
        }
    },
    methods: {
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