<template>
  <div class="table-container">
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Employees</h2>
        <p class="sub-header">Detailed overview and management of all system employees.</p>
      </div>

      <button class="add-button" @click="openCreate = true">+ Create Employee</button>
    </div>
    <div class="filters-wrapper">

      <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="search"
      />

      <select class="select-input" v-model="status">
        <option value="">Select Role</option>
        <option v-for="r in roles" :key="r.id" :value="r.id">
          {{ r.role_name }}
        </option>
      </select>

    </div>

    <button class="filter-button" @click="showFilter = true">
      Show / Hide Columns
    </button>

    <div v-if="showFilter" class="filter-overlay" @click.self="closeFilter">
      <div class="filter-modal">

        <div class="filter-header">
          <h2>Show/Hide Columns</h2>

          <button class="select-all-btn" @click="selectAllColumns">
            All
          </button>
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



    <table class="custom-table">
      <thead>
        <tr class="table-header-row">

          <th v-if="isVisible('id')">ID</th>
          <th v-if="isVisible('name')">Name</th>
          <th v-if="isVisible('email')">Email</th>
          <th v-if="isVisible('gender')">Gender</th>
          <th v-if="isVisible('phone')">Phone</th>
          <th v-if="isVisible('role')">Role</th>
          <th></th>

        </tr>
      </thead>

      <tbody>

        <tr v-if="isLoading" v-for="n in 5" :key="n" class="skeleton-row">
          <td colspan="7"><div class="skeleton-bar"></div></td>
        </tr>

        <!-- ===== DATA ROWS ===== -->
        <tr v-else v-for="emp in employees" :key="emp.id" class="table-row-hover">

          <td v-if="isVisible('id')">{{ emp.id }}</td>

          <td v-if="isVisible('name')"
              class="user-link"
              @click="openDetails(emp)">
            {{ emp.first_name }} {{ emp.middle_name }} {{ emp.last_name }}
          </td>

          <td v-if="isVisible('email')">{{ emp.email }}</td>
          <td v-if="isVisible('gender')">{{ emp.gender }}</td>
          <td v-if="isVisible('phone')">{{ emp.phone }}</td>

          <td v-if="isVisible('role')">
            {{ emp.user?.role?.role_name ?? '—' }}
          </td>

          <!-- ACTION MENU -->
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(emp.id)">⋮</div>

            <div v-if="openMenu === emp.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(emp)">Edit</div>
              <div class="menu-item delete" @click="deleteEmployee(emp)">Delete</div>
            </div>
          </td>

        </tr>

        <tr v-if="!isLoading && employees.length === 0">
          <td colspan="7" style="text-align: center; padding: 20px; color: #777">
            No employees found.
          </td>
        </tr>

      </tbody>
    </table>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container mt-4 flex items-center justify-between">
      <p class="results-count">
        {{ total }} results
        <span v-if="lastPage > 1"> — Page {{ currentPage }} of {{ lastPage }} </span>
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

  <EmployeeDetailsModal
    v-if="openDetailsModal"
    :employee="selectedEmployee"
    @close="openDetailsModal = false"
    @edit="startEdit"
  />

  <!-- ===== CREATE MODAL ===== -->
  <EmployeeCreateModal v-if="openCreate" @close="openCreate = false" @created="handleRefresh" />

  <EmployeeEditModal
    v-if="openEdit"
    :employee="selectedEmployee"
    @close="openEdit = false"
    @updated="handleRefresh"
  />

</template>
<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

import EmployeeCreateModal from "@/components/employees/EmployeeCreateModal.vue";
import EmployeeEditModal from "@/components/employees/EmployeeEditModal.vue";
import EmployeeDetailsModal from "@/components/employees/EmployeeDetailsModal.vue";


export default {
  components: {
    EmployeeCreateModal,
    EmployeeEditModal,
    EmployeeDetailsModal,
  },

  data() {
    return {
      search: '',
      status: '',
      roles: [],

      employees: [],
      isLoading: false,

      currentPage: 1,
      lastPage: 1,
      total: 0,

      openMenu: null,
      openCreate: false,
      openEdit: false,
      openDetailsModal: false,
      selectedEmployee: null,

      showFilter: false,

      columns: [
        { key: "id", label: "ID", visible: true },
        { key: "name", label: "Name", visible: true },
        { key: "email", label: "Email", visible: true },
        { key: "gender", label: "Gender", visible: true },
        { key: "phone", label: "Phone", visible: true },
        { key: "role", label: "Role", visible: true },
      ],

      debounceTimer: null,
    };
  },

  computed: {
    visibleColumns() {
      return this.columns.filter(col => col.visible);
    },
  },

  watch: {
    search() {
      this.debounceSearch();
    },
    status() {
      this.fetchEmployees(1);
    },
  },

  methods: {
    closeFilter() {
      this.showFilter = false;
    },

    applyFilters() {
      this.showFilter = false;
    },

    selectAllColumns() {
      this.columns.forEach(col => col.visible = true);
    },

    isVisible(key) {
      return this.columns.find(col => col.key === key)?.visible;
    },


    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id;
    },

    closeMenu() {
      this.openMenu = null;
    },

    debounceSearch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchEmployees(1);
      }, 400);
    },

    openDetails(emp) {
      this.selectedEmployee = emp;
      this.openDetailsModal = true;
    },

    startEdit(emp) {
      this.selectedEmployee = emp;
      this.openEdit = true;
    },

    async deleteEmployee(emp) {
      if (!confirm("Delete this employee?")) return;


      try {
        const token = useAuthStore().token;

        await axios.delete(`http://localhost:8000/api/employees/${emp.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.handleRefresh();
      } catch (e) {
        console.error(e);
      }
    },

    async loadRoles() {
      const token = useAuthStore().token;
      const res = await axios.get("http://localhost:8000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.roles = res.data.roles;

    },

    async fetchEmployees(page = 1) {
      try {
        this.isLoading = true;

        const token = useAuthStore().token;

        const res = await axios.get('http://localhost:8000/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            search: this.search,
            role: this.status,
          },
        });

        this.employees = res.data.data;
        this.currentPage = res.data.current_page;
        this.lastPage = res.data.last_page;
        this.total = res.data.total;
      } catch (err) {
        console.error("Error loading employees:", err);

      } finally {
        this.isLoading = false;
      }
    },

    // ===== Pagination =====
    changePage(p) {
      if (p < 1 || p > this.lastPage) return;
      this.fetchEmployees(p);
    },

    handleRefresh() {
      this.fetchEmployees(this.currentPage);
    },
  },

  mounted() {
    this.fetchEmployees();
    this.loadRoles();
    document.addEventListener("click", this.closeMenu);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.closeMenu);
  },
};

</script>
<style scoped>
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

.filter-button {
  padding: 6px 0;
  cursor: pointer;
  color: var(--primary-color);
  border: none;
  background: transparent;
  text-decoration: underline;
  font-size: 16px;
  margin-bottom: 20px;
}



.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
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
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
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

/* ACTION MENU */
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
  width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
}

.menu-item.delete {
  color: red;
}

.menu-item:hover {
  background: #f4f4f4;
}

/* PAGINATION */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border: 1px solid gray;
  background: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
}

/* SKELETON */
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
