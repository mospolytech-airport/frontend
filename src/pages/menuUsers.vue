<template>
    <main class="users-menu">
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
        <div class="user-info">
            <p>Hi {{ user?.first_name }}, Welcome to AMONIC Airlines Automation System</p>
            <div class="system-info">
                <p>Time spent on system: {{ totalSystemTime }}</p>
                <p>Number of crashes: {{ numberOfCrashes }}</p>
            </div>
        </div>
        <table class="table">
            <tr class="table_header">
                <th>Date</th>
                <th>Login time</th>
                <th>Logout time</th>
                <th>Time spent on system</th>
                <th>Unsuccessful logout reason</th>
            </tr>
            <tr 
                v-for="({id, loginDate, loginTime, logoutTime, timeSpent, error}) in userData" 
                :key="id"
                class="table_row"
                :class="{ hasError: error !== null }"
            >
                <td>{{ loginDate }}</td>
                <td>{{ loginTime }}</td>
                <td>
                    <span v-if="error !== null">**</span>
                    <span v-else>{{ logoutTime }}</span>
                </td>
                <td>
                    <span v-if="error !== null">**</span>
                    <span v-else>{{ timeSpent }}</span>
                </td>
                <td>{{ error }}</td>
            </tr>
        </table>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { format, differenceInMilliseconds, intervalToDuration } from 'date-fns';

import { addZero } from '../utils/add-zero';
import { PATHS } from '../constants';

export default {
    name: 'MenuUsers',
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
                    console.log(error)
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
.users-menu {
    width: 100vw;
    height: 100%;
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

    .hasError {
        background-color: red; /* Set the background color to red for rows with errors */
        color: white; /* You can adjust text color here */
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
            padding: 2px;
            border-left: 3px solid black;
        }
    }
}

</style>