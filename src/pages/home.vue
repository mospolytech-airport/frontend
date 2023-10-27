<template>
    <main class="home-page">
        <router-link to="/menu-user">
            menuUser
        </router-link>
        <router-link to="/admin">
            admin
        </router-link>
        <router-link to="/reports-survey">
            Reports Survey
        </router-link>
        <router-link to="/schedules">
            Schedules
        </router-link>
    </main>
</template>

<script>
export default {
    name: 'HomePage',
}
</script>