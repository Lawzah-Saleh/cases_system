<template>
  <MainLayout>
    <div class="employees-page">

      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Employees</h1>
        <p class="page-subtitle">
          Detailed overview and management of all employees in the system.
        </p>
      </div>

      <!-- Filters + Create Button -->
      <div class="filters-row">
        <div class="filters">
          <input
            v-model="search"
            type="text"
            class="filter-input"
            placeholder="Search..."
          />

          <select v-model="status" class="filter-select">
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button class="apply-btn" @click="applyFilters">
            Apply
          </button>
        </div>

        <button class="create-btn">
          Add Employee
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr class="table-header-row">
              <th>ID</th>
              <th>Name</th>
              <th>User name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="employee in filteredEmployees"
              :key="employee.id"
            >
              <td>{{ employee.id }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.username }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.role }}</td>
              <td class="dots">•••</td>
            </tr>
          </tbody>
        </table>

        <p class="results-text">
          {{ filteredEmployees.length }} results
        </p>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";

const search = ref("");
const status = ref("");

const employees = ref([
  {
    id: "01",
    name: "Reem Riyadh",
    username: "Reem",
    email: "Reem@email.com",
    role: "Employee",
    status: "active",
  },
  {
    id: "02",
    name: "Ahmad Saleh",
    username: "Ahmad",
    email: "ahmad@email.com",
    role: "Supervisor",
    status: "inactive",
  },
]);

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.username.toLowerCase().includes(search.value.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.value.toLowerCase());

    const matchStatus = status.value ? emp.status === status.value : true;

    return matchSearch && matchStatus;
  });
});

function applyFilters() {
  console.log("Filters applied:", search.value, status.value);
}
</script>

<style scoped>
.employees-page {
  width: 100%;
}

/* Header */
.page-title {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 26px;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #7a7a7a;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Filters */
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.filters {
  display: flex;
  gap: 12px;
  width: 60%;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid #ddd;
  font-size: 14px;
}

.apply-btn {
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

/* Add Employee button */
.create-btn {
  padding: 12px 20px;
  background: var(--primary-color);
  color: white;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}

/* Table */
.dots {
  cursor: pointer;
  font-size: 20px;
}

.results-text {
  margin-top: 12px;
  color: var(--primary-color);
  font-weight: 600;
}
</style>
