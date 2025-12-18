<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Employee Details</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>
      <h3 class="modal-section-title">Personal Information</h3>

      <div class="modal-form-grid">
        <div class="form-group">
          <label>First Name</label>
          <div class="readonly">{{ employee.first_name }}</div>
        </div>

        <div class="form-group">
          <label>Middle Name</label>
          <div class="readonly">{{ employee.middle_name || '—' }}</div>
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <div class="readonly">{{ employee.last_name }}</div>
        </div>

        <div class="form-group input-full">
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

      <h3 class="modal-section-title">Account Information</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Employee ID</label>
          <div class="readonly">{{ employee.id }}</div>
        </div>

        <div class="form-group">
          <label>Username</label>
          <div class="readonly">{{ employee.user?.username || '—' }}</div>
        </div>

        <div class="form-group input-full">
          <label>Role</label>
          <div class="readonly">{{ employee.user?.role?.role_name || '—' }}</div>
        </div>
      </div>

      <div class="btn-row input-full">
        <button class="btn-primary" @click="edit">Edit Employee</button>
        <button class="btn-secondary" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  employee: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

function close() {
  emit('close')
}

function edit() {
  emit('edit', props.employee)
}
</script>
<style scoped>
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
</style>
