<template>
  <div class="table-container">

    <!-- ===== PAGE HEADER ===== -->
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Users</h2>
        <p class="sub-header">Overview and management of all system user accounts.</p>
      </div>

      <button class="add-button" @click="openCreate = true">
        + Create Employee
      </button>
    </div>

    <!-- ===== FILTERS ===== -->
    <div class="filters-wrapper">

      <!-- Search -->
      <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="search"
      />

      <!-- Filter by Role -->
      <select class="select-input" v-model="roleFilter">
        <option value="">Select Role</option>
        <option v-for="r in roles" :key="r.id" :value="r.id">
          {{ r.role_name }}
        </option>
      </select>

      <!-- Filter by Status -->
      <select class="select-input" v-model="statusFilter">
        <option value="">Select Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

    </div>

    <!-- ===== USERS TABLE ===== -->
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>ID</th>
          <th>Username</th>
          <th>Employee Name</th>
          <th>Role</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>

        <!-- Loading Skeleton -->
        <tr v-if="isLoading" v-for="n in 5" :key="n" class="skeleton-row">
          <td colspan="6"><div class="skeleton-bar"></div></td>
        </tr>

        <!-- Data rows -->
        <tr v-else v-for="u in users" :key="u.id" class="table-row-hover">

          <td>{{ u.id }}</td>

            <td class="user-link" @click="openDetails(u)">
            {{ u.username }}
          </td>

          <td>
            {{ u.employee?.first_name }} {{ u.employee?.last_name }}
          </td>

          <td>{{ u.role?.role_name ?? "—" }}</td>

          <!-- Status badge -->
          <td>
            <span :class="u.status === 'active' ? 'active-badge' : 'inactive-badge'">
              {{ u.status }}
            </span>
          </td>

          <!-- Action menu -->
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(u.id)">⋮</div>

            <div v-if="openMenu === u.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(u)">Edit</div>
              <div class="menu-item" @click="openResetPassword(u)">Reset Password</div>
            </div>
          </td>
        </tr>

        <tr v-if="!isLoading && users.length === 0">
          <td colspan="6" style="text-align:center; padding:20px; color:#777;">
            No users found.
          </td>
        </tr>

      </tbody>
    </table>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container flex items-center justify-between mt-4">

      <p class="results-count">
        {{ total }} results
        <span v-if="lastPage > 1"> — Page {{ currentPage }} of {{ lastPage }} </span>
      </p>

      <div>
        <button @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1 || isLoading"
                class="page-btn">
          &lt; Prev
        </button>

        <button @click="changePage(currentPage + 1)"
                :disabled="currentPage === lastPage || isLoading"
                class="page-btn">
          Next &gt;
        </button>
      </div>

    </div>

  </div>

  <!-- ===== MODALS ===== -->
  <EmployeeCreateModal
    v-if="openCreate"
    @close="openCreate = false"
    @created="refresh"
  />
  <UserDetailsModal
  v-if="openDetailsModal"
  :user="selectedUser"
  @close="openDetailsModal = false"
  />


  <UserEditModal
    v-if="openEdit"
    :user="selectedUser"
    @close="openEdit = false"
    @updated="refresh"
  />

  <UserResetPasswordModal
    v-if="openReset"
    :user="selectedUser"
    @close="openReset = false"
  />
</template>
<script>
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

import EmployeeCreateModal from "@/components/employees/EmployeeCreateModal.vue"
import UserDetailsModal from "@/components/users/UserDetailsModal.vue"

import UserEditModal from "@/components/users/UserEditModal.vue"
import UserResetPasswordModal from "@/components/users/UserResetPasswordModal.vue"

export default {
  components: {
    EmployeeCreateModal,
    UserEditModal,
    UserResetPasswordModal,
    UserDetailsModal,

  },

  data() {
    return {
      users: [],
      roles: [],
      search: "",
      roleFilter: "",
      statusFilter: "",
      isLoading: false,

      openMenu: null,
      selectedUser: null,

      currentPage: 1,
      lastPage: 1,
      total: 0,

      openCreate: false,
      openEdit: false,
      openReset: false,
      openDetailsModal: false,
      debounceTimer: null,
    }
  },

  watch: {
    search() {
      this.debounceSearch()
    },
    roleFilter() {
      this.fetchUsers(1)
    },
    statusFilter() {
      this.fetchUsers(1)
    }
  },

  methods: {
    debounceSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchUsers(1)
      }, 400)
    },
    openDetails(user) {
  this.selectedUser = user;
  this.openDetailsModal = true;
},


    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },

    startEdit(user) {
      this.selectedUser = user
      this.openEdit = true
    },

    openResetPassword(user) {
      this.selectedUser = user
      this.openReset = true
    },

    async fetchUsers(page = 1) {
      try {
        this.isLoading = true
        const token = useAuthStore().token

        const res = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            search: this.search,
            role: this.roleFilter,
            status: this.statusFilter,
          },
        })

        this.users = res.data.data
        this.total = res.data.total
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page

      } catch (err) {
        console.error("Error loading users:", err)
      } finally {
        this.isLoading = false
      }
    },

    async loadRoles() {
      const token = useAuthStore().token
      const res = await axios.get("http://localhost:8000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.roles = res.data.roles
    },



    refresh() {
      this.fetchUsers(this.currentPage)
    },

    changePage(p) {
      if (p < 1 || p > this.lastPage) return
      this.fetchUsers(p)
    }
  },

  mounted() {
    this.fetchUsers()
    this.loadRoles()
    document.addEventListener("click", () => (this.openMenu = null))
  }
}
</script>
<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-title-container {
  display: flex;
  flex-direction: column;
}

.main-header {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.sub-header {
  font-size: 13px;
  color: #777;
  margin-top: 4px;
}

.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input,
.select-input {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  background: #fff;
  width: 200px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-row th {
  background: var(--table-header-bg);
  padding: 12px 16px;
  font-size: 15px;
}

.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--table-border);
}

.table-row-hover:hover td {
  background: #fafafa;
}

.user-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
}

.active-badge {
  background: #d6f5da;
  color: #1e7b1e;
  padding: 4px 10px;
  border-radius: var(--radius-md);
}

.inactive-badge {
  background: #ffe0e0;
  color: #b30000;
  padding: 4px 10px;
  border-radius: var(--radius-md);
}

.action-cell {
  position: relative;
}

.menu-trigger {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}

.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 140px;
  box-shadow: 0 4px 10px rgba(0,0,0,.15);
  z-index: 999;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f4f4f4;
}


.skeleton-bar {
  width: 100%;
  height: 18px;
  background: linear-gradient(90deg, #eee, #ddd, #eee);
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
