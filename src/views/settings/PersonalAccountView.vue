<template>
  <div class="table-container">
    <h2 class="main-header">
      <span class="link-back" @click="$router.back()">Setting</span> / Personal Account
    </h2>

    <form @submit.prevent="submit">
      <div class="form-group">
        <label>Username</label>
        <input v-model="form.username" />
        <p v-if="errors.username" class="error-text">{{ errors.username[0] }}</p>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" />
      </div>

      <div class="form-group full">
        <label>New Password</label>
        <input type="password" v-model="form.password" />
        <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
      </div>

      <div class="form-group full">
        <label>Confirm Password</label>
        <input type="password" v-model="form.password_confirmation" />
        <p v-if="errors.password_confirmation" class="error-text">
          {{ errors.password_confirmation[0] }}
        </p>
      </div>

      <div class="btn-row full">
        <button class="btn-primary-account" type="submit" :disabled="loading">
          {{ loading ? 'Updating…' : 'Update Personal Account' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const loading = ref(false)
const errors = reactive({})

// form data
const form = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
})

async function loadAccount() {
  try {
    const res = await axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    const user = res.data.data[0]

    if (!user) return

    form.username = user.username || ''
    form.email = user.employee?.email || ''
  } catch (e) {
    console.error(e)
  }
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    const payload = {}

    if (form.username) payload.username = form.username
    if (form.email) payload.email = form.email

    if (form.password) {
      payload.password = form.password
      payload.password_confirmation = form.password_confirmation
    }

    await axios.put('http://localhost:8000/api/account/update', payload, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Account updated successfully!')
  } catch (err) {
    if (err.response?.status === 422) {
      console.log(err.response.data)

      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error updating account.')
    }
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.password = ''
  form.password_confirmation = ''
}

onMounted(loadAccount)
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

.full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
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

.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary-account {
  background: var(--primary-color);
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
  width: 100%;
}

.btn-secondary {
  background: #e4e4e4;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
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
