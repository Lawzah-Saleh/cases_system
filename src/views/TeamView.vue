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

      <button class="apply-button">Apply</button>
    </div>

    <!-- ===== EMPLOYEES TABLE ===== -->
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Password</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="emp in dummyData" :key="emp.id" class="table-row-hover">

          <td>{{ emp.id }}</td>

          <td class="user-link" @click="openDetails(emp)">
            {{ emp.first_name }} {{ emp.middle_name }} {{ emp.last_name }}
          </td>

          <td>{{ emp.email }}</td>
          <td>{{ emp.password }}</td>
          <td>{{ emp.gender }}</td>
          <td>{{ emp.phone }}</td>
          <td>{{ emp.role }}</td>


<td class="options-cell">
  <span class="options-icon" @click="toggleMenu(emp.id)">...</span>

  <div v-if="openMenu === emp.id" class="menu-dropdown">
    <p @click="editEmployee(emp)">Edit</p>
    <p @click="deleteEmployee(emp)">Delete</p>
  </div>
</td>

        </tr>
      </tbody>
    </table>

    <p class="results-count">{{ dummyData.length }} results</p>
  </div>

  <!-- ===== EMPLOYEE DETAILS POPUP ===== -->
  <div v-if="showDetails" class="details-overlay">
    <div class="details-card">

      <button class="details-close" @click="closeDetails">×</button>

      <h3 class="popup-title">Employee Details</h3>

      <div class="details-avatar">
        {{ selectedUser.first_name.charAt(0) }}
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

<!-- EDIT BUTTON (GLOBAL) -->
<button class="edit-button-global" @click="editEmployee(selectedUser)">
  Edit Employee
</button>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      search: "",
      status: "",
      showDetails: false,
      selectedUser: null,

      dummyData: [
        {
          id: 1,
          user_id: 10,
          first_name: "Lawzah",
          middle_name: "Saleh",
          last_name: "Ali",
          email: "lawzah@email.com",
          password: "*******",
          gender: "female",
          phone: "0500000000",
          role: "Employee",
          created_at: "2024-11-20",
          updated_at: "2024-11-20"
        }
      ]
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


      alert("Edit page for: " + emp.first_name + " (Coming soon)");
   }

  }
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

.table-options {
  text-align: center;
  cursor: pointer;
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
.edit-button {
  display: block;
  margin: 0 auto 22px auto;
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

.edit-button:hover {
  background: var(--primary-hover);
}
.options-cell {
  text-align: right;
  position: relative;
  width: 40px;
}

.options-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 0;
  cursor: pointer;
  display: inline-block;
  color: #444;
  padding: 4px 6px;
  border-radius: 6px;
  transition: 0.2s ease;
}

.options-icon:hover {
  background: rgba(0,0,0,0.05);
}

/* The dropdown under the menu */
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

.menu-dropdown p {
  margin: 0;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s ease;
}

.menu-dropdown p:hover {
  background: #f5f4fa;
  color: var(--primary-color);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}


</style>
