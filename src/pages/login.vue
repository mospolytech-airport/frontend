<template>
    <main class="page">
        <div class="container">
            <img
                class="logo"
                src="../assets/logo.png"
            >
            <template v-if="isBlocked">
                <div class="text">
                    Следующая попытка через: {{ leftTime }} сек
                </div>
            </template>
            <template v-else-if="error">
                <div class="text error">
                    {{ error }}
                </div>
            </template>
            <template v-else>
                <form @submit="login">
                    <div class="input-group">
                        <InputText
                            v-model="user.username"
                            placeholder="Username"
                        />
                        <InputText
                            v-model="user.password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div class="button-group">
                        <Button
                            type="submit"
                            label="Login"
                            @click="login"
                        />
                    </div>
                </form>
            </template>
        </div>
    </main>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { PATHS } from '../constants';
    
export default {
    name: 'LoginPage',
    components: {
        InputText,
        Button
    },
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            tryCount: 0,
            isBlocked: false,
            leftTime: 10
        };
    },
    computed: {
        error() {
            return this.$store.getters.getError;
        },
    },
    methods: {
        login(event) {
            if (event) {
                event.preventDefault();
            }

            const self = this;
                
            self.$store.dispatch('auth/login', this.user).then(() => {
                self.$router.push(PATHS.HOME);
            })

            self.user.username = '';
            self.user.password = '';
            self.tryCount++;

            if (self.tryCount > 3) {
                self.isBlocked = true;

                setTimeout(function timer() {
                    self.leftTime--;

                    if (self.leftTime === 0) {
                        self.isBlocked = false;
                        self.leftTime = 10;
                        self.tryCount = 0;
                    } else {
                        setTimeout(timer, 1000);
                    }
                }, 1000);
            }
        }
    },
}
</script>

<style scoped>
    .logo {
        margin: 0 auto;
        width: 50%;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        margin-top: 64px;
    }

    .input-group input {
        width: 50%;
    }

    .button-group {
        margin: 0 auto;
        width: 50%;
        margin-top: 48px;
    }

    .text {
        margin: 0 auto;
        text-align: center;
        margin-top: 64px;
        font-size: 24px;
        font-weight: 500;
    }

    .error {
        color: #ff0000;
    }
</style>
