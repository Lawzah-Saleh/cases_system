<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Create Employee</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="submit" class="modal-form-grid">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" required />
          <p v-if="errors.username" class="error-text">{{ errors.username[0] }}</p>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" required />
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <div class="form-group input-full">
          <label>Confirm Password</label>
          <input type="password" v-model="form.password_confirmation" required />
        </div>

        <div class="form-group">
          <label>First Name</label>
          <input v-model="form.first_name" required />
          <p v-if="errors.first_name" class="error-text">{{ errors.first_name[0] }}</p>
        </div>

        <div class="form-group">
          <label>Middle Name</label>
          <input v-model="form.middle_name" />
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input v-model="form.last_name" required />
          <p v-if="errors.last_name" class="error-text">{{ errors.last_name[0] }}</p>
        </div>

        <div class="form-group input-full">
          <label>Email</label>
          <input type="email" v-model="form.email" required />
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <div class="form-group">
          <label>Gender</label>
          <select v-model="form.gender" required>
            <option value="">Choose…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <p v-if="errors.gender" class="error-text">{{ errors.gender[0] }}</p>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input v-model="form.phone" required />
          <p v-if="errors.phone" class="error-text">{{ errors.phone[0] }}</p>
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

        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Creating…' : 'Create Employee' }}
          </button>
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

const errors = reactive({})

const emit = defineEmits(['close', 'created'])
const auth = useAuthStore()

const loading = ref(false)
const roles = ref([])

const form = reactive({
  username: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  gender: '',
  phone: '',
  role_id: ''
})

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
  errors.email = null
  errors.phone = null
  errors.role_id = null
  errors.password = null

  try {
    loading.value = true

    await axios.post('http://localhost:8000/api/employees', form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Employee created successfully!', {
      autoClose: 2000
    })

    emit('created')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)

      const firstError = Object.values(err.response.data.errors)[0][0]

      toast.error(firstError, {
        autoClose: 2500
      })
    } else {
      toast.error('Server error. Try again later.', {
        autoClose: 2500
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadRoles)
</script>
