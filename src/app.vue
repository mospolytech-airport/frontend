<template class="wrapper">
    <router-view />
</template>

<script>
    import { PATHS } from './constants';

    export default {
        name: 'App',
        data() {
          return {
            isClosePage: true
          }
        },
        beforeRouteLeave(to, from, next) {
          this.isClosePage = false;

          next();
        },
        created() {
            this.$store.dispatch('auth/me').catch(() => {
                this.$router.push(PATHS.LOGIN);
            })
        },
        mounted() {
          window.addEventListener('beforeunload', () => {
            this.$store.dispatch('auth/logout', {
              error: 'Закрыл вкладку браузера без выхода из системы'
            })
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