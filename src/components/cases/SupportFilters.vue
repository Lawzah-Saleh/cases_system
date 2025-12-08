<template>
  <div class="filter-area">
    <div class="filter-grid">
      
      <input v-model="filters.search" @input="emitSearch"class="filter-input" placeholder="Search cases..."/>

      <input type="date" v-model="filters.date_from" class="filter-input" />

      <input type="date" v-model="filters.date_to" class="filter-input" />
    </div>

    <div class="filter-grid">
      <select v-model="filters.status" class="filter-select">
        <option value="">Select Status</option>
        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
      </select>

      <select v-model="filters.client_id" class="filter-select">
        <option value="">Select Customer</option>
        <option v-for="c in props.clients" :key="c.id" :value="c.id">
          {{ c.client_name }}
        </option>
      </select>

      <select v-model="filters.type" class="filter-select">
        <option value="">Select Type</option>
        <option v-for="t in typeOptions" :key="t">{{ t }}</option>
      </select>
    </div>

    <div class="filter-grid">
    <select v-model="filters.priority" class="filter-select">
      <option value="">Select Priority</option>
      <option v-for="p in props.priorities" :key="p.id" :value="p.priority_name">
        {{ p.priority_name }}
      </option>
    </select>

      <select v-model="filters.way_entry" class="filter-select">
        <option value="">Way Entry</option>
        <option value="email">Email</option>
        <option value="manual">Manual</option>
      </select>

      <button class="apply-btn" @click="apply">Apply</button>
    </div>

    <button class="reset-btn" @click="reset">Reset Filters</button>
  </div>

  <ActiveFiltersBar :filters="tags" @remove="removeTag" />
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ActiveFiltersBar from './ActiveFiltersBar.vue'
import debounce from 'lodash/debounce'

const emitSearch = debounce(() => {
  emit('applyFilters', filters)
}, 400)

const emit = defineEmits(['applyFilters'])

const props = defineProps({
  clients: {
    type: Array,
    default: () => []
  },
  priorities: {
    type: Array,
    default: () => []
  }
})

const filters = reactive({
  search: '',
  date_from: '',
  date_to: '',
  status: '',
  client_id: '',
  type: '',
  priority: '',
  way_entry: ''
})


const tags = computed(() => {
  let arr = []
  for (let key in filters) {
    if (filters[key]) {
      let label = `${key.replace('_', ' ')}: ${filters[key]}`
      arr.push({ key, label })
    }
  }
  return arr
})

function apply() {
  emit('applyFilters', filters)
}

function reset() {
  Object.keys(filters).forEach((k) => (filters[k] = ''))
  emit('applyFilters', filters)
}

function removeTag(key) {
  filters[key] = ''
  emit('applyFilters', filters)
}

const statusOptions = ['opened', 'assigned', 'in_progress', 'reassigned', 'closed']
const typeOptions = ['technical','service_request','delay','miscommunication','enquery','others']
</script>

<style scoped>
/* FILTER WRAPPER */
.filter-area {
  background: #ffffff;
  padding: 25px;
  border-radius: 18px;
  box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

/* GRID */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 18px;
  margin-bottom: 20px;
}

/* INPUTS */
.filter-input,
.filter-select {
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  outline: none;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #6c63ff;
  box-shadow: 0px 0px 4px rgba(108, 99, 255, 0.4);
}

/* BUTTONS */
.apply-btn {
  background: var(--primary-color);
  color: white;
  padding: 12px 26px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
}

.reset-btn {
  background: #e8e8e8;
  color: #333;
  padding: 12px 26px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
}

@media (max-width: 900px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
