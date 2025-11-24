<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- HEADER -->
      <div class="modal-header">
        <h3>Edit Role</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Modify the information below to update the role.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">
        <!-- ROLE NAME -->
        <div class="form-group">
          <label>Role Name</label>
          <input v-model="form.role_name" required placeholder="Leave empty to keep old name" />
          <p v-if="errors.role_name" class="error-text">{{ errors.role_name[0] }}</p>
        </div>

        <!-- PERMISSIONS -->
        <div class="form-group full">
          <label>Permissions</label>

          <div class="permissions-box">
            <div v-for="perm in allPermissions" :key="perm.id" class="perm-item">
              <input type="checkbox" :value="perm.id" v-model="form.permissions" />
              <span>{{ perm.permission_name }}</span>
            </div>
          </div>

          <p v-if="errors.permissions" class="error-text">{{ errors.permissions[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Updating…' : 'Update Role' }}
          </button>

          <button type="button" class="btn-secondary" @click="close">Cancel</button>
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

const allPermissions = ref([])

const form = reactive({
  role_name: '',
  permissions: []
})

onMounted(() => {
  form.role_name = props.role.role_name

  form.permissions = props.role.permissions.map((p) => p.id)

  loadPermissions()
})

/* LOAD ALL PERMISSIONS */
async function loadPermissions() {
  try {
    const res = await axios.get('http://localhost:8000/api/permissions/all_permissions', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    allPermissions.value = res.data.permissions
  } catch (error) {
    console.error('Load permissions failed:', error)
    toast.error('Unable to load permissions.')
  }
}

/* SUBMIT UPDATE */
async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    const fd = new FormData()
    if (form.role_name) fd.append('role_name', form.role_name)

    // Attach permissions array
    form.permissions.forEach((id) => fd.append('permissions[]', id))

    fd.append('_method', 'PUT')

    await axios.post(`http://localhost:8000/api/roles/${props.role.id}`, fd, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Role updated successfully!')
    emit('updated')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
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
  font-weight: 700;
  color: var(--primary-color);
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
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
}

input {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.permissions-box {
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.perm-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-secondary {
  background: #e4e4e4;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.error-text {
  color: red;
  font-size: 13px;
  margin-top: 4px;
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
