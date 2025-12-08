<template>
  <div class="filters-container">

    <!-- Search -->
    <div class="filter-item">
      <label>Search</label>
      <input
        v-model="filters.search"
        type="text"
        class="filter-input"
        placeholder="Search by title..."
      />
    </div>

    <!-- Client -->
    <div class="filter-item">
      <label>Client</label>
      <select v-model="filters.client_id" class="filter-input">
        <option value="">All</option>
        <option v-for="c in clients" :key="c.id" :value="c.id">
          {{ c.client_name }}
        </option>
      </select>
    </div>

    <!-- Priority -->
    <div class="filter-item">
      <label>Priority</label>
      <select v-model="filters.priority" class="filter-input">
        <option value="">All</option>
        <option v-for="p in priorities" :key="p.id" :value="p.priority_name">
          {{ p.priority_name }}
        </option>
      </select>
    </div>

    <!-- Assigned Employee -->
    <div class="filter-item">
      <label>Assigned Employee</label>
      <select v-model="filters.employee_id" class="filter-input">
        <option value="">All</option>
        <option v-for="e in employees" :key="e.id" :value="e.id">
          {{ e.first_name }} {{ e.last_name }}
        </option>
      </select>
    </div>

    <!-- Status -->
    <div class="filter-item">
      <label>Status</label>
      <select v-model="filters.status" class="filter-input">
        <option value="">All</option>
        <option value="opened">Opened</option>
        <option value="assigned">Assigned</option>
        <option value="in_progress">In Progress</option>
        <option value="reassigned">Reassigned</option>
        <option value="closed">Closed</option>
      </select>
    </div>

    <!-- Date From -->
    <div class="filter-item">
      <label>Date From</label>
      <input
        type="date"
        v-model="filters.date_from"
        class="filter-input"
      />
    </div>

    <!-- Date To -->
    <div class="filter-item">
      <label>Date To</label>
      <input
        type="date"
        v-model="filters.date_to"
        class="filter-input"
      />
    </div>

    <!-- Buttons -->
    <div class="filter-actions">
      <button class="apply-btn" @click="emitFilters">
        Apply Filters
      </button>

      <button class="reset-btn" @click="resetFilters">
        Reset
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()
const emit = defineEmits(["applyFilters"])

const filters = ref({
  search: "",
  client_id: "",
  priority: "",
  employee_id: "",
  status: "",
  date_from: "",
  date_to: ""
})

const clients = ref([])
const priorities = ref([])
const employees = ref([])

async function loadData() {
  const token = auth.token

  clients.value = (await axios.get("/api/clients", {
    headers: { Authorization: `Bearer ${token}` }
  })).data.data

  priorities.value = (await axios.get("/api/priorities", {
    headers: { Authorization: `Bearer ${token}` }
  })).data

  employees.value = (await axios.get("/api/employees", {
    headers: { Authorization: `Bearer ${token}` }
  })).data.data
}

function emitFilters() {
  emit("applyFilters", { ...filters.value })
}

function resetFilters() {
  filters.value = {
    search: "",
    client_id: "",
    priority: "",
    employee_id: "",
    status: "",
    date_from: "",
    date_to: ""
  }
  emitFilters()
}

onMounted(loadData)
</script>

<style scoped>
.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #eee;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-item label {
  font-size: 13px;
  margin-bottom: 6px;
  color: #444;
}

.filter-input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.apply-btn {
  background: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.reset-btn {
  background: #ccc;
  color: #000;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
</style>
