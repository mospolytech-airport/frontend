<template>
  <main class="page">
    <div class="container">
      <img class="logo" src="../assets/logo.png" />
      <fieldset class="big-review">
        <legend>In the last 30 days ...</legend>
        <fieldset class="big-review__element">
          <legend>Flights</legend>
          <div class="big-review__item">
            <p class="big-review__heading">Number confirmed:</p>
            <p>{{ confirmedTickets.confirmed }}</p>
          </div>
          <div class="big-review__item">
            <p class="big-review__heading">Number cancelled:</p>
            <p>{{ confirmedTickets.cancelled }}</p>
          </div>
          <div class="big-review__item">
            <p class="big-review__heading">Average daily flight time:</p>
            <p>{{ averageTime }} minutes</p>
          </div>
        </fieldset>
        <fieldset class="big-review__element">
          <legend>Top Customers (Number of purchase)</legend>
          <div
            v-for="(customer, index) in topCustomers"
            :key="index"
            class="big-review__item"
          >
            <p>
              {{ index + 1 }}. {{ customer.first_name }}
              {{ customer.last_name }} ({{ customer.k }} Tickets)
            </p>
          </div>
        </fieldset>
        <fieldset class="big-review__element">
          <legend>Number of passangers flying</legend>
          <div class="big-review__item">
            <p class="big-review__heading">Busiest day:</p>
            <p>{{ loadDate.max.date }} with {{ loadDate.max.k }} flying</p>
          </div>
          <div class="big-review__item">
            <p class="big-review__heading">Most quiet day:</p>
            <p>{{ loadDate.min.date }} with {{ loadDate.min.k }} flying</p>
          </div>
        </fieldset>
        <fieldset class="big-review__element">
          <legend>Top AMONIC Airlines Offices (Revenue)</legend>
          <div
            v-for="(office, index) in topOffices"
            :key="index"
            class="big-review__item"
          >
            <p>{{ index + 1 }}. {{ office.name }}</p>
          </div>
        </fieldset>
      </fieldset>
      <fieldset class="small-review">
        <legend>Revenue from ticket sales</legend>
        <div class="small-review__item">
          <p>Yesterday:</p>
          <p>{{ reportFirst.cost }} $</p>
        </div>
        <div class="small-review__item">
          <p>Two days ago:</p>
          <p>{{ reportSecond.cost }} $</p>
        </div>
        <div class="small-review__item">
          <p>Three days ago:</p>
          <p>{{ reportThird.cost }} $</p>
        </div>
      </fieldset>
      <fieldset class="small-review">
        <legend>Weekly report of percentage of empty seats</legend>
        <div class="small-review__item">
          <p>This week: {{ reportFirst.percent }}</p>
        </div>
        <div class="small-review__item">
          <p>Last week: {{ reportSecond.percent }}</p>
        </div>
        <div class="small-review__item">
          <p>Two weeks ago: {{ reportThird.percent }}</p>
        </div>
      </fieldset>
      <div class="finish">
        <p>Report generated in {{ render }} seconds</p>
        <button @click="ShowRender">Show rener time</button>
        <button>X Close</button>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { ticketModule } from '../store/modules/ticket';

