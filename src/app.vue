<template class="wrapper">
    <router-view />
</template>

<script>
    import { PATHS } from './constants';

    export default {
        name: 'App',
        created() {
            this.$store.dispatch('auth/me').catch(() => {
                this.$router.push(PATHS.LOGIN);
            })
        }
    }
</script>

<style>
    @import './styles/reset.css';
    @import './styles/global.css';
    @import './styles/fonts.css';
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
</style>