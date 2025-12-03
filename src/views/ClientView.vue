<template>
  <div class="table-container">
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Clients</h2>
        <p class="sub-header">Detailed overview and management of all the clients.</p>
      </div>

      <button class="add-button" @click="openCreate = true" :disabled="!auth.can('add client')">
        + Add Client
      </button>
    </div>

    <!-- ===== FILTERS ===== -->
    <div class="filters-wrapper">
      <input type="text" class="search-input" placeholder="Search..." v-model="search" />
    </div>

    <!-- ===== FILTERS Columns ===== -->
    <button class="filter-button" @click="showFilter = true">Show / Hide Columns</button>

    <div v-if="showFilter" class="filter-overlay" @click.self="closeFilter">
      <div class="filter-modal">
        <div class="filter-header">
          <h2>Show/Hide Columns</h2>

          <button class="select-all-btn" @click="selectAllColumns">All</button>
        </div>

        <div class="filter-grid">
          <div v-for="col in columns" :key="col.key" class="filter-item">
            <input type="checkbox" v-model="col.visible" />
            <label>{{ col.label }}</label>
          </div>
        </div>

        <div class="filter-footer">
          <button class="cancel-btn" @click="closeFilter">Cancel</button>
          <button class="apply-btn" @click="applyFilters">Apply</button>
        </div>
      </div>
    </div>

    <!-- table -->

    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th v-if="isVisible('id')">ID</th>
          <th v-if="isVisible('client_name')">Client Name</th>
          <th v-if="isVisible('email')">Email</th>
          <th v-if="isVisible('logo_url')">Logo</th>
          <th v-if="isVisible('address')">Address</th>
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
            <div
              v-if="auth.can('edit client') || auth.can('delete client')"
              class="menu-trigger"
              @click="toggleMenu(item.id)"
            >
              ⋮
            </div>

            <div v-if="openMenu === item.id" class="menu-dropdown">
              <div class="menu-item" v-if="auth.can('edit client')" @click="startEdit(item)">
                Edit
              </div>

              <div
                class="menu-item delete"
                v-if="auth.can('delete client')"
                @click="openDeleteModal(item)"
              >
                Delete
              </div>
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

  <ConfirmDeleteModal
    v-if="showDeleteModal && deleteTarget"
    title="Delete Client"
    :message="`Are you sure you want to delete ${deleteTarget.client_name}?`"
    @close="showDeleteModal = false"
    @confirm="confirmDelete"
  />
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ClientCreateModel from '@/components/clients/ClientCreateModel.vue'
import ClientEditModel from '@/components/clients/ClientEditModel.vue'
import { toast } from 'vue3-toastify'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'

export default {
  components: {
    ClientCreateModel,
    ClientEditModel,
    ConfirmDeleteModal
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
      showDeleteModal: false,
      deleteTarget: null,
      isLoading: false,

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

    closeFilter() {
      this.showFilter = false
    },

    applyFilters() {
      this.showFilter = false
    },

    selectAllColumns() {
      this.columns.forEach((col) => (col.visible = true))
    },

    isVisible(key) {
      return this.columns.find((col) => col.key === key)?.visible
    },

    handleRefresh() {
      this.fetchClients(this.currentPage)
    },

    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },
    editItem(item) {
      console.log('Edit:', item)
    },

    openDeleteModal(client) {
      this.deleteTarget = client
      this.showDeleteModal = true
      this.openMenu = null
    },
    async confirmDelete(finish) {
      try {
        const token = useAuthStore().token

        await axios.delete(`http://localhost:8000/api/clients/${this.deleteTarget.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        toast.success('Client deleted successfully!', { autoClose: 1500 })

        finish()
        this.showDeleteModal = false
        this.handleRefresh()
      } catch (err) {
        finish()
        toast.error('Failed to delete client.', { autoClose: 2000 })
        console.error(err)
      }
    },

    async fetchClients(page = 1) {
      try {
        this.isLoading = true

        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('token')

        const res = await axios.get('http://localhost:8000/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, search: this.search }
        })

        this.clients = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
      } catch (err) {
        console.error('Error fetching clients:', err)
      } finally {
        this.isLoading = false
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
    auth() {
      return useAuthStore()
    },

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
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.main-header {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.sub-header {
  font-size: 13px;
  color: #777;
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

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.filter-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

.select-all-btn {
  font-size: 20px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 24px;
  column-gap: 60px;
  margin-bottom: 40px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 18px;
}

.filter-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cancel-btn {
  background: #e5e5e5;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.apply-btn {
  background: var(--primary-color);
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.filter-modal {
  width: 750px;
  background: white;
  border-radius: 16px;
  padding: 40px 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}
</style>
