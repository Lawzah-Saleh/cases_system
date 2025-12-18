<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Create New Support Case</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="createCase">
        <div class="modal-form-grid">
          <!-- Case Title -->
          <div class="form-group input-full">
            <h3 class="modal-section-title">Case Title</h3>
            <input
              type="text"
              v-model="form.title"
              class="modal-input"
              placeholder="Enter Case Name"
            />
          </div>

          <!-- Description -->
          <div class="form-group input-full">
            <h3 class="modal-section-title">Description</h3>
            <textarea
              v-model="form.description"
              class="modal-input modal-textarea"
              placeholder="Case Description"
            ></textarea>
          </div>

          <!-- NOTE FIELD (ADDED) -->
          <div class="form-group input-full">
            <h3 class="modal-section-title">Note</h3>
            <textarea
              v-model="form.note"
              class="modal-input modal-textarea"
              placeholder="Add internal note (optional)"
            ></textarea>
          </div>

          <!-- Client -->
          <div class="form-group">
            <h3 class="modal-section-title">Client</h3>
            <select v-model="form.client_id" class="modal-input">
              <option disabled value="">Select Client</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.client_name }}
              </option>
            </select>
          </div>

          <!-- Type -->
          <div class="form-group">
            <h3 class="modal-section-title">Type</h3>
            <select v-model="form.type" class="modal-input">
              <option disabled value="">Select Type</option>
              <option v-for="t in types" :key="t">
                {{ t }}
              </option>
            </select>
          </div>

          <!-- Way Entry (REMOVED) -->

          <!-- Priority -->
          <div class="form-group">
            <h3 class="modal-section-title">Priority</h3>
            <select v-model="form.priority_id" class="modal-input">
              <option disabled value="">Select Priority</option>
              <option v-for="p in priorities" :key="p.id" :value="p.id">
                {{ p.priority_name }}
              </option>
            </select>
          </div>

          <!-- Status (REMOVED) -->

          <!-- Employees -->
          <div class="form-group input-full">
            <h3 class="modal-section-title">Assigned Employees</h3>
            <select v-model="form.employee_ids" class="modal-input" multiple>
              <option v-for="e in employees" :key="e.id" :value="e.id">
                {{ e.first_name }} {{ e.last_name }}
              </option>
            </select>
          </div>

          <!-- Attachment -->
          <div class="form-group input-full">
            <h3 class="modal-section-title">Attachment</h3>
            <input type="file" @change="handleFile" class="modal-input" />
          </div>
        </div>

        <div class="btn-row input-full">
          <button class="btn-secondary" type="button" @click="close">Cancel</button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Case' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const loading = ref(false)

const types = ['technical', 'service_request', 'delay', 'miscommunication', 'enquery', 'others']

const clients = ref([])
const employees = ref([])
const priorities = ref([])

onMounted(async () => {
  const token = useAuthStore().token

  const resClients = await axios.get('http://localhost:8000/api/clients', {
    headers: { Authorization: `Bearer ${token}` }
  })
  clients.value = resClients.data.data ?? resClients.data

  const resEmployees = await axios.get('http://localhost:8000/api/employees', {
    headers: { Authorization: `Bearer ${token}` }
  })
  employees.value = resEmployees.data.data ?? resEmployees.data

  const resPriorities = await axios.get('http://localhost:8000/api/priorities', {
    headers: { Authorization: `Bearer ${token}` }
  })
  priorities.value = resPriorities.data
})

const emit = defineEmits(['close', 'created'])

function close() {
  emit('close')
}

const form = ref({
  title: '',
  description: '',
  note: '',
  client_id: '',
  type: '',
  priority_id: '',
  employee_ids: [],
  attachment: null,
  way_entry: 'manual'
})

function handleFile(e) {
  form.value.attachment = e.target.files[0]
}

async function createCase() {
  if (loading.value) return
  loading.value = true

  try {
    const token = useAuthStore().token

    const fd = new FormData()
    for (const key in form.value) {
      if (key === 'employee_ids') {
        form.value[key].forEach((id) => fd.append('employee_ids[]', id))
      } else if (key === 'attachment' && form.value.attachment === null) {
        continue
      } else if (key === 'note' && !form.value.note) {
        continue
      } else {
        fd.append(key, form.value[key])
      }
    }

    const res = await axios.post('http://localhost:8000/api/cases', fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    toast.success('Case created successfully!')

    emit('created', res.data)

    // reset form
    Object.keys(form.value).forEach((k) => {
      if (Array.isArray(form.value[k])) form.value[k] = []
      else form.value[k] = ''
    })

    close()
  } catch (err) {
    toast.error(err.response?.data?.message ?? 'Failed to create case')
  } finally {
    loading.value = false
  }
}
</script>
