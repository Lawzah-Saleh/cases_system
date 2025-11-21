<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- Header -->
      <div class="modal-header">
        <h3>Employee Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Here are the full details of the employee.</p>

      <!-- Avatar centered -->
      <div class="avatar-wrapper">
        <img
          :src="employeeAvatar"
          alt="avatar"
          class="avatar-img"
        />
      </div>

      <!-- NAME & ROLE -->
      <h2 class="emp-name">
        {{ employee.first_name }}
        {{ employee.middle_name }}
        {{ employee.last_name }}
      </h2>

      <p class="emp-role">
        {{ employee.user?.role?.role_name || '—' }}
      </p>

      <!-- DETAILS GRID -->
      <div class="details-grid">

        <div class="row">
          <label>ID</label>
          <p>{{ employee.id }}</p>
        </div>



        <div class="row">
          <label>Email</label>
          <p>{{ employee.email }}</p>
        </div>

        <div class="row">
          <label>Phone</label>
          <p>{{ employee.phone }}</p>
        </div>

        <div class="row">
          <label>Gender</label>
          <p class="capitalize">{{ employee.gender }}</p>
        </div>

        <div class="row">
          <label>Username</label>
          <p>{{ employee.user?.username || "—" }}</p>
        </div>

        <div class="row">
          <label>Created At</label>
          <p>{{ employee.created_at }}</p>
        </div>

        <div class="row">
          <label>Updated At</label>
          <p>{{ employee.updated_at }}</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="btn-row">
        <button class="btn-primary" @click="edit">
          Edit Employee
        </button>

        <button class="btn-secondary" @click="close">
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  employee: { type: Object, required: true },
});

const emit = defineEmits(["close", "edit"]);

function close() {
  emit("close");
}

function edit() {
  emit("edit", props.employee);
}

// Avatar image
const employeeAvatar = "/images/avatar.png"; // Put your avatar path here
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-large {
  width: 550px;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: popIn .25s ease;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 22px;
  color: var(--primary-color);
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
}

.modal-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 18px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.avatar-img {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
  object-fit: cover;
}

.emp-name {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}

.emp-role {
  text-align: center;
  color: #777;
  margin-bottom: 22px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.row label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.row p {
  font-size: 15px;
  color: #222;
  font-weight: 500;
}

.capitalize {
  text-transform: capitalize;
}

.btn-row {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-secondary {
  background: #e4e4e4;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
