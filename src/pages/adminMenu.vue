<template>
    <main class="admin-menu">
      <div class="header-button">
        <Button>Add User</Button>
        <Button>Exit</Button>
      </div>
      <Dropdown v-model="office" :options="offices" optionLabel="title" showClear></Dropdown>
      <!-- Убрать админа, нормально заверстать и добавить роль и оффис вместо айдишника  -->
      <DataTable :value="users" tableStyle="min-width: 50rem">
        <Column field="first_name" header="Name"></Column>
        <Column field="last_name" header="Last Name"></Column>
        <Column field="birthday" header="Age"></Column>
        <Column field="role" header="User Role"></Column>
        <Column field="email" header="Email Adress"></Column>
        <Column field="office" header="Office"></Column>
      </DataTable>
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
      }  
    },
  computed: {
      users () {
        const users = this.$store.state.auth.users; 
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

<style scoped>
</style>