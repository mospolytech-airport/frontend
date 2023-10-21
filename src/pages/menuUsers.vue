<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">X</button>
        </div>
        <div class="header-button">
            <button @click="logout">Exit</button>
        </div>
        <div class="user-info">
            <p>Hi {{ user?.first_name }}, Welcome to AMONIC Airlines Automation System</p>
            <div class="system-info">
                <p>Time spent on system: {{ totalSystemTime }}</p>
                <p>Number of crashes: {{ numberOfCrashes }}</p>
            </div>
        </div>
        <DataTable :value="userData" tableStyle="min-width: 50rem">
            <Column field="loginDate" header="Date"></Column>
            <Column field="loginTime" header="Login time"></Column>
            <Column field="logoutTime" header="Logout time"></Column>
            <Column field="timeSpent" header="Time spent on system"></Column>
            <Column field="error" header="Unsuccessful logout reason"></Column>
      </DataTable>
    </main>
</template>

<script>
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { format, differenceInMilliseconds, intervalToDuration } from 'date-fns';
import { mapGetters } from 'vuex';

import { addZero } from '../utils/add-zero';
import { PATHS } from '../constants';

export default {
    name: 'menu-users',
    components: {
      Button,
      DataTable,
      Column
    },
    computed: {
        totalSystemTime() {
            const sumTimeSpent = this.userData.reduce((acc, { timeSpentMs }) => acc + timeSpentMs, 0);
            const { hours, minutes, seconds } = intervalToDuration({ start: 0, end: sumTimeSpent });

            return `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
        },
        numberOfCrashes() {
          return this.userData.filter(({error}) => error).length;
        },
        userData() {
          const user = this.user;
          const userData = [];

          if (user && user.login_logout_times) {
            for (const [login, logout] of Object.entries(user.login_logout_times)) {
              let timeSpent;

              const { logout_time, error } = logout || {};
              const loginDate = login && format(new Date(login), 'dd.MM.yyyy');
              const loginTime = login && format(new Date(login), 'HH:mm:ss');
              const logoutTime = logout_time && format(new Date(logout_time), 'HH:mm:ss');
              const timeSpentMs = login && logout_time && differenceInMilliseconds(new Date(login), new Date(logout_time));

              if (timeSpentMs) {
                const { hours, minutes, seconds } = intervalToDuration({ start: 0, end: timeSpentMs });

                timeSpent = `${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
              }

              userData.push({
                loginDate,
                loginTime,
                logoutTime,
                timeSpent,
                timeSpentMs: timeSpentMs || 0,
                error
              });
            }
          }
      
          return userData;
        },      
        ...mapGetters('auth', ['user']),
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
.admin-menu {
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
.user-info {
    margin: 35px 20px;
}
.system-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    p {
        margin-right: 200px;
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
</style>