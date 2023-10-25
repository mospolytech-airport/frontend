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
                <p>Fieldwork: </p>
                <p>Sample Size: </p> 
            </div>
            <DataTable
                :value="surveys"
                table-style="min-width: 50rem"
                showGridlines
                class="table"
            >
            <ColumnGroup type="header" >
                <Row>
                    <Column header="Gender" :colspan="2" />
                    <Column header="Age" :colspan="4" />
                    <Column header="Cabin Type" :colspan="3" />
                    <Column header="Destination Airport" :colspan="5" />
                </Row>
                <Row>
                    <Column header="Male" field="" />
                    <Column header="Female" field="femaleCount" />

                    <Column header="18-24" field="" />
                    <Column header="25-39" field="" />
                    <Column header="40-59" field="" />
                    <Column header="60+" field="" />

                    <Column header="Economy" field="" />
                    <Column header="Business" field="" />
                    <Column header="First" field="" />

                    <Column header="AUH" field="" />
                    <Column header="BAH" field="" />
                    <Column header="DOH" field="" />
                    <Column header="RYU" field="" />
                    <Column header="CAI" field="" />
                </Row>
            </ColumnGroup>
            </DataTable>
        </div>
    </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import ColumnGroup from 'primevue/columngroup';
import { mapGetters } from 'vuex';

import { PATHS } from '../constants';

export default {
    name: 'ReportsSurvey',
    components: {
        DataTable,
        Column,
        ColumnGroup,
        Row,
    },
    computed: {
        ...mapGetters('surveys', ['surveys']),

    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
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

</style>