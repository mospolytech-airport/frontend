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
            <p>Hi {{ users.first_name }}, Welcome to AMONIC Airlines Automation System</p>
            <div class="system-info">
                <p>Time spent on system: {{ totalSystemTime }}</p>
                <p>Number of crashes:</p>
            </div>
        </div>
        <DataTable :value="user" tableStyle="min-width: 50rem">
            <Column field="login_date" header="Date"></Column>
            <Column field="formatted_login_time" header="Login time"></Column>
            <Column field="formatted_logout_time" header="Logout time"></Column>
            <Column field="time_spent" header="Time spent on system"></Column>
            <!-- <Column field="error_msg" header="Unsuccessful logout reason"></Column> -->
      </DataTable>
    </main>
</template>

<script>
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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
          const [hours, minutes] = this.sumTimes(this.user).split('.');

          return `${hours}:${minutes}`;
        },
        user() {
          const user = this.$store.state.auth.user;
          const userData = [];

          if (user && user.login_logout_times) {
            for (const [date, time] of Object.entries(user.login_logout_times)) {
              const [login_date, login_time] = date.split('T');
              const logout_time = time || '-';

              let time_spent = '-';

              if (login_time !== '-' && logout_time !== '-') {
                  let loginTimeParts = login_time.split(':');
                  let logoutTimeParts = logout_time.split('T')[1].split(':');

                  // Преобразуйте часы и минуты в числа
                  const loginHours = parseInt(loginTimeParts[0], 10);
                  const loginMinutes = parseInt(loginTimeParts[1], 10);
                  const logoutHours = parseInt(logoutTimeParts[0], 10);
                  const logoutMinutes = parseInt(logoutTimeParts[1], 10);

                  // Рассчитайте разницу во времени
                  let hoursDifference = logoutHours - loginHours;
                  let minutesDifference = logoutMinutes - loginMinutes;

                  // Учесть случаи, когда разница может быть отрицательной
                  if (minutesDifference < 0) {
                    hoursDifference -= 1;
                    minutesDifference += 60;
                  }

                  // Форматирование разницы в часы и минуты
                  time_spent = `${hoursDifference}:${minutesDifference}`;
                }

              userData.push({
                  login_date,
                  formatted_login_time: this.formatTime(login_time),
                  formatted_logout_time: this.formatTime(logout_time),
                  time_spent
                });
            }
          }
      
          return userData;
        },       
      users() {
        return this.$store.state.auth.user;
      }  
    },
    created() {
      this.$store.dispatch('auth/user', this.user);
    },
    methods: {
        logout() {
          this.$store.dispatch('auth/logout');
          this.$router.push(PATHS.LOGIN);
        },
        formatTime(dateTime) {
          if (dateTime === '-') {
            return '-';
          }
          if (dateTime) {
              if (dateTime.includes('T')) {
                // Если dateTime содержит 'T', это login_time
                const [datePart, timePart] = dateTime.split('T');
                const [hours, minutes] = timePart.split(':');
                return `${hours}:${minutes}`;
              } else {
                // Иначе это logout_time
                const [hours, minutes] = dateTime.split(':');
                return `${hours}:${minutes}`;
              }
            }
          return ''; // Handle cases where dateTime is undefined or null
        },
        sumTimes(timeData) {
         let totalMinutes = 0;
                
         for (const timeEntry of timeData) {
           if (timeEntry.time_spent !== '-') {
             const [hours, minutes] = timeEntry.time_spent.split(':');
             totalMinutes += parseInt(hours, 10) * 60 + parseInt(minutes, 10);
           }
         }
     
         const days = Math.floor(totalMinutes / (60 * 24));

         totalMinutes = totalMinutes % (60 * 24);

         let hours = Math.floor(totalMinutes / 60);
         const minutes = totalMinutes % 60;
     
         // Если общее время превышает 24 часа, добавляем дни к часам
         if (days > 0) {
           hours += days * 24;
         }
     
         return `${hours}.${minutes}`;
        }
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