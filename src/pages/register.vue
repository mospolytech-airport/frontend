<template>
    <main class="register-page">
        <div class="form">
            <div class="form__field">
                <label for="email">Email address:</label>
                <InputText
                    v-model="user.email"
                    type="email"
                    :style="{ width: '25vw' }"
                    placeholder="Email"
                />
            </div>
            <div class="form__field">
                <label for="FirstName">First name:</label>
                <InputText
                    v-model="user.first_name"
                    type="text"
                    :style="{ width: '25vw' }"
                    placeholder="Firstname"
                />
            </div>
            <div class="form__field">
                <label for="LastName">Last name:</label>
                <InputText
                    v-model="user.last_name"
                    type="text"
                    :style="{ width: '25vw' }"
                    placeholder="Lastname"
                />
            </div>
            <div class="form__field">
                <label for="Office">Office</label>
                <Dropdown
                    v-model="user.office"
                    :options="offices"
                    placeholder="Select an Office"
                    :style="{ width: '25vw' }"
                />
            </div>
            <div class="form__field">
                <label for="Role">Role</label>
                <Dropdown
                    v-model="user.role"
                    :options="['Administrator', 'User']"
                    placeholder="Select an Role"
                    :style="{ width: '25vw' }"
                />
            </div>
            <div class="form__field">
                <label for="birthdate">Birthdate:</label>
                <InputText
                    v-model="user.birthday"
                    type="text"
                    :style="{ width: '25vw' }"
                    placeholder="yyyy-mm-dd"
                />
            </div>
            <div class="form__field">
                <label for="password">Password:</label>
                <InputText
                    v-model="user.password"
                    type="password"
                    :style="{ width: '25vw' }"
                    placeholder="Password"
                />
            </div>
            <div class="form__buttons">
                <Button
                    label="Save"
                    @click="save"
                />
                <Button
                    label="Cancel"
                    @click="cancel"
                />
            </div>
        </div>
        <template v-if="error">
            <div class="text error">
                {{ error }}
            </div>
        </template>
    </main>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";

import { PATHS } from "../constants";

export default {
    name: "RegisterPage",
    components: {
        InputText,
        Button,
        Dropdown,
    },
    data() {
        return {
            date: null,
            user: {
                email: "",
                first_name: "",
                last_name: "",
                birthday: "",
                office: null,
                role: null,
                password: "",
            },
        };
    },
    computed: {
        error() {
            return this.$store.getters.auth.error;
        },
        office() {
            return this.$store.state.auth.offices;
        },
        offices() {
            let titles = [];

            this.office.forEach((element) => {
                titles.push(element.title);
            });

            return titles;
        },
    },
    created() {
        this.$store.dispatch("auth/offices", this.office);
    },
    methods: {
        cancel() {
            this.$router.push(PATHS.ADMIN);
        },

        save() {
            const self = this;
            
            self.$store.dispatch("auth/register", this.user).then(() => {
                self.$router.push(PATHS.ADMIN);
            });

            self.user.email = "";
            self.user.first_name = "";
            self.user.last_name = "";
            self.user.office = "";
            self.user.birthday = "";
            self.user.password = "";
            self.user.role = "";
        },
    },
};
</script>

<style lang="scss" scoped>
.form {
  padding-top: 86px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 50%;
  margin: 0 auto;
  row-gap: 24px;

  &__field {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
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