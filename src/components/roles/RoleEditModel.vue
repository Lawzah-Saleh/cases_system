<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- HEADER -->
      <div class="modal-header">
        <h3>Edit Role</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Modify the role information and assigned permissions.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="modal-form-grid">
        <!-- ROLE NAME -->
        <div class="form-group input-full">
          <label>Role Name</label>
          <input v-model="form.role_name" required />
          <p v-if="errors.role_name" class="error-text">{{ errors.role_name[0] }}</p>
        </div>

        <!-- PERMISSIONS BY CATEGORY -->
        <div class="input-full">
          <label>Permissions by Category</label>
          <div class="category-scroll">
            <div class="category-box" v-for="cat in permissionCategories" :key="cat.id">
              <!-- CATEGORY HEADER -->
              <div class="category-header" @click="toggleCategory(cat.id)">
                <div class="left">
                  <span class="category-title">{{ cat.category_name }}</span>
                </div>

                <div class="right">
                  <!-- SELECT ALL -->
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="isCategoryFullySelected(cat)"
                      @change="toggleSelectAll(cat)"
                    />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>

              <!-- PERMISSIONS LIST -->
              <div class="permissions-list" v-if="openCategory === cat.id">
                <div v-for="perm in cat.permissions" :key="perm.id" class="perm-item">
                  <label class="perm-label">
                    <input type="checkbox" :value="perm.id" v-model="form.permissions" />
                    <span>{{ perm.permission_name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <p v-if="errors.permissions" class="error-text">{{ errors.permissions[0] }}</p>
          </div>
        </div>
        <!-- BUTTONS -->
        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Creating…' : 'Create Role' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  role: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])
const auth = useAuthStore()

const loading = ref(false)
const errors = reactive({})

const openCategory = ref(null)
const permissionCategories = ref([])

const form = reactive({
  role_name: '',
  permissions: []
})

/* LOAD ROLE DATA */
onMounted(() => {
  form.role_name = props.role.role_name
  form.permissions = props.role.permissions.map((p) => p.id)
  loadPermissionCategories()
})

/* LOAD PERMISSIONS GROUPED BY CATEGORY */
async function loadPermissionCategories() {
  try {
    const res = await axios.get('http://localhost:8000/api/permission-categories/loadAll', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    permissionCategories.value = res.data.categories ?? []
  } catch (err) {
    toast.error('Failed to load permissions.')
  }
}

/* CATEGORY OPEN/CLOSE */
function toggleCategory(id) {
  openCategory.value = openCategory.value === id ? null : id
}

/* SELECT ALL PERMISSIONS IN CATEGORY */
function toggleSelectAll(category) {
  const ids = category.permissions.map((p) => p.id)

  const isSelected = isCategoryFullySelected(category)

  if (isSelected) {
    form.permissions = form.permissions.filter((id) => !ids.includes(id))
  } else {
    const merged = new Set([...form.permissions, ...ids])
    form.permissions = [...merged]
  }
}

/* CHECK IF CATEGORY FULLY SELECTED */
function isCategoryFullySelected(category) {
  const ids = category.permissions.map((p) => p.id)
  return ids.every((id) => form.permissions.includes(id))
}

/* SUBMIT UPDATE */
async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    const payload = {
      role_name: form.role_name,
      permissions: form.permissions
    }

    await axios.post(
      `http://localhost:8000/api/roles/${props.role.id}`,
      { ...payload, _method: 'PUT' },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )

    toast.success('Role updated successfully!')
    emit('updated')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error(Object.values(err.response.data.errors)[0][0])
    } else {
      toast.error('Error updating role.')
    }
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
/* ===== PERMISSION INPUT ROWS ===== */
.perm-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.add-permission-btn {
  margin-top: 8px;
  background: var(--primary-color);
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.remove-btn {
  background: red;
  color: white;
  border: none;
  font-size: 18px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
}

/* ===== CATEGORY BOXES ===== */
.category-box {
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  margin-bottom: 14px;
  background: #fff;
}

.category-header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  background: #f8f8f8;
}

.category-title {
  font-weight: 600;
  font-size: 15px;
}

.arrow {
  transition: 0.2s;
  font-size: 18px;
}

.arrow.open {
  transform: rotate(180deg);
}

/* ===== PERMISSION LIST ===== */
.permissions-list {
  padding: 12px 18px;
}
.perm-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.perm-label span {
  white-space: nowrap;
}
.perm-item {
  display: flex;
  align-items: center; /* vertical alignment */
  justify-content: flex-start; /* force left alignment */
  gap: 8px; /* space between checkbox & label */
}

/* ===== SWITCH BUTTON ===== */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 20px;
  margin-right: 14px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  border-radius: 20px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(22px);
}
</style>
