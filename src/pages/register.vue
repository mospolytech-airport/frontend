<template>
    <main class="register-page">
        <div class="form">
            <div class="form__field">
                <label for="email">Email address:</label>
                <InputText type="email" v-model="user.email" :style="{ width: '25vw' }" placeholder="Email" />
            </div>
            <div class="form__field">
                <label for="FirstName">First name:</label>
                <InputText type="text" v-model="user.firstname" :style="{ width: '25vw' }" placeholder="Firstname"/>
            </div>
            <div class="form__field">
                <label for="LastName">Last name:</label>
                <InputText type="text" v-model="user.lastname" :style="{ width: '25vw' }" placeholder="Lastname"/>
            </div>
            <div class="form__field">
                <label for="Office">Office</label>
                <Dropdown v-model="user.office" editable :options="cities" placeholder="Select an Office" :style="{ width: '25vw' }"/>
            </div>
            <div class="form__field">
                <label for="birthdate">Birthdate:</label>
                <Calendar v-model="user.birthdate" dateFormat="dd/mm/yy" showIcon :style="{ width: '25vw' }" placeholder="dd/mm/yy"/>
            </div>
            <div class="form__field">
                <label for="password">Password:</label>
                <InputText type="password" :style="{ width: '25vw' }" placeholder="Password" v-model="user.password"/>
            </div>
            <div class="form__buttons">
                <Button @click="login" label="Save" />
                <Button @click="login" label="Cancel" />
            </div>
        </div>
    </main>
</template>

<script>

    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import Dropdown from 'primevue/dropdown';
    import Calendar from 'primevue/calendar'

    export default {
        components: {
            InputText,
            Button,
            Dropdown,
            Calendar,
        },
        data() {
            return {
                cities:[1,2,3],
                user: {
                    email: '',
                    firstname: '',
                    lastname: '',
                    birthdate: '',
                    office: '',
                    password: '',
                }
            };
        },
        name: 'RegisterPage',
    }
</script>

<style lang="scss" scoped>
.form{
    padding-top: 86px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 50%;
    margin: 0 auto;
    row-gap: 24px;

    &__field{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    &__buttons{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>