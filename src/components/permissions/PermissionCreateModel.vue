<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Create Permission Category</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Add a permission category and its permissions.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">
        <!-- CATEGORY NAME -->
        <div class="form-group full">
          <label>Category Name</label>
          <input v-model="form.category_name" required placeholder="Enter category name" />
          <p v-if="errors.category_name" class="error-text">{{ errors.category_name[0] }}</p>
        </div>

        <!-- PERMISSIONS DYNAMIC INPUTS -->
        <div class="full">
          <label>Permissions</label>

          <div v-for="(perm, index) in form.permissions" :key="index" class="perm-input-row">
            <input v-model="form.permissions[index]" placeholder="Permission name" required />

            <button
              type="button"
              class="remove-btn"
              @click="removePermission(index)"
              v-if="form.permissions.length > 1"
            >
              ×
            </button>
          </div>

          <button type="button" class="add-permission-btn" @click="addPermission">
            + Add another permission
          </button>

          <p v-if="errors.permissions" class="error-text">{{ errors.permissions[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving…' : 'Create Category' }}
          </button>

          <button type="button" class="btn-secondary" @click="close">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close', 'created'])
const auth = useAuthStore()

const loading = ref(false)
const errors = reactive({})

const form = reactive({
  category_name: '',
  permissions: [''] // start with ONE input
})

function addPermission() {
  form.permissions.push('')
}

function removePermission(index) {
  form.permissions.splice(index, 1)
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    const payload = {
      category_name: form.category_name,
      permissions: form.permissions
    }

    await axios.post('http://localhost:8000/api/permission-categories', payload, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Permission category created successfully!')
    emit('created')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error creating category.')
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

input,
select {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
}

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
}

.btn-secondary {
  background: #e4e4e4;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
}

.error-text {
  color: red;
  font-size: 13px;
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
