<template>
  <div class="table-container">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="main-header">Clients</h2>
      <button class="add-button" @click="openCreate = true">+ Create Clients</button>
    </div>

    <!-- ===== FILTERS ===== -->
    <div class="filters-wrapper">
      <input type="text" class="search-input" placeholder="Search..." v-model="search" />
    </div>

    <button class="filter-button" @click="showFilter = !showFilter">Show / Hide columns</button>

    <!-- Dropdown -->
    <div v-if="showFilter" class="filter-dropdown">
      <div class="filter-grid">
        <div v-for="col in columns" :key="col.key" class="filter-item">
          <input type="checkbox" v-model="col.visible" />
          <label>{{ col.label }}</label>
        </div>
      </div>

      <button class="add-button" @click="applyFilters">Apply</button>
    </div>

    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th v-for="col in visibleColumns" :key="col.key">
            {{ col.label }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in clients" :key="item.id">
          <td v-if="isVisible('id')">{{ index + 1 }}</td>

          <td v-if="isVisible('client_name')">{{ item.client_name }}</td>
          <td v-if="isVisible('email')">{{ item.email }}</td>

          <td v-if="isVisible('logo_url')">
            <img class="client-logo" v-if="item.logo_url" :src="item.logo_url" alt="Logo" />
            <span v-else>●</span>
          </td>

          <td v-if="isVisible('address')">{{ item.address }}</td>

          <td class="action-cell">
            <!-- menu still works -->
            <div class="menu-trigger" @click="toggleMenu(item.id)">⋮</div>
            <div v-if="openMenu === item.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(item)">Edit</div>
              <div class="menu-item delete" @click="deleteclient(item)">Delete</div>
            </div>
          </td>
        </tr>
        <!-- ===== NO DATA STATE ===== -->
        <tr v-if="!isLoading && clients.length === 0">
          <td colspan="7" style="text-align: center; padding: 20px; color: #777">
            No clients found.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container mt-4 flex items-center justify-between">
      <p class="text-result">{{ clients.length }} results</p>

      <div>
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
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

  <!-- ===== CREATE MODAL ===== -->
  <ClientCreateModel v-if="openCreate" @close="openCreate = false" @created="handleRefresh" />

  <!-- ===== EDIT MODAL ===== -->
  <ClientEditModel
    v-if="openEdit"
    :client="selectedClient"
    @close="openEdit = false"
    @updated="handleRefresh"
  />
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ClientCreateModel from '@/components/clients/ClientCreateModel.vue'
import ClientEditModel from '@/components/clients/ClientEditModel.vue'
import { toast } from 'vue3-toastify'

export default {
  components: {
    ClientCreateModel,
    ClientEditModel
  },
  watch: {
    search() {
      this.debounceSearch()
    }
  },
  data() {
    return {
      search: '',
      clients: [],
      openMenu: null,
      currentPage: 1,
      lastPage: 1,
      showFilter: false,
      openCreate: false,
      openEdit: false,
      selectedClient: null,
      columns: [
        { key: 'id', label: 'ID', visible: true },
        { key: 'client_name', label: 'Name', visible: true },
        { key: 'email', label: 'Email', visible: true },
        { key: 'logo_url', label: 'Profile', visible: true },
        { key: 'address', label: 'Address', visible: true }
      ]
    }
  },
  methods: {
    startEdit(client) {
      this.selectedClient = JSON.parse(JSON.stringify(client))
      this.openEdit = true
    },

    debounceSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchClients(1)
      }, 400)
    },
    handleRefresh() {
      this.fetchClients(this.currentPage)
    },
    applyFilters() {
      this.showFilter = false
    },
    isVisible(key) {
      return this.columns.find((col) => col.key === key)?.visible
    },
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },
    editItem(item) {
      console.log('Edit:', item)
    },

    async deleteclient(client) {
      if (!confirm('Delete this client?')) return

      try {
        const token = useAuthStore().token

        await axios.delete(`http://localhost:8000/api/clients/${client.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        toast.success('Client deleted successfully!', {
          autoClose: 1500
        })

        await new Promise((resolve) => setTimeout(resolve, 500))

        this.handleRefresh()
      } catch (e) {
        console.error(e)
        toast.error('Failed to delete client.', { autoClose: 2000 })
      }
    },

    async fetchClients(page = 1) {
      try {
        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('token')
        const res = await axios.get('http://localhost:8000/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            search: this.search
          }
        })

        this.clients = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
      } catch (err) {
        console.error('Error fetching clients:', err)
      }
    },

    changePage(page) {
      if (page < 1 || page > this.lastPage) return
      this.fetchClients(page)
    },

    handleClickOutside(event) {
      const menuElements = document.querySelectorAll('.menu-dropdown, .menu-trigger')
      let clickedInside = false
      menuElements.forEach((el) => {
        if (el.contains(event.target)) clickedInside = true
      })
      if (!clickedInside) this.openMenu = null
    }
  },
  mounted() {
    this.fetchClients()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  computed: {
    visibleColumns() {
      return this.columns.filter((col) => col.visible)
    }
  }
}
</script>

<style scoped>
.filter-button {
  padding-bottom: 20px;
  cursor: pointer;
  color: var(--primary-color);
  border: none;
  background-color: transparent;
  text-decoration: underline;
  font-size: 18px;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 40px;
  row-gap: 20px;
  margin-bottom: 30px;
}

.filter-dropdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 50px;
  border-radius: 8px;
  width: 600px;
  z-index: 2000;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 18px;
}

.model {
  background-color: white;
  display: block;
}

.action-cell {
  position: relative;
}
.menu-trigger {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  user-select: none;
}
.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}
.menu-item {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}
.menu-item:hover {
  background: #f4f4f4;
}
.delete {
  color: red;
}

/* Flex helpers */
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}

.client-logo {
  width: 80px;
  border-radius: 50%;
}

.pagination-container {
  display: flex;
  justify-content: space-between; /* push items to edges */
  align-items: center; /* vertically center them */
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

.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  background: #fff;
  width: 200px;
}
</style>
