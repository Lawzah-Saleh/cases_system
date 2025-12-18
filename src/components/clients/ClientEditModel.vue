<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Edit Client</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submit" class="modal-form-grid">
        <!-- CLIENT NAME -->
        <div class="form-group">
          <label>Client Name</label>
          <input v-model="form.client_name" placeholder="Leave empty to keep old name" />
          <p v-if="errors.client_name" class="error-text">{{ errors.client_name[0] }}</p>
        </div>

        <!-- ADDRESS -->
        <div class="form-group">
          <label>Address</label>
          <input v-model="form.address" placeholder="Leave empty to keep old address" />
          <p v-if="errors.address" class="error-text">{{ errors.address[0] }}</p>
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" placeholder="Leave empty to keep old email" />
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <!-- CURRENT LOGO -->
        <div class="form-group input-full">
          <label>Current Logo</label>
          <img
            v-if="props.client.logo_url"
            :src="props.client.logo_url"
            class="preview-logo"
            alt="Logo Preview"
          />
          <p v-else>No Logo</p>
        </div>

        <!-- NEW LOGO -->
        <div class="form-group input-full">
          <label>Upload New Logo (optional)</label>
          <input type="file" @change="handleFile" />
          <p v-if="errors.logo" class="error-text">{{ errors.logo[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Updating…' : 'Update Client' }}
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
  client: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])

const auth = useAuthStore()

const loading = ref(false)

const errors = reactive({})

/*
  We make fields optional:
  – user can edit or leave empty
*/
const form = reactive({
  client_name: '',
  address: '',
  email: '',
  logo: null
})

/* ---------------------------
   FILL FORM WHEN MODAL OPENS
-----------------------------*/
onMounted(() => {
  form.client_name = props.client.client_name
  form.address = props.client.address
  form.email = props.client.email
})

/* ---------------------------
   HANDLE FILE UPLOAD
-----------------------------*/
function handleFile(e) {
  form.logo = e.target.files[0]
}

/* ---------------------------
   SUBMIT UPDATE
-----------------------------*/
async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    const fd = new FormData()

    // Send fields only if they have value
    if (form.client_name) fd.append('client_name', form.client_name)
    if (form.address) fd.append('address', form.address)
    if (form.email) fd.append('email', form.email)

    if (form.logo) {
      fd.append('logo', form.logo)
    }

    fd.append('_method', 'PUT')

    await axios.post(`http://localhost:8000/api/clients/${props.client.id}`, fd, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Client updated successfully!')
    emit('updated')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error updating client.')
    }
  } finally {
    loading.value = false
  }
}

/* ---------------------------
   CLOSE MODAL
-----------------------------*/
function close() {
  emit('close')
}
</script>

<style scoped>
.preview-logo {
  width: 120px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
</style>
