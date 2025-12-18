<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Permission Details</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <p class="modal-section-title">Here are the full details of this permission.</p>

      <div class="details-grid">
        <div class="row">
          <label>Permission Category Name </label>
          <p>{{ permission.category_name }}</p>
        </div>

        <div class="row">
          <label>Total Permissions: </label>
          <p>{{ permission.permissions?.length || 0 }}</p>
        </div>
      </div>

      <h3 class="permissions-title">Permissions</h3>

      <ul class="permissions-list">
        <li v-for="perm in permission.permissions" :key="perm.id" class="perm-item">
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
  permission: { type: Object, required: true }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
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

.perm-item {
  background: #f5f5f5;
  margin-bottom: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style>
