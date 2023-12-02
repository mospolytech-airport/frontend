<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button @click="addUser">
                Add User
            </button>
            <button @click="logout">
                Exit
            </button>
        </div>
        <div class="content">
            <div class="office">
                <p>Office:</p>
                <select
                    v-model="office"
                    class="office-selector"
                    placeholder="Choose office"
                >
                    <option
                        v-for="office in offices"
                        :key="office.id"
                        :value="office.title"
                    >
                        {{ office.title }}
                    </option>
                </select>
                <span
                    v-if="office !== ''"
                    class="clear-button"
                    @click="removeFilter"
                >x</span>
            </div>
            <table class="table">
                <tr class="table_header">
                    <th>Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>User Role</th>
                    <th>Email Adress</th>
                    <th>Office</th>
                </tr>
                <tr
                    v-for="({id, first_name, last_name, birthday, role, email, office, is_active}) in users"
                    :key="id"
                    class="table_row"
                    :class="{ active: id === selectedUser?.id, disabled: !is_active, enabled: is_active}"
                    @click="selectRow(id)"
                >
                    <td>{{ first_name }}</td>
                    <td>{{ last_name }}</td>
                    <td>{{ birthday }}</td>
                    <td>{{ role }}</td>
                    <td>{{ email }}</td>
                    <td>{{ office }}</td>
                </tr>
            </table>
            <div class="buttons">
                <button @click="changeRole">
                    Edit Role
                </button>
                <button @click="toggleUser">
                    Enable/Disable Login
                </button>
            </div>
        </div>
    </main>
</template>

<script>
import { PATHS } from '../constants';

export default {
    name: 'AdminMenu',
    data() {
        return {
            office: "",
            selectedUser: null,
            isActive: null
        }
    },
    computed: {
        users() {
            const users = this.$store.state.auth.users;

            if (this.office) {
                return users.filter(user => user.office === this.office)
            }
            return users;
        },
        offices() {
            return this.$store.state.office.offices;
        }
    },
    created() {
        this.$store.dispatch('auth/users');
        this.$store.dispatch('office/offices');
    },
    methods: {
        addUser() {
            this.$router.push(PATHS.REGISTER);
        },
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        async toggleUser() {
            const email = this.selectedUser.email;
            const is_active = this.selectedUser.is_active === true ? false : true;
            try {
                await this.$store.dispatch('auth/editUser', { email, is_active });
            } catch (error) {
                console.error(error);
                return;
            }
            this.selectedUser.is_active = is_active;
        },
        changeRole() {
            const  { id } = this.selectedUser;

            this.$router.push(`/edit/${id}`);
        },
        selectRow(id) {
            this.selectedUser = this.users.find(user => user.id === id);
        },
        removeFilter() {
            this.office = "";
        }
    }
}
</script>

<style scoped lang="scss">
.admin-menu {
    width: 100vw;
    height: 100vh;
    border: solid 3px;
}
.header-button {
	display: flex;
	gap: 1rem;
}
.office-selector {
	margin: 1rem 0;
	width: 15rem;
}
.header-cont {
    padding: 0 5px;
    border-bottom: solid 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
    }

    button {
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }

}
.header-button{
    border-bottom: solid 3px;
    button {
      background-color: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }
}
.content {
    padding: 0 18px;
}
.office {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.buttons {
	display: flex;
    margin-top: 1rem;
	gap: 4rem;
	button {
		border: 2ps solid black;
		border-radius: 0;
		cursor: pointer;
		font-size: 16px;
		background: 0;
	}
}

.clear-button {
    position: relative;
    right: 43px;
    top: -1px;
    cursor: pointer;
}

.table {
    width: 100%;
    border: 3px solid black;
    border-collapse: collapse;
    &_header {
        background: grey;
        border: 3px solid black;
        th {
            text-align: start;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
    .active {
        background: rgb(223, 223, 223) !important;
    }
    .enabled {
        background: rgb(144, 231, 139);
    }
    .disabled {
        background-color: red;
        color: white;
    }
    &_row {
        td {
            cursor: pointer;
            padding: 2px;
            border-left: 3px solid black;
        }
    }
}
</style>
