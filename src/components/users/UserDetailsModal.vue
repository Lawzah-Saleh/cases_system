<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <div class="modal-header">
        <h3>User Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <h3 class="section-title">Account Information</h3>

      <div class="form-grid">

        <div class="form-group">
          <label>User ID</label>
          <div class="readonly">{{ user.id }}</div>
        </div>

        <div class="form-group">
          <label>Username</label>
          <div class="readonly">{{ user.username }}</div>
        </div>

        <div class="form-group">
          <label>Role</label>
          <div class="readonly">{{ user.role?.role_name || "—" }}</div>
        </div>

        <div class="form-group">
          <label>Status</label>
          <div class="readonly">
            <span 
              class="status-badge" 
              :class="user.status === 'active' ? 'active' : 'inactive'"
            >
              {{ user.status }}
            </span>
          </div>
        </div>
      </div>
      <h3 class="section-title">Personal Information</h3>

      <div class="form-grid">

        <div class="form-group full">
          <label>Employee Name</label>
          <div class="readonly">
            {{ user.employee?.first_name }}
            {{ user.employee?.middle_name }}
            {{ user.employee?.last_name }}
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="readonly">{{ user.employee?.email || "—" }}</div>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <div class="readonly">{{ user.employee?.phone || "—" }}</div>
        </div>

        <div class="form-group">
          <label>Gender</label>
          <div class="readonly capitalize">
            {{ user.employee?.gender || "—" }}
          </div>
        </div>

      </div>

      <div class="btn-row full">
        <button class="btn-secondary" @click="close">Close</button>
        <button class="btn-primary" @click="edit">Edit User</button>
      </div>

    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  user: { type: Object, required: true }
});

const emit = defineEmits(["close", "edit"]);

function close() {
  emit("close");
}

function edit() {
  emit("edit", props.user);
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
  animation: popIn .25s ease;
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
  border: 1px solid #e0e0e0;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: #333;
  cursor: default;
  user-select: text;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  text-transform: capitalize;
  background: #f2f7f3;
  color: #2d8a4f;
}

.status-badge::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.active {
  background: #edf7ef;
  color: #2e8b57;
}

.status-badge.inactive {
  background: #f9eded;
  color: #bd4a4a;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: #efefef;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
