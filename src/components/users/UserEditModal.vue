<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Edit User</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="submit" class="modal-form-grid">
        <div class="form-group input-full">
          <label>Username</label>
          <input v-model="form.username" required />
          <p v-if="errors.username" class="error-text">{{ errors.username[0] }}</p>
        </div>

        <div class="form-group input-full">
          <label>Role</label>
          <select v-model="form.role_id" required>
            <option value="">Select Role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.role_name }}
            </option>
          </select>
          <p v-if="errors.role_id" class="error-text">{{ errors.role_id[0] }}</p>
        </div>

        <div class="form-group input-full">
          <label>Status</label>
          <select v-model="form.status" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p v-if="errors.status" class="error-text">{{ errors.status[0] }}</p>
        </div>

        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const props = defineProps({
  user: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])
const auth = useAuthStore()

const loading = ref(false)
const roles = ref([])
const errors = reactive({})

const form = reactive({
  username: '',
  role_id: '',
  status: ''
})

watch(
  () => props.user,
  (u) => {
    if (u) {
      form.username = u.username
      form.role_id = u.role_id
      form.status = u.status
    }
  },
  { immediate: true }
)

async function loadRoles() {
  const res = await axios.get('http://localhost:8000/api/roles', {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  roles.value = res.data.roles
}

function close() {
  emit('close')
}

async function submit() {
  errors.username = null
  errors.role_id = null
  errors.status = null

  try {
    loading.value = true

    await axios.put(`http://localhost:8000/api/users/${props.user.id}`, form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('User updated successfully!', { autoClose: 2000 })

    emit('updated')
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

onMounted(loadRoles)
</script>
