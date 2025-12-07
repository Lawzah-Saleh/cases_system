<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Role Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Here are the full details of this role.</p>

      <!-- BASIC INFO -->
      <div class="details-grid">
        <div class="row">
          <label>Role Name</label>
          <p>{{ role.role_name }}</p>
        </div>

        <div class="row">
          <label>Total Permissions</label>
          <p>{{ role.permissions?.length || 0 }}</p>
        </div>
      </div>

      <!-- PERMISSIONS BY CATEGORY -->
      <h3 class="permissions-title">Permissions by Category</h3>

      <!-- SCROLL WRAPPER FOR ALL CATEGORIES -->
      <div class="category-scroll">
        <div class="category-box" v-for="cat in grouped" :key="cat.name">
          <div class="category-header" @click="toggle(cat.name)">
            <span class="category-title">{{ cat.name }}</span>
            <span class="count-badge">{{ cat.permissions.length }}</span>
          </div>

          <!-- PERMISSIONS (also scrollable inside if long) -->
          <div class="permissions-list" v-if="openCategory === cat.name">
            <div v-for="perm in cat.permissions" :key="perm.id" class="perm-item">
              {{ perm.permission_name }}
            </div>
          </div>
        </div>
      </div>

      <div class="btn-row">
        <button class="btn-secondary" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  role: { type: Object, required: true }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

/* WHICH CATEGORY IS OPEN */
const openCategory = ref(null)

function toggle(name) {
  openCategory.value = openCategory.value === name ? null : name
}

/* GROUP PERMISSIONS BY CATEGORY */
const grouped = computed(() => {
  if (!props.role.permissions) return []

  const map = {}

  props.role.permissions.forEach((perm) => {
    const name = perm.category?.category_name || 'Uncategorized'
    if (!map[name]) map[name] = []
    map[name].push(perm)
  })

  return Object.keys(map).map((key) => ({
    name: key,
    permissions: map[key]
  }))
})
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

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.row label {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.row p {
  font-size: 15px;
  color: #222;
  font-weight: 500;
}

/* CATEGORY UI */
.permissions-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.category-box {
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  margin-bottom: 14px;
  background: #fff;
}

.category-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8f8f8;
}

.category-title {
  font-weight: 600;
  font-size: 15px;
}

.count-badge {
  background: var(--primary-color);
  color: white;
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 12px;
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
  gap: 12px;
  margin-top: 12px;
}

.btn-secondary {
  background: #e4e4e4;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
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
