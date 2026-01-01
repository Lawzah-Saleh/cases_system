<template>
  <div class="table-container">
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">
          <span class="link-back" @click="$router.back()">Reports</span> / Cases Report
        </h2>
      </div>
    </div>

    <ReportFilters
      :clients="clients"
      :priorities="priorities"
      :employees="employees"
      @applyFilters="handleFilters"
    />

    <div class="report-header-row">
      <button class="filter-button" @click="showFilter = true">
        Show/Hide Columns ({{ visibleCount }}/{{ columns.length }})
      </button>

      <!-- Right side: Export -->
      <button class="download-btn" @click="exportCSV">DOWNLOAD EXCEL</button>
    </div>

    <!-- ===================== COLUMNS MODAL ===================== -->
    <div v-if="showFilter" class="filter-overlay" @click.self="closeFilter">
      <div class="filter-modal">
        <div class="filter-header">
          <h2>Show/Hide Columns</h2>

          <button class="select-all-btn" @click="selectAllColumns">All</button>
        </div>

        <div class="filter-grid">
          <div v-for="col in columns" :key="col.key" class="filter-item">
            <input type="checkbox" v-model="col.visible" />
            <label>{{ col.label }}</label>
          </div>
        </div>

        <div class="filter-footer">
          <button class="cancel-btn" @click="closeFilter">Cancel</button>
          <button class="apply-btn" @click="applyColumnFilters">Apply</button>
        </div>
      </div>
    </div>

    <!-- ===================== TABLE ===================== -->
    <div class="table-scroll">

        <table class="custom-table">
          <thead>
            <tr class="table-header-row">
              <th v-if="isVisible('id')">ID</th>
              <th v-if="isVisible('title')" @click="setSort('title')" class="sortable">
                Title <span>{{ sortBy === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th v-if="isVisible('type')">Type</th>
              <th v-if="isVisible('way_entry')">Way Entry</th>
              <th v-if="isVisible('status')" @click="setSort('status')" class="sortable">
                Status
                <span>{{ sortBy === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th v-if="isVisible('priority')" @click="setSort('priority')" class="sortable">
                Priority
                <span>{{ sortBy === 'priority' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}</span>
              </th>
              <th v-if="isVisible('client')">Customer</th>
              <th v-if="isVisible('employees')">Team Members</th>
              <th v-if="isVisible('created')">Created At</th>
              <th v-if="isVisible('accepted')">Accepted At</th>

            </tr>
          </thead>

          <tbody>
            <tr v-if="isLoading" v-for="n in 5" :key="n">
              <td colspan="10"><div class="skeleton-bar"></div></td>
            </tr>

            <tr v-else v-for="(item, index) in cases" :key="item.id" class="table-row-hover">
              <td v-if="isVisible('id')">  {{ (currentPage - 1) * 10 + (index + 1) }}</td>
              <td v-if="isVisible('title')">{{ item.title }}</td>
              <td v-if="isVisible('type')"><span class="badge badge-soft">{{ item.type }}</span></td>
              <td v-if="isVisible('way_entry')">{{ item.way_entry }}</td>
              <td v-if="isVisible('status')"><span class="badge" :class="statusBadgeClass(item.status)">
      {{ item.status }}
    </span>
    </td>
    <td v-if="isVisible('priority')">
      <span
        class="badge"
        :class="priorityBadgeClass(item.priority?.priority_name ?? '')"
      >
        {{ item.priority?.priority_name ?? '—' }}
      </span>
    </td>
              <td v-if="isVisible('client')">{{ item.client?.client_name ?? '—' }}</td>
              <td v-if="isVisible('employees')">
                <div v-for="e in item.employees" :key="e.id">
                  • {{ e.first_name }} {{ e.last_name }}
                </div>
              </td>
              <td v-if="isVisible('created')">{{ formatDate(item.created_at) }}</td>
              <td v-if="isVisible('accepted')">{{ formatDate(item.accepted_at) }}</td>

            </tr>

            <tr v-if="!isLoading && cases.length === 0">
              <td colspan="10" class="empty-msg">No results found.</td>
            </tr>
          </tbody>
        </table>
    </div>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container mt-4">
<p class="results-count">
  Showing {{ cases.length }} of {{ total }} cases
</p>

      <div>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1 || isLoading"
          class="page-btn"
        >
          &lt; Prev
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === lastPage || isLoading"
          class="page-btn"
        >
          Next &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import ReportFilters from '@/components/cases/SupportFilters.vue'
import { computed } from 'vue'
import { toast } from 'vue3-toastify'
const visibleCount = computed(() => columns.value.filter(c => c.visible).length)


const auth = useAuthStore()

const cases = ref([])

/* ===================== FIX #1 — DEFAULT SAFE STATS ===================== */
const stats = ref({
  total: 0,
  opened: 0,
  assigned: 0,
  inprogress: 0,
  reassigned: 0,
  closed: 0
})

const isLoading = ref(false)

const filterParams = ref({})
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const sortBy = ref(null)
const sortDirection = ref('asc')

/* ===================== COLUMNS ===================== */
const showFilter = ref(false)
const columns = ref([
  { key: 'id', label: 'ID', visible: true },
  { key: 'title', label: 'Title', visible: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'way_entry', label: 'Way Entry', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'priority', label: 'Priority', visible: true },
  { key: 'client', label: 'Client', visible: true },
  { key: 'employees', label: 'Employees', visible: true },
  { key: 'created', label: 'Created At', visible: true },
  { key: 'accepted', label: 'Accepted At', visible: true }

])

const isVisible = (key) => columns.value.find((c) => c.key === key)?.visible ?? false
const selectAllColumns = () => columns.value.forEach((c) => (c.visible = true))
const closeFilter = () => (showFilter.value = false)
const applyColumnFilters = () => (showFilter.value = false)

/* ===================== API LOAD ===================== */
async function loadReport(page = 1) {
  try {
    isLoading.value = true
    currentPage.value = page

    const res = await axios.get('http://localhost:8000/api/reports/cases', {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: {
        page,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
        ...filterParams.value
      }
    })

    /* ---------------- SAFETY FIX ---------------- */
    cases.value = res.data?.data ?? []

    stats.value = res.data?.stats ?? stats.value

    total.value = res.data?.total ?? 0
    lastPage.value = res.data?.last_page ?? 1
  } catch (err) {
    console.error('Report load failed:', err)
  } finally {
    isLoading.value = false
  }
}

function changePage(page) {
  if (page < 1 || page > lastPage.value) return
  loadReport(page)
}
function handleFilters(f) {
  filterParams.value = { ...f }
  loadReport(1)
}

function setSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }
  loadReport(1)
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString()
}

/* ===================== FIXED EXPORT URL ===================== */
async function exportCSV() {
  try {
    const params = {
      sort_by: sortBy.value || '',
      sort_direction: sortDirection.value || 'asc',
      visible_columns: columns.value
        .filter((c) => c.visible)
        .map((c) => c.key)
        .join(','), // "id,title,status"
      ...filterParams.value
    }

    const response = await axios.get('http://localhost:8000/api/reports/cases/export', {
      params,
      headers: { Authorization: `Bearer ${auth.token}` },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'cases-report.xlsx')
    document.body.appendChild(link)
    link.click()
     toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
    link.remove()
  } catch (error) {
     toast.error('Excel file downloaded successfully!', {
          timeout: 3000
        })
    console.error('EXPORT ERROR:', error)
  }
}

onMounted(() => {
  loadReport()
  loadFilterData()
})

const clients = ref([])
const priorities = ref([])
const employees = ref([])

async function loadFilterData() {
  const token = useAuthStore().token

  clients.value = (
    await axios.get('http://localhost:8000/api/clients', {
      headers: { Authorization: `Bearer ${token}` }
    })
  ).data.data

  priorities.value = (
    await axios.get('http://localhost:8000/api/priorities', {
      headers: { Authorization: `Bearer ${token}` }
    })
  ).data
  employees.value = (
    await axios.get('http://localhost:8000/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    })
  ).data.data
}

function statusBadgeClass(status) {
  switch (status) {
    case 'opened':
      return 'badge-status-open'
    case 'assigned':
      return 'badge-status-assigned'
    case 'in_progress':
      return 'badge-status-inprogress'
    case 'reassigned':
      return 'badge-status-reassigned'
    case 'closed':
      return 'badge-status-closed'
    default:
      return ''
  }
}
function priorityBadgeClass(priority) {
  if (!priority) return ''

  const p = priority.toLowerCase()

  if (p.includes('high')) return 'badge-priority-high'
  if (p.includes('middle')) return 'badge-priority-middle'
  if (p.includes('low')) return 'badge-priority-low'
  if (p.includes('normal')) return 'badge-priority-normal'

  return ''
}

</script>

<style scoped>
/* ACTION ROW (Export / Filters Button) */
.export-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

/* SORT ARROWS */
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  color: var(--primary-color);
}

/* EMPTY STATE */
.empty-msg {
  text-align: center;
  padding: 25px;
  font-size: 15px;
  color: #999;
}
.table-scroll {
  overflow-x: auto; 
  width: 100%;
}


@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 0.5;
  }
}


</style>
