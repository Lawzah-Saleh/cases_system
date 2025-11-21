<template>
  <div class="table-container">

    <!-- ===== PAGE HEADER ===== -->
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Employees</h2>
        <p class="sub-header">Detailed overview and management of all system employees.</p>
      </div>

      <button class="add-button" @click="openCreate = true">
        + Create Employee
      </button>
    </div>

    <!-- ===== FILTERS ===== -->
     <div class="filters-wrapper">
  <input
    type="text"
    class="search-input"
    placeholder="Search..."
    v-model="search"
  />

  <select class="select-input" v-model="status">
    <option value="">Select Status</option>
    <option v-for="r in roles" :key="r.id" :value="r.id">
      {{ r.role_name }}
    </option>
  </select>
</div>



    <!-- ===== EMPLOYEES TABLE ===== -->
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Role</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        <!-- ===== LOADING SKELETON ===== -->
        <tr v-if="isLoading" v-for="n in 5" :key="'skeleton-' + n" class="skeleton-row">
          <td colspan="7">
            <div class="skeleton-bar"></div>
          </td>
        </tr>

        <!-- ===== DATA ROWS ===== -->
        <tr
          v-else
          v-for="emp in employees"
          :key="emp.id"
          class="table-row-hover"
        >
          <td>{{ emp.id }}</td>

          <td class="user-link" @click="openDetails(emp)">
            {{ emp.first_name }} {{ emp.middle_name }} {{ emp.last_name }}
          </td>

          <td>{{ emp.email }}</td>
          <td>{{ emp.gender }}</td>
          <td>{{ emp.phone }}</td>
          <td>{{ emp.user?.role?.role_name ?? '—' }}</td>


          <!-- ACTION MENU -->
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(emp.id)">⋮</div>

            <div v-if="openMenu === emp.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(emp)">Edit</div>
              <div class="menu-item delete" @click="deleteEmployee(emp)">Delete</div>
            </div>
          </td>
        </tr>

        <!-- ===== NO DATA STATE ===== -->
        <tr v-if="!isLoading && employees.length === 0">
          <td colspan="7" style="text-align:center; padding: 20px; color:#777;">
            No employees found.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container flex items-center justify-between mt-4">
      <p class="results-count">
        {{ total }} results
        <span v-if="lastPage > 1">
          — Page {{ currentPage }} of {{ lastPage }}
        </span>
      </p>

      <div>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1 || isLoading"
          class="page-btn"
        >
          &lt; Prev
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === lastPage || isLoading"
          class="page-btn"
        >
          Next &gt;
        </button>
      </div>
    </div>
  </div>

  <!-- ===== DETAILS MODAL ===== -->
  <EmployeeDetailsModal
    v-if="openDetailsModal"
    :employee="selectedEmployee"
    @close="openDetailsModal = false"
    @edit="startEdit"
  />

  <!-- ===== CREATE MODAL ===== -->
  <EmployeeCreateModal
    v-if="openCreate"
    @close="openCreate = false"
    @created="handleRefresh"
  />

  <!-- ===== EDIT MODAL ===== -->
  <EmployeeEditModal
    v-if="openEdit"
    :employee="selectedEmployee"
    @close="openEdit = false"
    @updated="handleRefresh"
  />
</template>

<script>
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

import EmployeeCreateModal from "@/components/employees/EmployeeCreateModal.vue"
import EmployeeEditModal from "@/components/employees/EmployeeEditModal.vue"
import EmployeeDetailsModal from "@/components/employees/EmployeeDetailsModal.vue"

export default {
  components: {
    EmployeeCreateModal,
    EmployeeEditModal,
    EmployeeDetailsModal
  },

  data() {
    return {
      search: "",
      status: "",
      roles: [],
      isLoading: false,

      employees: [],
      selectedEmployee: null,

      currentPage: 1,
      lastPage: 1,
      total: 0,
      openMenu: null,
      openCreate: false,
      openEdit: false,
      openDetailsModal: false,
    }
  },
  watch: {
  search() {
    this.debounceSearch();
  },
  status() {
    this.fetchEmployees(1);
  }
},


  methods: {

 
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },

    closeMenu() {
      this.openMenu = null
    },

    openDetails(emp) {
      this.selectedEmployee = emp
      this.openDetailsModal = true
    },

    startEdit(emp) {
      this.selectedEmployee = emp
      this.openEdit = true
    },
    debounceTimer: null,

debounceSearch() {
  clearTimeout(this.debounceTimer);
  this.debounceTimer = setTimeout(() => {
    this.fetchEmployees(1);
  }, 400);
},


    async deleteEmployee(emp) {
      if (!confirm("Delete this employee?")) return

      try {
        const token = useAuthStore().token
        await axios.delete(`http://localhost:8000/api/employees/${emp.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        this.handleRefresh()
      } catch (e) {
        console.error(e)
      }
    },

    async loadRoles() {
      const token = useAuthStore().token;
      const res = await axios.get("http://localhost:8000/api/roles", {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.roles = res.data.roles;
},

    async fetchEmployees(page = 1) {
      try {
        this.isLoading = true
        const token = useAuthStore().token

        const res = await axios.get("http://localhost:8000/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            search: this.search,
            role: this.status,
          },
        })

        this.employees = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
        this.total = res.data.total

      } catch (err) {
        console.error("Error loading employees:", err)
      } finally {
        this.isLoading = false
      }
    },

    changePage(p) {
      if (p < 1 || p > this.lastPage) return
      this.fetchEmployees(p)
    },

    handleRefresh() {
      this.fetchEmployees(this.currentPage)
    }
  },


  mounted() {
    this.fetchEmployees()
    this.loadRoles();

    document.addEventListener("click", this.closeMenu)
  },

  beforeUnmount() {
    document.removeEventListener("click", this.closeMenu)
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

.apply-button {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-row th {
  background: var(--table-header-bg);
  font-size: 15px;
  padding: 12px 16px;
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

.results-count {
  font-size: 13px;
  color: #666;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border: 1px solid gray;
  background-color: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
/* ========== ACTION MENU (same design as clients) ========== */
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
  box-shadow: 0 4px 10px rgba(0,0,0,.15);
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

.menu-item.delete {
  color: red;
}

</style>
