<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>User Details</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <h3 class="modal-section-title">Account Information</h3>

      <div class="modal-form-grid">
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
          <div class="readonly">{{ user.role?.role_name || '—' }}</div>
        </div>

        <div class="form-group">
          <label>Status</label>
          <div class="readonly">
            <span class="status-badge" :class="user.status === 'active' ? 'active' : 'inactive'">
              {{ user.status }}
            </span>
          </div>
        </div>
      </div>
      <h3 class="modal-section-title">Personal Information</h3>

      <div class="modal-form-grid">
        <div class="form-group input-full">
          <label>Employee Name</label>
          <div class="readonly">
            {{ user.employee?.first_name }}
            {{ user.employee?.middle_name }}
            {{ user.employee?.last_name }}
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="readonly">{{ user.employee?.email || '—' }}</div>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <div class="readonly">{{ user.employee?.phone || '—' }}</div>
        </div>

        <div class="form-group">
          <label>Gender</label>
          <div class="readonly capitalize">
            {{ user.employee?.gender || '—' }}
          </div>
        </div>
      </div>

      <div class="btn-row input-full">
        <button class="btn-secondary" @click="close">Close</button>
        <button class="btn-primary" @click="edit">Edit User</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  user: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

function close() {
  emit('close')
}

function edit() {
  emit('edit', props.user)
}
</script>
<style scoped>
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
  content: '';
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
</style>
