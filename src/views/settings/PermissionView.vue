<template>
  <div class="table-container">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">Setting</span> / Permissions
      </h2>

      <button class="add-button" @click="openCreate = true">+ Create permissions</button>
    </div>

    <!-- ===== FILTERS ===== -->
    <div class="filters-wrapper">
      <input type="text" class="search-input" placeholder="Search..." v-model="search" />
    </div>

    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>id</th>
          <th>permission category Name</th>
          <th>permissions</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(per, index) in permissions" :key="per.id">
          <td>{{ index + 1 }}</td>

          <td>{{ per.category_name }}</td>
          <td class="user-link" @click="openDetails(per)">Show permissions</td>

          <td class="action-cell">
            <div class="menu-trigger" @click="toggleMenu(per.id)">⋮</div>
            <div v-if="openMenu === per.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(per)">Edit</div>
              <div class="menu-item delete" @click="deletepermission(per)">Delete</div>
            </div>
          </td>
        </tr>

        <!-- ===== NO DATA STATE ===== -->
        <tr v-if="!isLoading && permissions.length === 0">
          <td colspan="7" style="text-align: center; padding: 20px; color: #777">
            No permissions found.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container mt-4 flex items-center justify-between">
      <p class="text-result">{{ permissions.length }} results</p>

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
  <PermissionCreateModel v-if="openCreate" @close="openCreate = false" @created="handleRefresh" />

  <!-- ===== EDIT MODAL ===== -->
  <PermissionEditModel
    v-if="openEdit"
    :permission="selectedPermission"
    @close="openEdit = false"
    @updated="handleRefresh"
  />

  <PermissionDetailsModel
    v-if="openPermissionDetailsModal"
    :permission="selectedPermission"
    @close="openPermissionDetailsModal = false"
  />
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue3-toastify'
import PermissionCreateModel from '@/components/permissions/PermissionCreateModel.vue'
import PermissionEditModel from '@/components/permissions/PermissionEditModel.vue'
import PermissionDetailsModel from '@/components/permissions/PermissionDetailsModel.vue'

export default {
  components: { PermissionCreateModel, PermissionEditModel, PermissionDetailsModel },
  watch: {
    search() {
      this.debounceSearch()
    }
  },
  data() {
    return {
      search: '',
      permissions: [],
      openMenu: null,
      currentPage: 1,
      lastPage: 1,
      openCreate: false,
      openEdit: false,
      selectedPermission: null,
      openPermissionDetailsModal: false,
      isLoading: false
    }
  },
  methods: {
    openDetails(permission) {
      this.selectedPermission = permission
      this.openPermissionDetailsModal = true
    },
    startEdit(permission) {
      this.selectedPermission = JSON.parse(JSON.stringify(permission))
      this.openEdit = true
    },

    debounceSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchPermissions(1)
      }, 400)
    },
    handleRefresh() {
      this.fetchPermissions(this.currentPage)
    },
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },

    async deletepermission(permission) {
      if (!confirm('Delete this permission?')) return

      try {
        const token = useAuthStore().token

        await axios.delete(`http://localhost:8000/api/permission-categories/${permission.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        toast.success('Permission deleted successfully!', {
          autoClose: 1500
        })

        await new Promise((resolve) => setTimeout(resolve, 500))

        this.handleRefresh()
      } catch (e) {
        console.error(e)
        toast.error('Failed to delete permission.', { autoClose: 2000 })
      }
    },

    async fetchPermissions(page = 1) {
      try {
        this.isLoading = true

        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('token')

        const res = await axios.get('http://localhost:8000/api/permission-categories', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            search: this.search
          }
        })

        this.permissions = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
      } catch (err) {
        console.error('Error fetching permissions:', err)
      } finally {
        this.isLoading = false
      }
    },

    changePage(page) {
      if (page < 1 || page > this.lastPage) return
      this.fetchPermissions(page)
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
    this.fetchPermissions()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
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

.user-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
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
  right: 50%;
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

.link-back {
  cursor: pointer;
  color: gray;
  font-weight: 700;
}
.link-back:hover {
  text-decoration: underline;
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