export default {
  name: 'Review',
  data() {
    return {
      startrender: null,
      finishrender: null,
      // today: new Date(),
      today: new Date('2018-01-03T03:24:00'),
      renderTime: 0
    };
  },
  methods: {
    ShowRender() {
      this.renderTime = (this.finishrender - this.startrender) / 1000
    }
  },
  computed: {
    ...mapGetters('ticket', ['tickets']),
    ...mapGetters('schedule', ['schedules']),
    ...mapGetters('auth', ['users', 'user']),

    correctSchedule() {
      let result = [];
      this.schedules.forEach((e) => {
        let date = new Date(e.Date + 'T' + e.Time);
        let today = this.today;
        if (
          date.valueOf() + 2592000000 >= today.valueOf() &&
          date.valueOf() <= today.valueOf()
        ) {
          result.push(e);
        }
      });
      return result;
    },

    correctTickets() {
      let result = [];
      this.correctSchedule.forEach((schedule) => {
        this.tickets.forEach((ticket) => {
          if (schedule.id == ticket.schedule) {
            result.push(ticket);
          }
        });
      });
      return result;
    },

    confirmedTickets() {
      let result = {
        confirmed: 0,
        cancelled: 0,
      };
      this.correctTickets.forEach((e) => {
        if (e.confirmed == true) {
          result.confirmed += 1;
        } else {
          result.cancelled += 1;
        }
      });
      return result;
    },

    averageTime() {
      let result = 0;
      let sum = 0;
      let k = this.correctTickets.length;
      this.correctTickets.forEach((ticket) => {
        this.correctSchedule.forEach((schedule) => {
          if (ticket.schedule == schedule.id) {
            sum += schedule.Route.FlightTime;
          }
        });
      });
      result = Math.round(sum / k);
      return result;
    },

    topCustomers() {
      let result = [];
      let correct = [];
      this.correctTickets.forEach((e) => {
        let Customer = {
          first_name: e.first_name,
          last_name: e.last_name,
          k: 1,
        };
        if (
          correct.some(
            (x) =>
              x.first_name == Customer.first_name &&
              x.last_name == Customer.last_name
          )
        ) {
          let found = correct.find(
            (e) =>
              e.first_name == Customer.first_name &&
              e.last_name == Customer.last_name
          );
          found.k += 1;
        } else {
          correct.push(Customer);
        }
      });
      result = correct.sort(function (a, b) {
        return b.k - a.k;
      });
      return result.slice(0, 3);
    },

    allUsers() {
      let result = [];
      this.users.forEach((e) => {
        result.push(e);
      });
      result.push(this.user);
      return result;
    },

    loadDate() {
      let result = {};
      let correct = [];
      let dates = [];
      this.correctTickets.forEach((e) => {
        if (e.confirmed == true) {
          correct.push(e);
        }
      });
      correct.forEach((ticket) => {
        this.correctSchedule.forEach((schedule) => {
          if (ticket.schedule == schedule.id) {
            let date = {
              date: schedule.Date,
              k: 1,
            };
            if (dates.some((x) => x.date == date.date)) {
              let found = dates.find((x) => x.date == date.date);
              found.k += 1;
            } else {
              dates.push(date);
            }
          }
        });
      });
      dates = dates.sort(function (a, b) {
        return b.k - a.k;
      });
      result = {
        max: dates[0],
        min: dates[dates.length - 1],
      };
      return result;
    },

    topOffices() {
      let result = [];
      let correct = [];
      this.correctTickets.forEach((ticket) => {
        this.allUsers.forEach((user) => {
          if (ticket.user == user.id) {
            let office = {
              name: user.office,
              k: 1,
            };
            if (correct.some((x) => x.name == user.office)) {
              let found = correct.find((e) => e.name == user.office);
              found.k += 1;
            } else {
              correct.push(office);
            }
          }
        });
      });
      result = correct.sort(function (a, b) {
        return b.k - a.k;
      });
      return result.slice(0, 3);
    },

    ticket_schedule() {
      let result = [];
      this.correctTickets.forEach((ticket) => {
        this.correctSchedule.forEach((schedule) => {
          if (ticket.schedule == schedule.id) {
            let tick = ticket;
            tick.schedule = schedule;
            result.push(tick);
          }
        });
      });
      return result;
    },

    ticket_week() {
      let count = {
        first: {
          schedules: [],
          tickets: [],
        },
        second: {
          schedules: [],
          tickets: [],
        },
        third: {
          schedules: [],
          tickets: [],
        },
      };
      let thisWeek = this.today.valueOf() - 604800000;
      let lastWeek = this.today.valueOf() - 1209600000;
      let twoWeek = this.today.valueOf() - 1814400000;
      this.ticket_schedule.forEach((e) => {
        let date = new Date(e.schedule.Date + 'T' + e.schedule.Time);
        if (
          date.valueOf() <= this.today.valueOf() &&
          date.valueOf() >= thisWeek
        ) {
          count.first.tickets.push(e);
          if (
            count.first.schedules.some(
              (x) => x == e.schedule
            ) != true
          ) {
            count.first.schedules.push(e.schedule);
          }
        } else if (date.valueOf() <= thisWeek && date.valueOf() >= lastWeek) {
          count.second.tickets.push(e);
          if (
            count.second.schedules.some(
              (x) => x == e.schedule
            ) != true
          ) {
            count.second.schedules.push(e.schedule);
          }
        } else if (date.valueOf() <= lastWeek && date.valueOf() >= twoWeek) {
          count.third.tickets.push(e);
          if (
            count.third.schedules.some(
              (x) => x == e.schedule
            ) != true
          ) {
            count.third.schedules.push(e.schedule);
          }
        }
      });
      return count;
    },

    reportFirst() {
      let result = {}
      let count = 0
      let cost = 0
      this.ticket_week.first.schedules.forEach((e) => {
        count += e.Aircraft.TotalSeats
      })
      this.ticket_week.first.tickets.forEach((e) => {
        cost += Number(e.schedule.EconomyPrice)
      })
      count = 100 - (Math.round((this.ticket_week.first.tickets.length / count) * 10000) / 100)
      result = {
        cost: cost,
        percent: count
      }
      return result
    },

    reportSecond() {
      let result = {}
      let count = 0
      let cost = 0
      this.ticket_week.second.schedules.forEach((e) => {
        count += e.Aircraft.TotalSeats
      })
      this.ticket_week.second.tickets.forEach((e) => {
        cost += Number(e.schedule.EconomyPrice)
      })
      count = 100 - (Math.round((this.ticket_week.second.tickets.length / count) * 10000) / 100)
      result = {
        cost: cost,
        percent: count
      }
      return result
    },

    reportThird() {
      let result = {}
      let count = 0
      let cost = 0
      this.ticket_week.third.schedules.forEach((e) => {
        count += e.Aircraft.TotalSeats
      })
      this.ticket_week.third.tickets.forEach((e) => {
        cost += Number(e.schedule.EconomyPrice)
      })
      count = 100 - (Math.round((this.ticket_week.third.tickets.length / count) * 10000) / 100)
      result = {
        cost: cost,
        percent: count
      }
      return result
    },

    // report() {
    //   let result = {};
    //   let first_count = 0;
    //   let second_count = 0;
    //   let third_count = 0
    //   this.ticket_week.first.schedules.forEach((e) => {
    //     first_count += e.Aircraft.TotalSeats
    //   })
    //   this.ticket_week.second.schedules.forEach((e) => {
    //     second_count += e.Aircraft.TotalSeats
    //   })
    //   this.ticket_week.third.schedules.forEach((e) => {
    //     third_count += e.Aircraft.TotalSeats
    //   })
    //   result = {
    //     first: this.ticket_week.first.tickets.length / first_count,
    //     second: this.ticket_week.second.tickets.length / second_count,
    //     third: this.ticket_week.third.tickets.length / third_count,
    //   }
    //   if (Number.isNaN(result.first)) {
    //     result.first = 0
    //   }
    //   if (Number.isNaN(result.second)) {
    //     result.second = 0
    //   }
    //   if (Number.isNaN(result.third)) {
    //     result.third = 0
    //   }
    //   return result;
    // },

    render() {
      return (this.finishrender - this.startrender) / 1000;
    },

    // confirmedTickets() {
    //     let result = []

    //     return result
    // },
  },
  created() {
    this.$store.dispatch('schedule/schedules');
    this.$store.dispatch('ticket/getTickets');
    this.$store.dispatch('auth/users');
    this.$store.dispatch('auth/me');
    this.startrender = new Date();
  },
  mounted() {
    this.finishrender = new Date();
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}
.logo {
  margin: 0 auto;
  width: 40%;
  margin-bottom: 50px;
}

.big-review {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 30px;

  &__element {
    display: flex;
    flex-direction: column;
    width: 40.8vw;
    justify-content: space-around;
  }

  &__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 6vh;
  }

  &__heading {
    min-width: 205px;
  }
}

.small-review {
  display: flex;
  flex-direction: row;
  padding: 20px 30px;
  justify-content: space-between;

  &__item {
    display: flex;
    flex-direction: row;
    column-gap: 5px;
  }
}

.finish {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>