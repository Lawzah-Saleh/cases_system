<template>
  <div class="table-container">

    <!-- ===== PAGE HEADER ===== -->
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Employees</h2>
        <p class="sub-header">Detailed overview and management of all system employees.</p>
      </div>

      <button class="add-button">+ Create Employee</button>
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
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>

      <button class="apply-button" @click="applyFilters">Apply</button>
    </div>

    <!-- ===== EMPLOYEES TABLE ===== -->
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th @click="changeSort('id')" class="sortable">
            ID <span class="sort-icon">{{ sortIcon('id') }}</span>
          </th>
          <th @click="changeSort('name')" class="sortable">
            Name <span class="sort-icon">{{ sortIcon('name') }}</span>
          </th>
          <th @click="changeSort('email')" class="sortable">
            Email <span class="sort-icon">{{ sortIcon('email') }}</span>
          </th>
          <th>Gender</th>
          <th @click="changeSort('phone')" class="sortable">
            Phone <span class="sort-icon">{{ sortIcon('phone') }}</span>
          </th>
          <th @click="changeSort('role')" class="sortable">
            Role <span class="sort-icon">{{ sortIcon('role') }}</span>
          </th>
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
          <td>{{ emp.user?.role?.name ?? '—' }}</td>

          <!-- ⭐ ACTION MENU -->
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(emp.id)">⋮</div>

            <div v-if="openMenu === emp.id" class="menu-dropdown">
              <div class="menu-item" @click="editEmployee(emp)">Edit</div>
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

  <!-- ===== POPUP ===== -->
  <div v-if="showDetails" class="details-overlay">
    <div class="details-card">

      <button class="details-close" @click="closeDetails">×</button>

      <h3 class="popup-title">Employee Details</h3>

      <div class="details-avatar">
        {{ selectedUser.first_name?.charAt(0) }}
      </div>

      <h2 class="details-name">
        {{ selectedUser.first_name }} {{ selectedUser.middle_name }} {{ selectedUser.last_name }}
      </h2>

      <div class="details-grid">
        <p><strong>ID:</strong> {{ selectedUser.id }}</p>
        <p><strong>User ID:</strong> {{ selectedUser.user_id }}</p>

        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>

        <p><strong>Gender:</strong> {{ selectedUser.gender }}</p>
        <p><strong>City:</strong> {{ selectedUser.city ?? '—' }}</p>

        <p><strong>Created At:</strong> {{ selectedUser.created_at }}</p>
        <p><strong>Updated At:</strong> {{ selectedUser.updated_at }}</p>
      </div>

      <button class="edit-button-global" @click="editEmployee(selectedUser)">
        Edit Employee
      </button>

    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useAuthStore } from "../stores/auth";

