<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-small">
      <div class="modal-header">
        <h3>Reset Password</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">
        Reset password for user <strong>{{ user.username }}</strong
        >.
      </p>

      <form @submit.prevent="submit" class="modal-form-grid">
        <div class="form-group input-full">
          <label>New Password</label>
          <input type="password" v-model="form.password" required />
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <div class="form-group input-full">
          <label>Confirm Password</label>
          <input type="password" v-model="form.password_confirmation" required />
          <p v-if="errors.password_confirmation" class="error-text">
            {{ errors.password_confirmation[0] }}
          </p>
        </div>

        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>

          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Resetting…' : 'Reset Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const props = defineProps({
  user: { type: Object, required: true }
})

const emit = defineEmits(['close'])
const auth = useAuthStore()

const loading = ref(false)
const errors = reactive({})

const form = reactive({
  password: '',
  password_confirmation: ''
})

function close() {
  emit('close')
}

async function submit() {
  Object.keys(errors).forEach((key) => (errors[key] = null))

  try {
    loading.value = true

    await axios.post(`http://localhost:8000/api/users/${props.user.id}/reset-password`, form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Password reset successfully!')
    close()
  } catch (err) {
    console.error(err.response?.data)

    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error!')
    } else {
      toast.error('Failed to reset password.')
    }
  } finally {
    loading.value = false
  }
}
</script>

.
