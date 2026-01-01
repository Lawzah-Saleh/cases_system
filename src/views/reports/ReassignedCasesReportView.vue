<template>
  <div class="table-container">
    <!-- ================= HEADER ================= -->
    <div class="header-row">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">Reports</span>
        / Reassigned Cases
      </h2>
    </div>

    <!-- ================= FILTER BAR ================= -->
    <div class="filters-row">
      <select v-model="filters.range">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      <template v-if="filters.range === 'custom'">
        <input type="date" v-model="filters.from_date" />
        <input type="date" v-model="filters.to_date" />
      </template>

      <select v-model="filters.status">
        <option value="">All Cases</option>
        <option value="closed">Closed</option>
        <option value="unclosed">Unclosed</option>
      </select>

      <button
        v-if="filters.range === 'custom'"
        class="apply-btn"
        @click="applyCustomRange"
        :disabled="!filters.from_date || !filters.to_date"
      >
        Apply
      </button>
            <button class="reset-btn" @click="resetFilters">Reset</button>

    </div>

    <div class="report-header-row">
      <button class="filter-button" @click="showColumnsModal = true">
        Show / Hide Columns ({{ visibleColumns.length }}/{{ columns.length }})
      </button>
      <button class="download-btn" @click="exportExcel" :disabled="loading || !cases.length">
        DOWNLOAD EXCEL
      </button>

    </div>

    <!-- ================= SHOW / HIDE MODAL ================= -->
    <div
      v-if="showColumnsModal"
      class="filter-overlay"
      @click.self="showColumnsModal = false"
    >
      <div class="filter-modal">
        <div class="filter-header">
          <h2>Show / Hide Columns</h2>
          <button class="select-all-btn" @click="selectAllColumns">All</button>
        </div>

        <div class="filter-grid">
          <label v-for="col in columns" :key="col.key" class="filter-item">
            <input type="checkbox" v-model="col.visible" />
            {{ col.label }}
          </label>
        </div>

        <div class="columns-footer">
          <button class="cancel-btn" @click="showColumnsModal = false">Cancel</button>
          <button class="apply-btn" @click="showColumnsModal = false">Apply</button>
        </div>
      </div>
    </div>

    <!-- ================= TABLE ================= -->
    <div class="table-wrapper" v-if="!loading">
      <table class="custom-table">
        <thead>
          <tr class="table-header-row">
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :class="{ sortable: col.sortable }"
              @click="col.sortable && setSort(col.key)"
            >
              {{ col.label }}
              <span v-if="sortBy === col.key">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedCases" :key="item.case_id + item.reassigned_at" class="table-row-hover">
            <td v-if="isVisible('case_id')">{{ item.case_id }}</td>
            <td v-if="isVisible('case_title')">{{ item.case_title }}</td>
            <td v-if="isVisible('old_employee')">{{ item.old_employee || '-' }}</td>
            <td v-if="isVisible('assigned_at')">{{ formatDate(item.assigned_at) }}</td>
            <td v-if="isVisible('reassigned_at')">{{ formatDate(item.reassigned_at) }}</td>
            <td v-if="isVisible('new_employee')">{{ item.new_employee || '-' }}</td>
            <td v-if="isVisible('accepted_at')">{{ formatDate(item.accepted_at) }}</td>
            <td v-if="isVisible('closed_at')">{{ formatDate(item.closed_at) }}</td>
          </tr>

          <tr v-if="!cases.length">
            <td :colspan="visibleColumns.length" class="empty-msg">
              No results found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= LOADING ================= -->
    <div v-if="loading" class="loading-indicator">Loading data...</div>

    <!-- ================= PAGINATION ================= -->
    <div class="pagination-container">
      <p class="results-count">
        Showing {{ cases.length }} of {{ total }} cases
      </p>
      <div>
        <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          &lt; Prev
        </button>
        <button class="page-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage">
          Next &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const loading = ref(false)
const cases = ref([])

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const filters = reactive({
  range: 'month',
  from_date: '',
  to_date: '',
  status: '' // Closed / Unclosed filter
})

/* ================= COLUMNS ================= */
const showColumnsModal = ref(false)

