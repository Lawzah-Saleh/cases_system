<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Edit Priority</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="submit" class="modal-form-grid">
        <!-- PRIORITY NAME -->
        <div class="form-group input-full">
          <label>Priority Name</label>
          <input v-model="form.priority_name" required />
          <p v-if="errors.priority_name" class="error-text">{{ errors.priority_name[0] }}</p>
        </div>

        <!-- DELAY TIME -->
        <div class="form-group input-full">
          <label>Delay Time (Hours)</label>

          <div class="delay-box">
            <button type="button" class="delay-btn" @click="decreaseTime">−</button>

            <span class="delay-value">{{ form.delay_time }} hours</span>

            <button type="button" class="delay-btn" @click="increaseTime">+</button>
          </div>

          <p v-if="errors.delay_time" class="error-text">{{ errors.delay_time[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row input-full">
          <button type="button" class="btn-secondary" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Updating…' : 'Update Priority' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  priority: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])
const auth = useAuthStore()

const loading = ref(false)
const errors = reactive({})

// form reactive data
const form = reactive({
  priority_name: '',
  delay_time: ''
})

// watch for incoming priority data
watch(
  () => props.priority,
  (p) => {
    if (!p) return
    form.priority_name = p.priority_name
    form.delay_time = p.delay_time
  },
  { immediate: true }
)

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

    await axios.put(`http://localhost:8000/api/priorities/${props.priority.id}`, form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Priority updated successfully!')

    emit('updated')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error updating priority.')
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
</style>
