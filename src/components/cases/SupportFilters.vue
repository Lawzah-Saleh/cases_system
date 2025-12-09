  <template>
    <div class="filter-wrapper">

      <!-- ROW 1 -->
      <div class="filter-row">
        <div class="field">
          <label>Search</label>
          <input v-model="filters.search" @input="emitSearch" class="input" placeholder="Search cases..." />
        </div>

        <div class="field">
          <label>Status</label>
          <select v-model="filters.status" class="input">
            <option value="">Select Status</option>
            <option v-for="s in statusOptions" :key="s">{{ s }}</option>
          </select>
        </div>

        <div class="field">
          <label>Type</label>
          <select v-model="filters.type" class="input">
            <option value="">Select Type</option>
            <option v-for="t in typeOptions" :key="t">{{ t }}</option>
          </select>
        </div>

        <div class="field">
          <label>Way Entry</label>
          <select v-model="filters.way_entry" class="input">
            <option value="">Way Entry</option>
            <option value="email">Email</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <!-- ROW 2 -->
      <div class="filter-row">
        <div class="field">
          <label>Priority</label>
          <select v-model="filters.priority" class="input">
            <option value="">Select Priority</option>
            <option v-for="p in props.priorities" :key="p.id" :value="p.priority_name">
              {{ p.priority_name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Customer</label>
          <select v-model="filters.client_id" class="input">
            <option value="">Select Customer</option>
            <option v-for="c in props.clients" :key="c.id" :value="c.id">
              {{ c.client_name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>From Date</label>
          <input type="date" v-model="filters.date_from" class="input" />
        </div>

        <div class="field">
          <label>To Date</label>
          <input type="date" v-model="filters.date_to" class="input" />
        </div>
      </div>

      <!-- ROW 3 (No empty spaces) -->
      <div class="filter-row row-3">

        <div class="field">
          <label>Employees</label>
          <EmployeesMultiSelect
            :employees="props.employees"
            v-model="filters.employee_ids"
          />
        </div>




        <div class="action-field">
          <button class="btn-apply" @click="apply">Apply</button>
        </div>

        <div class="action-field">
          <button class="btn-reset" @click="reset">Reset</button>
        </div>

      </div>
      <ActiveFiltersBar 
  :filters="tags" 
  @remove="removeTag" 
/>


    </div>
  </template>


  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import ActiveFiltersBar from './ActiveFiltersBar.vue'
  import debounce from 'lodash/debounce'
import EmployeesMultiSelect from '@/components/cases/EmployeesMultiSelect.vue'

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
    },
        employees: {
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
    way_entry: '',
    employee_ids: []

  })


  const tags = computed(() => {
    let arr = []
     for (let key in filters) {
    const value = filters[key];

    // If it's a multi-select (array)
    if (Array.isArray(value)) {
      if (value.length > 0) {
        arr.push({
          key,
          label: `${key.replace('_', ' ')}: ${value.join(', ')}`
        });
      }
    }
    // If it's a single value
    else if (value) {
      arr.push({
        key,
        label: `${key.replace('_', ' ')}: ${value}`
      });
    }
  }
  return arr;
});


  function apply() {
    emit('applyFilters', filters)
  }

  function reset() {
    Object.keys(filters).forEach((k) => (filters[k] = ''))
    emit('applyFilters', filters)
  }

function removeTag(key) {
  if (Array.isArray(filters[key])) {
    filters[key] = [];
  } else {
    filters[key] = "";
  }

  emit('applyFilters', filters);
}


  const statusOptions = ['opened', 'assigned', 'in_progress', 'reassigned', 'closed']
  const typeOptions = ['technical','service_request','delay','miscommunication','enquery','others']
  </script>

  <style scoped>
  .filter-wrapper {
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0px 2px 18px rgba(0,0,0,0.05);
    margin-bottom: 25px;
  }

  /* GRID ROWS */
  .filter-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    margin-bottom: 10px;  
  }

  /* Row 3 should visually fill the entire row */
  .row-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  /*** FIELDS ***/
  .field {
    display: flex;
    flex-direction: column;
  }

  .field label {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #444;
  }

  /*** INPUTS ***/
  .input {
    width: 100%;
    padding: 12px 14px;
    font-size: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #f8f8f8;
    transition: 0.25s;
  }

  .input:focus {
    border-color: #5c4dff;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(92,77,255,0.18);
    outline: none;
  }

  /*** BUTTONS ***/
  .action-field {
    display: flex;
    align-items: end;
  }

  .btn-apply,
  .btn-reset {
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-apply {
    background: var(--primary-color);
    color: white;
  }

  .btn-apply:hover {
    background: var(--primary-hover);
  }

  .btn-reset {
    background: #eee;
    color: #333;
  }

  .btn-reset:hover {
    background: #d6d6d6;
  }

  /*** RESPONSIVE ***/
  @media (max-width: 900px) {
    .filter-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 650px) {
    .filter-row {
      grid-template-columns: 1fr;
    }
  }
  </style>