const columns = ref([
  { key: 'case_id', label: 'Case ID', visible: true, sortable: true },
  { key: 'case_title', label: 'Case Title', visible: true, sortable: true },
  { key: 'old_employee', label: 'Old Employee', visible: true, sortable: true },
  { key: 'assigned_at', label: 'Assigned At', visible: true, sortable: true },
  { key: 'reassigned_at', label: 'Reassigned At', visible: true, sortable: true },
  { key: 'new_employee', label: 'New Employee', visible: true, sortable: true },
  { key: 'accepted_at', label: 'Accepted At', visible: true, sortable: true },
  { key: 'closed_at', label: 'Closed At', visible: true, sortable: true }
])

const visibleColumns = computed(() => columns.value.filter(c => c.visible))
const isVisible = (key) => columns.value.find(c => c.key === key)?.visible
const selectAllColumns = () => columns.value.forEach(c => (c.visible = true))

/* ================= SORT ================= */
const sortBy = ref('reassigned_at')
const sortDirection = ref('desc')

function setSort(col) {
  if (sortBy.value === col) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDirection.value = 'asc'
  }
}

const sortedCases = computed(() => {
  return [...cases.value]
    .filter(c => {
      if (!filters.status) return true
      if (filters.status === 'closed') return c.closed_at != null
      if (filters.status === 'unclosed') return c.closed_at == null
      return true
    })
    .sort((a, b) => {
      const A = a[sortBy.value]
      const B = b[sortBy.value]
      if (!A || !B) return 0
      return sortDirection.value === 'asc'
        ? new Date(A) - new Date(B)
        : new Date(B) - new Date(A)
    })
})

/* ================= API ================= */
async function loadReport(page = 1) {
  loading.value = true
  currentPage.value = page

  const res = await axios.get(
    'http://localhost:8000/api/reports/reassigned-cases',
    {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: {
        page,
        from_date: filters.from_date,
        to_date: filters.to_date,
        status: filters.status
      }
    }
  )

  cases.value = res.data?.data ?? []
  total.value = res.data?.meta?.total ?? 0
  lastPage.value = res.data?.meta?.last_page ?? 1
  loading.value = false
}

/* ================= WATCH ================= */
watch(
  () => [filters.range, filters.status],
  () => loadReport(1)
)

watch(() => filters.range, (val) => {
  const now = new Date()
  switch(val) {
    case 'day':
      filters.from_date = new Date(now.setHours(0,0,0,0)).toISOString().split('T')[0]
      filters.to_date = new Date(now.setHours(23,59,59,999)).toISOString().split('T')[0]
      break;
    case 'week':
      // calculate start and end of week
      break;
    case 'month':
      // calculate start and end of month
      break;
    case 'year':
      // calculate start and end of year
      break;
    case 'custom':
      // do NOT reset from_date / to_date
      break;
  }

  if (val !== 'custom') loadReport(1) // only auto-load for non-custom ranges
})



/* ================= ACTIONS ================= */
function applyCustomRange() {
  if (!filters.from_date || !filters.to_date) return
  loadReport(1)
}

function changePage(p) {
  if (p < 1 || p > lastPage.value) return
  loadReport(p)
}

const formatDate = (d) => (d ? new Date(d).toLocaleString() : '-')

/* ================= EXPORT ================= */
async function exportExcel() {
  try {
    const params = {
      from_date: filters.from_date,
      to_date: filters.to_date,
      status: filters.status,
      visible_columns: visibleColumns.value.map(c => c.key).join(',')
    }

    const response = await axios.get(
      'http://localhost:8000/api/reports/reassigned-cases/export',
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        params,
        responseType: 'blob'
      }
    )

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'reassigned-cases-report.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export failed:', error)
  }
}
function resetFilters() {
  filters.range = 'month'
  filters.from_date = ''
  filters.to_date = ''
  filters.status = ''
  loadReport(1)
}
onMounted(loadReport)
</script>
<style scoped>

.filters-row {
  display: flex;
  gap: 12px;
  background: #f3f3f7;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 18px;
}

.filters-row select,
.filters-row input {
  padding: 10px 14px;
  border-radius: 9px;
  border: 1px solid #dcdcdc;
  min-width: 180px;
  font-size: 14px;
  background: #fff;
}

.filters-row input::placeholder {
  color: #999;
}

.reset-btn {
  background: transparent;
  border: none;
  font-weight: 700;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
}
</style>