<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Create Role</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Fill the information below to add a new role.</p>

      <form @submit.prevent="submit" class="form-grid">
        <!-- ROLE NAME -->
        <div class="form-group full">
          <label>Role Name</label>
          <input v-model="form.role_name" required />
          <p v-if="errors.role_name" class="error-text">{{ errors.role_name[0] }}</p>
        </div>

        <!-- PERMISSIONS LIST -->
        <div class="form-group full">
          <label>Assign Permissions</label>

          <div class="permissions-box">
            <div v-for="perm in permissions" :key="perm.id" class="perm-item">
              <input type="checkbox" :value="perm.id" v-model="form.permissions" />
              <span>{{ perm.permission_name }}</span>
            </div>
          </div>

          <p v-if="errors.permissions" class="error-text">{{ errors.permissions[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Creating…' : 'Create Role' }}
          </button>

          <button type="button" class="btn-secondary" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const emit = defineEmits(['close', 'created'])
const auth = useAuthStore()

const loading = ref(false)
const permissions = ref([])

const errors = reactive({
  role_name: null,
  permissions: null
})

const form = reactive({
  role_name: '',
  permissions: []
})

function close() {
  emit('close')
}

/* FETCH PERMISSIONS FOR CHECKBOX LIST */
async function loadPermissions() {
  try {
    const res = await axios.get('http://localhost:8000/api/permissions/all_permissions', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    permissions.value = res.data.permissions
  } catch (error) {
    console.error('Permissions loading error:', error)
    toast.error('Failed to load permissions.')
  }
}

onMounted(() => loadPermissions())

/* SUBMIT FORM */
async function submit() {
  errors.role_name = null
  errors.permissions = null

  try {
    loading.value = true

    await axios.post('http://localhost:8000/api/roles', form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Role created successfully!', { autoClose: 2000 })

    emit('created')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)

      const firstError = Object.values(err.response.data.errors)[0][0]
      toast.error(firstError, { autoClose: 2500 })
    } else {
      toast.error('Server error. Try again later.', { autoClose: 2500 })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Same styling as your permission modal */
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
  margin-top: 4px;
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
  font-size: 14px;
  margin-bottom: 6px;
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

.error-text {
  color: red;
  font-size: 13px;
  margin-top: 4px;
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
