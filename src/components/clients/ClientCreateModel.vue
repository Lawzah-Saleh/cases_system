<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Create Client</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submit" class="modal-form-grid">
        <!-- name -->
        <div class="form-group">
          <label>Client Name</label>
          <input v-model="form.client_name" required />
          <p v-if="errors.client_name" class="error-text">{{ errors.client_name[0] }}</p>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label>Address</label>
          <input v-model="form.address" required />
          <p v-if="errors.address" class="error-text">{{ errors.address[0] }}</p>
        </div>

        <!-- email -->
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" required />
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <!-- logo -->
        <div class="form-group">
          <label>Client Logo </label>
          <input type="file" @change="handleFile" />
          <p v-if="errors.Logo" class="error-text">{{ errors.Logo[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Creating…' : 'Create Client' }}
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

const form = reactive({
  client_name: '',
  address: '',
  logo: null,
  email: ''
})

function close() {
  emit('close')
}

async function submit() {
  errors.client_name = null
  errors.email = null
  errors.address = null
  errors.logo = null

  try {
    loading.value = true

    const fd = new FormData()
    fd.append('client_name', form.client_name)
    fd.append('address', form.address)
    fd.append('email', form.email)
    if (form.logo) fd.append('logo', form.logo) // أهم شيء

    await axios.post('http://localhost:8000/api/clients', fd, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.success('Client created successfully!', { autoClose: 2000 })

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

function handleFile(e) {
  form.logo = e.target.files[0]
}
</script>
