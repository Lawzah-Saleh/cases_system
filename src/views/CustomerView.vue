<template>
  <div class="table-container">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="main-header">Clients</h2>
      </div>

      <!-- GLOBAL BUTTON CLASS -->
      <button class="add-button">
        Create Customers
      </button>
    </div>

    <!-- TABLE -->
    
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Profile</th>
          <th>City</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in dummyData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>●</td>
          <td>{{ item.city }}</td>
          <td>⋮</td>
        </tr>
      </tbody>
    </table>
   

  </div>
</template>

<script>
export default {
  data() {
    return {
      dummyData: [
        { id: '01', name: 'Alamal Bank', email: 'support@temmam.com', city: 'Sanaa' },
        { id: '01', name: 'Alamal Bank', email: 'support@temmam.com', city: 'Sanaa' },
        { id: '01', name: 'Alamal Bank', email: 'support@temmam.com', city: 'Sanaa' },
      ]
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}


</style>
