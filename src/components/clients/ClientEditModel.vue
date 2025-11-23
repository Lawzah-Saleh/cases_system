<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- Header -->
      <div class="modal-header">
        <h3>Edit Client</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Modify the information below to edit the client.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">
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
        <div class="form-group full">
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
        <div class="form-group full">
          <label>Upload New Logo (optional)</label>
          <input type="file" @change="handleFile" />
          <p v-if="errors.logo" class="error-text">{{ errors.logo[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Updating…' : 'Update Client' }}
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
/* SAME STYLE AS CREATE */
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

.preview-logo {
  width: 120px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
</style>
