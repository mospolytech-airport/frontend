<template>
    <main class="home-page">
        <router-link to="/login">
            <div>Logout</div>
        </router-link>
        <router-link to="/menu-user">
            <div>Menu user</div>
        </router-link>
        <router-link
            v-if="['Administrator', null].includes(user.role)"
            to="/admin"
        >
            <div>Admin</div>
        </router-link>
        <router-link
            v-if="['Administrator', null].includes(user.role)"
            to="/reports-survey"
        >
            <div>Reports Survey</div>
        </router-link>
        <router-link
            v-if="['Administrator', null].includes(user.role)"
            to="/schedules"
        >
            <div>Schedules</div>
        </router-link>
        <router-link to="/flight">
            <div>Buy ticket</div>
        </router-link>
        <router-link to="/additional">
            <div>Amenities</div>
        </router-link>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'HomePage',
    computed: {
        ...mapGetters('auth', ['user'])
    }
}
</script>

<style scoped>
  div {
      padding: 12px;
      display: inline-block;
      background: #234f;
      color: white;
    margin: 12px;
  }
</style>
