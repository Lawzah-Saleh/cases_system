<template>
  <div class="table-container">
    <div class="flex items-center justify-between mb-4">
      <h2 class="main-header">Clients</h2>
      <button class="add-button">Create Clients</button>
    </div>

    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Profile</th>
          <th>Address</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in clients" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.email }}</td>
          <td>
            <img class="client-logo"v-if="item.logo_url" :src="item.logo_url" alt="Logo" width="30" />
            <span v-else>●</span>
          </td>
          <td>{{ item.address }}</td>
          <td class="action-cell">
            <div class="menu-trigger" @click="toggleMenu(item.id)">⋮</div>
            <div v-if="openMenu === item.id" class="menu-dropdown">
              <div class="menu-item" @click="editItem(item)">Edit</div>
              <div class="menu-item delete" @click="deleteItem(item)">Delete</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container flex items-center justify-between mt-4">
  <p class="text-result">{{ clients.length }} results</p>
  
  <div>
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="page-btn"
    >
      &lt; Prev
    </button>

    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === lastPage"
      class="page-btn"
    >
      Next &gt;
    </button>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    return {
      clients: [],
      openMenu: null,
      currentPage: 1,
      lastPage: 1,
    };
  },
  methods: {
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id;
    },
    editItem(item) {
      console.log('Edit:', item);
    },
    deleteItem(item) {
      console.log('Delete:', item);
    },

    async fetchClients(page = 1) {
      try {
        const authStore = useAuthStore();
        const token = authStore.token || localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/clients?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.clients = res.data.data; // paginated items are inside data
        this.currentPage = res.data.current_page;
        this.lastPage = res.data.last_page;
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    },

    changePage(page) {
      if (page < 1 || page > this.lastPage) return;
      this.fetchClients(page);
    },

    handleClickOutside(event) {
      const menuElements = document.querySelectorAll('.menu-dropdown, .menu-trigger');
      let clickedInside = false;
      menuElements.forEach((el) => {
        if (el.contains(event.target)) clickedInside = true;
      });
      if (!clickedInside) this.openMenu = null;
    },
  },
  mounted() {
    this.fetchClients();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>



<style scoped>

.model{
  background-color: white;
  display: block;
}

.action-cell { position: relative; }
.menu-trigger { cursor: pointer; font-size: 20px; padding: 5px; user-select: none; }
.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 120px;
  box-shadow: 0 4px 10px rgba(0,0,0,.15);
  z-index: 9999; 
}
.menu-item { padding: 10px; cursor: pointer; font-size: 14px; }
.menu-item:hover { background: #f4f4f4; }
.delete { color:red; }

/* Flex helpers */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }



.client-logo{
  width: 80px;
  border-radius: 50%;
}

.pagination-container {
  display: flex;
  justify-content: space-between; /* push items to edges */
  align-items: center;            /* vertically center them */
  margin-top: 1rem;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border-color: gray;
  background-color: white;
  cursor: pointer;
  margin-left: 5px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-result {
  font-weight: bold;
}
</style>