export default {
  data() {
    return {
      // Filters
      search: "",
      status: "",

      // Popup
      showDetails: false,
      selectedUser: null,

      // Menu
      openMenu: null,

      // Data & pagination
      employees: [],
      currentPage: 1,
      lastPage: 1,
      total: 0,

      // Sorting
      sortBy: "id",
      sortDirection: "asc", // or "desc"

      // Loading
      isLoading: false,

      // debounce timer
      searchTimeout: null,
    };
  },

  methods: {
    openDetails(user) {
      this.selectedUser = user;
      this.showDetails = true;
    },

    closeDetails() {
      this.showDetails = false;
    },

    editEmployee(emp) {
      console.log("Edit employee:", emp);
      // هنا مستقبلاً يمكنك الانتقال لصفحة تعديل الموظف
    },

    deleteEmployee(emp) {
      console.log("Delete employee:", emp);
      // هنا يمكنك استدعاء API للحذف مع تأكيد
    },

    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id;
    },

    closeAllMenus() {
      this.openMenu = null;
    },

    sortIcon(column) {
      if (this.sortBy !== column) return "";
      return this.sortDirection === "asc" ? "▲" : "▼";
    },

    changeSort(column) {
      if (this.sortBy === column) {
        // عكس الاتجاه إذا ضغط على نفس العمود
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortBy = column;
        this.sortDirection = "asc";
      }
      this.fetchEmployees(1);
    },

    applyFilters() {
      this.fetchEmployees(1);
    },

    async fetchEmployees(page = 1) {
      try {
        this.isLoading = true;

        const authStore = useAuthStore();
        const token = authStore.token || localStorage.getItem("token");

        const res = await axios.get("http://localhost:8000/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            search: this.search || undefined,
            role: this.status || undefined,
            sort_by: this.sortBy,
            sort_direction: this.sortDirection,
          },
        });

        // Laravel style pagination:
        // data, current_page, last_page, total, per_page...
        this.employees = res.data.data || [];
        this.currentPage = res.data.current_page || page;
        this.lastPage = res.data.last_page || 1;
        this.total = res.data.total || this.employees.length;

      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page) {
      if (page < 1 || page > this.lastPage || this.isLoading) return;
      this.fetchEmployees(page);
    },
  },

  watch: {
    // بحث حي مع debounce
    search() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchEmployees(1);
      }, 500);
    },

    // تغيير الدور يحدّث النتائج مباشرة
    status() {
      this.fetchEmployees(1);
    },
  },

  mounted() {
    this.fetchEmployees();
    document.addEventListener("click", this.closeAllMenus);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.closeAllMenus);
  },
};
</script>
<style scoped>

/* ========== PAGE HEADER ========== */
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

/* ========== FILTERS ========== */
.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input,
.select-input {
  padding: 10px 14px;
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

/* ========== TABLE ========== */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-row th {
  background: #F5F4FA;
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

/* Sortable headers */
.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-icon {
  font-size: 10px;
  margin-left: 4px;
  color: #999;
}

/* Name link */
.user-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  position: relative;
}

.user-link:hover {
  color: var(--primary-hover);
}

.user-link::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 0;
  background: var(--primary-color);
  bottom: -3px;
  left: 0;
  transition: 0.25s ease;
}

.user-link:hover::after {
  width: 100%;
}

/* Results */
.results-count {
  font-size: 13px;
  color: #666;
  margin-top: 10px;
}

/* ========== POPUP ========== */
.details-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.details-card {
  width: 460px;
  background: white;
  padding: 30px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--table-border);
  box-shadow: 0 10px 35px rgba(0,0,0,0.1);
  position: relative;
  animation: popIn 0.25s ease;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
  color: var(--primary-color);
}

.details-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  font-size: 24px;
  border: none;
  cursor: pointer;
}

.details-avatar {
  width: 85px;
  height: 85px;
  background: var(--primary-color);
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin: 0 auto 10px;
}

.details-name {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 5px;
}

.details-role {
  text-align: center;
  color: #777;
  margin-bottom: 20px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 15px;
}

/* Popup animation */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.edit-button-global {
  display: block;
  margin: 20px auto 0 auto;
  padding: 10px 20px;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s ease;
}

.edit-button-global:hover {
  background: var(--primary-hover);
}

/* ========== ACTION MENU ========== */
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
  right: 5px;
  top: 24px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  width: 120px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  animation: fadeIn 0.18s ease;
  z-index: 50;
}

.menu-item {
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s ease;
}

.menu-item:hover {
  background: #f5f4fa;
  color: var(--primary-color);
}

.delete {
  color: red;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== PAGINATION (نفس أسلوب صفحة clients) ========== */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border: 1px solid gray;
  background-color: white;
  cursor: pointer;
  margin-left: 5px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Flex helpers (لو لم تكن معرفة مسبقاً) */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }

/* ========== LOADER ========== */
.skeleton-row td {
  padding: 16px;
}

.skeleton-bar {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f2f2f2, #e6e6e6, #f2f2f2);
  background-size: 200% 100%;
  animation: skeletonPulse 1.2s infinite;
}

@keyframes skeletonPulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

</style>
