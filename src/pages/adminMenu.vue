<template>
    <main class="admin-menu">
		<div class="header-cont">
				<p>AMONIC Airlines Automation System</p>
				<button @click="logout">X</button>
		</div>
		<div class="header-button">
			<button>Add User</button>
			<button @click="logout">Exit</button>
		</div>
		<div class="office">
			<p>Office:</p>
			<select class="office-selector" placeholder="Choose office" v-model="office">
				<option v-for="office in offices" v-bind:key="office.id">
					{{ office.title }}
				</option>
			</select>
		</div>
		<DataTable :value="users" v-model:selection="selectedUser" selectionMode="single" dataKey="id" tableStyle="min-width: 50rem">
			<Column field="first_name" header="Name"></Column>
			<Column field="last_name" header="Last Name"></Column>
			<Column field="birthday" header="Age"></Column>
			<Column field="role" header="User Role"></Column>
			<Column field="email" header="Email Adress"></Column>
			<Column field="office" header="Office"></Column>
		</DataTable>
		<div class="buttons">
			<button @click="changeRole">Change Role</button>
			<button @click="toggleUser">Enable/Disable Login</button>
		</div>	
    </main>
</template>

<script>
  	import Button from 'primevue/button';
  	import Dropdown from 'primevue/dropdown';
  	import DataTable from 'primevue/datatable';
  	import Column from 'primevue/column';
  
  	export default {
		name: 'AdminMenu',
		components: {
			Button,
			Dropdown,
			DataTable,
			Column
		},
		data() {
			return {
				office: "",
				selectedUser: null,
			}  
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
		},    
		computed: {
			users () {
				const users = this.$store.state.auth.users; 
				if (this.office) {
					return users.filter(user => user.office === this.office)
				}
				return users;
			},
			offices() {
				const offices = this.$store.state.apps.offices;
				return offices
			}
		},
		created() {
			this.$store.dispatch('auth/users', this.user);
			this.$store.dispatch('apps/offices', this.user);
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