<template>
    <main class="page">
        <div class="container">
            <template v-if="status === 'loading'">
                <ProgressSpinner />
            </template>
            <template v-else>
                <form
                    class="input-group"
                    @submit="apply"
                >
                    <InputText
                        v-model="editUser.email"
                        placeholder="Email address"
                    />
                    <InputText
                        v-model="editUser.first_name"
                        placeholder="First name"
                    />
                    <InputText
                        v-model="editUser.last_name"
                        placeholder="Last name"
                    />
                    <Dropdown
                        v-model="editUser.office"
                        :options="offices"
                        option-label="title"
                        placeholder="Office"
                    />
                    <div class="role-block">
                        <div>Role</div>
                        <div class="role-group">
                            <label>
                                <RadioButton
                                    v-model="editUser.role"
                                    name="role"
                                    value="user"
                                />
                                <span>User</span>
                            </label>
                            <label>
                                <RadioButton
                                    v-model="editUser.role"
                                    name="role"
                                    value="administrator"
                                />
                                <span>Administrator</span>
                            </label>
                        </div>
                    </div>
                    <div class="button-group">
                        <Button
                            type="submit"
                            label="Apply"
                            @click="apply"
                        />
                        <Button
                            label="Cancel"
                            @click="cancel"
                        />
                    </div>
                </form>
            </template>
        </div>
    </main>
</template>

<script>
import { mapGetters } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import ProgressSpinner from 'primevue/progressspinner';
import Dropdown from 'primevue/dropdown';

export default {
    name: 'EditPage',
    components: {
        InputText,
        Button,
        RadioButton,
        ProgressSpinner,
        Dropdown
    },
    data() {
        return {
            editUser: {
                email: '',
                firstName: '',
                lastName: '',
                office: '',
                role: ''
            }
        };
    },
    computed: {
        ...mapGetters('auth', ['status']),
        ...mapGetters('office', ['offices'])
    },
    mounted() {
        this.getEditUser();
        this.getOffices();
    },
    methods: {
        getEditUser() {
            this.$store.dispatch('auth/getEditUser', { id: this.$route.params.id })
                .then(() => {
                    const { email, first_name, last_name, office, role } = this.$store.state.auth.editUser || {};

                    this.editUser = {
                        email,
                        first_name,
                        last_name,
                        office,
                        role
                    }
                });
        },
        getOffices() {
            this.$store.dispatch('office/offices');
        },
        apply() {
            this.$store.dispatch('auth/edit', this.editUser);
        }
    }
}
</script>

<style scoped>
    .input-group {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        margin: 0 auto;
    }

    .role-block {
        display: flex;
        gap: 24px;
    }

    .role-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .role-group span {
        margin-left: 8px;
    }

    .button-group {
        display: flex;
        gap: 16px;
    }
</style>
