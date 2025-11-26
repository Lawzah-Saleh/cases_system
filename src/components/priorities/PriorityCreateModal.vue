<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <!-- HEADER -->
      <div class="modal-header">
        <h3>Create Priority</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Create a new priority with its delay time.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">
        <!-- PRIORITY NAME -->
        <div class="form-group full">
          <label>Priority Name</label>
          <input v-model="form.priority_name" required placeholder="Enter priority name" />
          <p v-if="errors.priority_name" class="error-text">
            {{ errors.priority_name[0] }}
          </p>
        </div>

        <!-- DELAY TIME -->

        <div class="form-group full">
          <label>Delay Time (Hours)</label>

          <div class="delay-box">
            <button type="button" class="delay-btn" @click="decreaseTime">−</button>

            <span class="delay-value">{{ form.delay_time }} hours</span>

            <button type="button" class="delay-btn" @click="increaseTime">+</button>
          </div>

          <p v-if="errors.delay_time" class="error-text">{{ errors.delay_time[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving…' : 'Create Priority' }}
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
  priority_name: '',
  delay_time: ''
})

function increaseTime() {
  form.delay_time = Number(form.delay_time) + 1
}

function decreaseTime() {
  if (form.delay_time > 1) {
    form.delay_time = Number(form.delay_time) - 1
  }
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    await axios.post('http://localhost:8000/api/priorities', form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Priority created successfully!')
    emit('created')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error creating priority.')
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
.delay-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: #f6f6f6;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--table-border);
  width: 100%;
}

.delay-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  background: var(--primary-color);
  color: white;
  transition: 0.2s;
}

.delay-btn:hover {
  background: var(--primary-hover);
}

.delay-value {
  font-size: 16px;
  font-weight: 600;
  width: 60px;
  text-align: center;
}

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

input {
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
