<template>
    <div class="container">
        <h1>AMONIC Airlines Automation System</h1>
        <button @click="exit">Exit</button>
        <div class="user-info">
            <p>Hi {{ fullname }}, Welcome to AMONIC Airlines Automation System</p>
            <p>Time spent on system: {{ time }}</p>
            <p>Number of crashes: {{ crashes }}</p>
        </div>
        <table class="activity-list">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Total Time</th>
                    <th>Reason for Crash</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="activity in activities" :key="activity.id" :class="{ 'crash': activity.crash }">
                    <td>{{ activity.date }}</td>
                    <td>{{ activity.timeIn }}</td>
                    <td>{{ activity.timeOut }}</td>
                    <td>{{ activity.totalTime }}</td>
                    <td>{{ activity.crashReason }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'menu-users',
    methods: {

    }

}
</script>

<style lang="scss" scoped></style>