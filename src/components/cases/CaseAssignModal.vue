<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Header -->
      <h2 class="modal-header">Assign Employees</h2>
      <p class="modal-subtitle">Choose one or more employees to handle this support case.</p>

      <!-- Label -->
      <label class="field-label">Select Employees</label>

      <!-- Selected Box -->
      <div class="selected-box" @click="toggleDropdown">
        <template v-if="selectedEmployees.length">
          <div v-for="emp in selectedEmployeesData" :key="emp.id" class="tag-item">
            {{ emp.first_name }} {{ emp.last_name }}
            <span class="remove" @click.stop="removeTag(emp.id)">×</span>
          </div>
        </template>

        <span v-else class="placeholder">Select employees</span>

        <span class="arrow">{{ dropdownOpen ? '▲' : '▼' }}</span>
      </div>

      <!-- Dropdown -->
      <div v-if="dropdownOpen" class="dropdown-box animate">
        <input v-model="search" class="dropdown-search" placeholder="Search employees..." />

        <div class="employee-item" v-for="emp in filteredEmployees" :key="emp.id">
          <input
            v-if="props.mode === 'assign'"
            type="checkbox"
            :value="emp.id"
            v-model="selectedEmployees"
          />

          <input
            v-if="props.mode === 'reassign'"
            type="radio"
            name="newAssignee"
            :value="emp.id"
            v-model="selectedEmployee"
          />

          <span>{{ emp.first_name }} {{ emp.last_name }}</span>
        </div>

        <p v-if="filteredEmployees.length === 0" class="no-results">No employees found.</p>
      </div>

      <!-- Buttons -->
      <div class="actions">
        <button class="btn cancel-btn" @click="close">Cancel</button>
        <button class="btn assign-btn" @click="assignToMe">Assign to Me</button>
        <button class="btn assign-btn" @click="assign">Assign</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { toast } from 'vue3-toastify'

const API_URL = 'http://localhost:8000/api' // <-- ADD THIS HERE

const props = defineProps({
  caseData: Object,
  mode: { type: String, default: 'assign' }
})

const emit = defineEmits(['close', 'assigned', 'reassigned'])

const employees = ref([])
const selectedEmployees = ref([])
const dropdownOpen = ref(false)
const search = ref('')

const auth = useAuthStore()

// Load employees from API
async function fetchEmployees() {
  const res = await axios.get('http://localhost:8000/api/employees', {
    headers: { Authorization: `Bearer ${auth.token}` }
  })

  employees.value = res.data.data
}

fetchEmployees()

// computed: selected employee objects
const selectedEmployeesData = computed(() =>
  employees.value.filter((e) => selectedEmployees.value.includes(e.id))
)

const filteredEmployees = computed(() => {
  let list = employees.value

  if (props.mode === 'reassign') {
    const userId = auth.user.id
    list = list.filter((emp) => emp.id !== userId)
  }

  // Apply search filter
  if (!search.value) return list

  return list.filter((emp) =>
    (emp.first_name + ' ' + emp.last_name).toLowerCase().includes(search.value.toLowerCase())
  )
})

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function removeTag(id) {
  selectedEmployees.value = selectedEmployees.value.filter((e) => e !== id)
}
const selectedEmployee = ref(null)

async function assign() {
  try {
    const token = useAuthStore().token

    let res

    if (props.mode === 'assign') {
      await axios.post(
        `http://localhost:8000/api/cases/${props.caseData.id}/assign`,
        { employee_ids: selectedEmployees.value },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      emit('assigned')
      emit('close')
      toast.success('Employees assigned successfully!')
    }

    if (props.mode === 'reassign') {
      if (!selectedEmployee.value) {
        toast.error('Please select an employee to reassign.')
        return
      }

      const newEmployeeId = Number(selectedEmployee.value)

      const res = await axios.post(
        `${API_URL}/cases/${props.caseData.id}/reassign`,
        { employee_id: newEmployeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      emit('reassigned', res.data.case)
      emit('close')
      toast.success('Case reassigned successfully!')

      return
    }
  } catch (err) {
    console.error(err)
    toast.error('An error occurred during assignment.')
  }
}

async function assignToMe() {
  try {
    const token = useAuthStore().token

    await axios.post(
      `http://localhost:8000/api/cases/${props.caseData.id}/assign-to-me`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    emit('assigned')
    emit('close')

    toast.success('Assigned to you successfully!')
  } catch (e) {
    console.error(e)
    toast.error('Failed to assign the case to you.')
  }
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-subtitle {
  color: #777;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Field label */
.field-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

/* Selected Box */
.selected-box {
  border: 1px solid #dcdcdc;
  padding: 10px;
  border-radius: 10px;
  min-height: 44px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  position: relative;
  cursor: pointer;
  background: white;
}

.placeholder {
  color: #aaa;
  font-size: 14px;
}

.arrow {
  margin-left: auto;
  font-size: 14px;
  color: #555;
}

/* Tag */
.tag-item {
  background: #f0f0ff;
  color: #4b32c3;
  padding: 6px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.tag-item .remove {
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #777;
}

/* Dropdown */
.dropdown-box {
  margin-top: 8px;
  border: 1px solid #dcdcdc;
  padding: 12px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.dropdown-search {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
}

.employee-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
}

.employee-item:hover {
  background: #f7f7ff;
  border-radius: 6px;
}

.no-results {
  text-align: center;
  padding: 10px;
  color: #777;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: #eee;
}

.assign-btn {
  background: var(--primary-color);
  color: white;
}
.assign-btn :hover {
  background: var(--primary-hover);
}
</style>
