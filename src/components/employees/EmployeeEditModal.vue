<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Edit Employee</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="submit" class="modal-form-grid">
        <div class="form-group">
          <label>First Name</label>
          <input v-model="form.first_name" required />
          <p v-if="errors.first_name" class="error-text">{{ errors.first_name[0] }}</p>
        </div>

        <div class="form-group">
          <label>Middle Name</label>
          <input v-model="form.middle_name" />
          <p v-if="errors.middle_name" class="error-text">{{ errors.middle_name[0] }}</p>
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
            {{ loading ? 'Updating…' : 'Update Employee' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  employee: { type: Object, required: true }
})

const emit = defineEmits(['close', 'updated'])
const auth = useAuthStore()

const loading = ref(false)
const roles = ref([])
const errors = reactive({})

// form data
const form = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  gender: '',
  phone: '',
  role_id: ''
})

watch(
  () => props.employee,
  (emp) => {
    if (!emp) return
    form.first_name = emp.first_name
    form.middle_name = emp.middle_name
    form.last_name = emp.last_name
    form.email = emp.email
    form.gender = emp.gender
    form.phone = emp.phone
    form.role_id = emp.user?.role_id ?? ''
  },
  { immediate: true }
)

async function loadRoles() {
  const res = await axios.get('http://localhost:8000/api/roles', {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  roles.value = res.data.roles
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null))

  try {
    loading.value = true

    await axios.put(`http://localhost:8000/api/employees/${props.employee.id}`, form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    toast.success('Employee updated successfully!')

    emit('updated')
    close()
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('Validation error.')
    } else {
      toast.error('Error updating employee.')
    }
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

onMounted(loadRoles)
</script>
