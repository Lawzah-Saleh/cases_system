<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Role Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Here are the full details of this role.</p>

      <div class="details-grid">
        <div class="row">
          <label>Role Name </label>
          <p>{{ role.role_name }}</p>
        </div>

        <div class="row">
          <label>Total Permissions: </label>
          <p>{{ role.permissions?.length || 0 }}</p>
        </div>
      </div>

      <h3 class="permissions-title">Permissions</h3>

      <ul class="permissions-list">
        <li v-for="perm in role.permissions" :key="perm.id" class="perm-item">
          {{ perm.permission_name }}
        </li>
      </ul>

      <div class="btn-row">
        <button class="btn-secondary" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  role: { type: Object, required: true }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
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
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: popIn 0.25s ease;
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

.permissions-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.permissions-list {
  list-style: none;
  padding: 0;
  margin: 0 0 22px 0;
}

.perm-item {
  background: #f5f5f5;
  margin-bottom: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: #333;
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
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
