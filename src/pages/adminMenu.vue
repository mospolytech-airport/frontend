<template>
    <main class="admin-menu">
        <div class="header-cont">
            <p>AMONIC Airlines Automation System</p>
            <button @click="logout">
                X
            </button>
        </div>
        <div class="header-button">
            <button>Add User</button>
            <button @click="logout">
                Exit
            </button>
        </div>
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
                    :value="office.id"
                >
                    {{ office.title }}
                </option>
            </select>
        </div>
        <DataTable
            v-model:selection="selectedUser"
            :value="users"
            selection-mode="single"
            data-key="id"
            table-style="min-width: 50rem"
        >
            <Column
                field="first_name"
                header="Name"
            />
            <Column
                field="last_name"
                header="Last Name"
            />
            <Column
                field="birthday"
                header="Age"
            />
            <Column
                field="role"
                header="User Role"
            />
            <Column
                field="email"
                header="Email Adress"
            />
            <Column
                field="office"
                header="Office"
            />
        </DataTable>
        <div class="buttons">
            <button @click="changeRole">
                Change Role
            </button>
            <button @click="toggleUser">
                Enable/Disable Login
            </button>
        </div>	
    </main>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
    name: 'AdminMenu',
    components: {
        DataTable,
        Column
    },
    data() {
        return {
            office: "",
            selectedUser: null,
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
            return this.$store.state.apps.offices;
        }
    },
    created() {
        this.$store.dispatch('auth/users', this.user);
        this.$store.dispatch('apps/offices', this.user);
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push(PATHS.LOGIN);
        },
        toggleUser() {
            console.log(this.selectedUser)
        },
        changeRole() {
            console.log(this.selectedUser)
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
.office {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.buttons {
	margin: 1rem;
	display: flex;
	gap: 1rem;
	button {
		border: 2ps solid black;
		border-radius: 0;
		cursor: pointer;
		font-size: 20px;
		background: 0;
	}
}
</style>