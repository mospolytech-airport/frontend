<template>
    <Dialog
        :visible="isLogoutModalOpen"
        modal
    >
        <h2 class="title">
            No logout detected for your last login on {{ loginTime }}
        </h2>
        <label
            class="label"
            for="reason"
        >
            Reason:
        </label>
        <textarea
            id="reason"
            v-model="reason"
            class="textarea"
            rows="5"
        />
        <div class="actions">
            <label>
                Software Crash
                <RadioButton
                    v-model="crash"
                    name="crash"
                    value="Software Crash"
                />
            </label>
            <label>
                System Crash
                <RadioButton
                    v-model="crash"
                    name="crash"
                    value="System Crash"
                />
            </label>
            <Button
                label="Confirm"
                @click="logout"
            />
            <Button
                label="Cancel"
                @click="cancel"
            />
        </div>
    </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import { PATHS } from '@/constants';

export default {
    name: 'LogoutModal',
    components: {
        Dialog,
        RadioButton,
        Button
    },
    data() {
        return {
            crash: '',
            reason: ''
        }
    },
    computed: {
        loginTime() {
            const user = this.user;
            const login = Object.keys(user.login_logout_times).at(-1);

            return `${format(new Date(login), 'dd.MM.yyyy')} ${format(new Date(login), 'HH:mm:ss')}`;
        },
        ...mapGetters('auth', ['isLogoutModalOpen', 'user']),
    },
    methods: {
        logout() {
            const self = this;

            this.$store.dispatch('auth/logout', {
                error: self.reason
            }).then(() => {
                self.$router.push(PATHS.LOGIN);
            });

            this.$store.dispatch('auth/toggleIsLogoutModalOpen');
        },
        cancel() {
            this.$store.dispatch('auth/toggleIsLogoutModalOpen');
        }
    }
}
</script>

<style scoped>
  .title {
    margin-bottom: 32px;
  }

  .label {
    display: block;
    margin-bottom: 24px;
  }

  .textarea {
    width: 100%;
    margin-bottom: 24px;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>