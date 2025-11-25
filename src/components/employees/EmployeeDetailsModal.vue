<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <div class="modal-header">
        <h3>Employee Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>


      <h3 class="section-title">Personal Information</h3>

      <div class="form-grid">

        <div class="form-group">
          <label>First Name</label>
          <div class="readonly">{{ employee.first_name }}</div>
        </div>

        <div class="form-group">
          <label>Middle Name</label>
          <div class="readonly">{{ employee.middle_name || "—" }}</div>
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <div class="readonly">{{ employee.last_name }}</div>
        </div>

        <div class="form-group full">
          <label>Email</label>
          <div class="readonly">{{ employee.email }}</div>
        </div>

        <div class="form-group">
          <label>Gender</label>
          <div class="readonly capitalize">{{ employee.gender }}</div>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <div class="readonly">{{ employee.phone }}</div>
        </div>

      </div>

      <h3 class="section-title">Account Information</h3>

      <div class="form-grid">

        <div class="form-group">
          <label>Employee ID</label>
          <div class="readonly">{{ employee.id }}</div>
        </div>

        <div class="form-group">
          <label>Username</label>
          <div class="readonly">{{ employee.user?.username || "—" }}</div>
        </div>

        <div class="form-group full">
          <label>Role</label>
          <div class="readonly">{{ employee.user?.role?.role_name || "—" }}</div>
        </div>

      </div>

      <div class="btn-row full">
        <button class="btn-secondary" @click="close">Close</button>
        <button class="btn-primary" @click="edit">Edit Employee</button>
      </div>

    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  employee: { type: Object, required: true }
});

const emit = defineEmits(["close", "edit"]);

function close() {
  emit("close");
}

function edit() {
  emit("edit", props.employee);
}
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
  width: 560px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 42px rgba(0,0,0,0.15);
  animation: popIn 0.25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: #444;
}



.section-title {
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 16px;
  color: var(--primary-color);
  font-size: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 6px;
}

.full {
  grid-column: span 2;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
}

.readonly {
  padding: 10px;
  background: #fafafa;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: #333;
}

.capitalize {
  text-transform: capitalize;
}

.btn-row {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-secondary {
  background: #efefef;
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
