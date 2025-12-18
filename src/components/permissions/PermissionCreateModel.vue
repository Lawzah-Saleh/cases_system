<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Create Permission Category</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submit" class="modal-form-grid">
        <!-- CATEGORY NAME -->
        <div class="form-group input-full">
          <label>Category Name</label>
          <input v-model="form.category_name" required placeholder="Enter category name" />
          <p v-if="errors.category_name" class="error-text">{{ errors.category_name[0] }}</p>
        </div>

        <!-- PERMISSIONS DYNAMIC INPUTS -->
        <div class="input-full">
          <label>Permissions</label>

          <!-- SCROLLABLE WRAPPER -->
          <div class="permissions-scroll">
            <div v-for="(perm, index) in form.permissions" :key="index" class="perm-input-row">
              <input
                class="input-full"
                v-model="form.permissions[index]"
                placeholder="Permission name"
                required
              />

              <button
                type="button"
                class="remove-btn"
                @click="removePermission(index)"
                v-if="form.permissions.length > 1"
              >
                ×
              </button>
            </div>
          </div>

          <button type="button" class="add-permission-btn" @click="addPermission">
            + Add another permission
          </button>

          <p v-if="errors.permissions" class="error-text">{{ errors.permissions[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving…' : 'Create Category' }}
          </button>
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
.perm-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
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
</style>
