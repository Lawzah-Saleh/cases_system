<template>
  <div class="table-container">
    <!-- ================= HEADER ================= -->
    <div class="header-row">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">Reports</span>
        / Employee Reports
      </h2>
    </div>

    <!-- ================= FILTER BAR ================= -->
    <div class="filters-row">
      <select v-model="filters.range">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>

      <input v-model="filters.employee" placeholder="Search employee..." />

      <select v-model="filters.sla">
        <option value="">All SLA</option>
        <option value="met">SLA Met</option>
        <option value="breached">SLA Breached</option>
      </select>

      <button class="reset-btn" @click="resetFilters">Reset</button>
    </div>

    <!-- ================= ACTION BAR ================= -->
    <div class="report-header-row">
      <button class="show-hide-btn" @click="showColumnsModal = true">
        Show / Hide Columns ({{ visibleColumns.length }}/{{ columns.length }})
      </button>

      <button class="download-btn" @click="exportExcel" :disabled="loading">DOWNLOAD EXCEL</button>
    </div>

    <!-- ================= SHOW / HIDE MODAL ================= -->
    <div v-if="showColumnsModal" class="columns-overlay" @click.self="showColumnsModal = false">
      <div class="columns-modal">
        <div class="columns-header">
          <h2>Show / Hide Columns</h2>
          <button class="select-all-btn" @click="selectAllColumns">All</button>
        </div>

        <div class="columns-grid">
          <label v-for="col in columns" :key="col.key" class="column-item">
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
          <tr>
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
          <tr v-for="emp in sortedEmployees" :key="emp.id">
            <td v-if="isVisible('name')">{{ emp.name }}</td>
            <td v-if="isVisible('total_cases')">{{ emp.total_cases }}</td>
            <td v-if="isVisible('closed_cases')">{{ emp.closed_cases }}</td>

            <td v-if="isVisible('completion_rate')">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: emp.completion_rate + '%' }"></div>
              </div>
              <small>{{ emp.completion_rate }}%</small>
            </td>

            <td
              v-if="isVisible('avg_first_response_time')"
              :class="responseClass(emp.avg_first_response_time)"
            >
              {{ emp.avg_first_response_time }} min
            </td>

            <td v-if="isVisible('sla_rate')" :class="slaClass(emp.sla_rate)">
              {{ emp.sla_rate }}%
            </td>

            <td v-if="isVisible('performance_score')" :class="scoreClass(emp.performance_score)">
              <strong>{{ emp.performance_score }}</strong>
            </td>
          </tr>

          <tr v-if="!employees.length">
            <td :colspan="visibleColumns.length" class="empty-msg">No results found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= LOADING ================= -->
    <div v-if="loading" class="loading-indicator">Loading data...</div>

    <!-- ================= PAGINATION ================= -->
    <div class="pagination-container" v-if="lastPage > 1">
      <p class="results-count">{{ total }} results</p>
      <div>
        <button class="page-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          &lt; Prev
        </button>
        <button
          class="page-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === lastPage"
        >
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
const employees = ref([])

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const filters = reactive({
  range: 'month',
  employee: '',
  sla: ''
})

/* ================= COLUMNS ================= */
const showColumnsModal = ref(false)

const columns = ref([
  { key: 'name', label: 'Employee', visible: true, sortable: true },
  { key: 'total_cases', label: 'Total Cases', visible: true, sortable: true },
  { key: 'closed_cases', label: 'Closed Cases', visible: true, sortable: true },
  { key: 'completion_rate', label: 'Completion %', visible: true, sortable: true },
  { key: 'avg_first_response_time', label: 'First Response (min)', visible: true, sortable: true },
  { key: 'sla_rate', label: 'SLA %', visible: true, sortable: true },
  { key: 'performance_score', label: 'Score', visible: true, sortable: true }
])

const visibleColumns = computed(() => columns.value.filter((c) => c.visible))
const isVisible = (key) => columns.value.find((c) => c.key === key)?.visible
const selectAllColumns = () => columns.value.forEach((c) => (c.visible = true))

/* ================= SORT ================= */
const sortBy = ref('performance_score')
const sortDirection = ref('desc')

function setSort(col) {
  if (sortBy.value === col) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDirection.value = 'asc'
  }
}

const sortedEmployees = computed(() => {
  return [...employees.value].sort((a, b) => {
    const A = a[sortBy.value]
    const B = b[sortBy.value]
    if (typeof A === 'string') {
      return sortDirection.value === 'asc' ? A.localeCompare(B) : B.localeCompare(A)
    }
    return sortDirection.value === 'asc' ? A - B : B - A
  })
})

/* ================= API ================= */
async function loadReport(page = 1) {
  loading.value = true
  currentPage.value = page

  const res = await axios.get('http://localhost:8000/api/reports/employees', {
    headers: { Authorization: `Bearer ${auth.token}` },
    params: { page, ...filters }
  })

  employees.value = res.data?.data ?? []
  total.value = res.data?.meta?.total ?? 0
  lastPage.value = res.data?.meta?.last_page ?? 1
  loading.value = false
}

watch(filters, () => loadReport(1), { deep: true })

function resetFilters() {
  filters.range = 'month'
  filters.employee = ''
  filters.sla = ''
}

function changePage(p) {
  if (p < 1 || p > lastPage.value) return
  loadReport(p)
}

/* ================= EXPORT ================= */
async function exportExcel() {
  try {
    const params = {
      ...filters,
      visible_columns: visibleColumns.value.map((c) => c.key).join(',')
    }

    const response = await axios.get('http://localhost:8000/api/reports/employees/export', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      params,
      responseType: 'blob'
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'employees-report.xlsx'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export Excel failed:', error)
  }
}

/* ================= UI HELPERS ================= */
const scoreClass = (s) => (s >= 85 ? 'score-high' : s >= 60 ? 'score-mid' : 'score-low')
const slaClass = (s) => (s >= 90 ? 'sla-high' : s >= 60 ? 'sla-mid' : 'sla-low')
const responseClass = (r) => (r <= 5 ? 'resp-fast' : r <= 30 ? 'resp-med' : 'resp-slow')

onMounted(loadReport)
</script>

<style scoped>
/* ======================================================
   CONTAINER & LAYOUT
====================================================== */
.table-container {
  background: #fff;
  padding: 32px;
  border-radius: 18px;
  border: 1px solid #eee;
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.06);
}

/* ======================================================
   HEADER
====================================================== */
.header-row {
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 18px;
  padding-bottom: 10px;
}

.main-header {
  font-size: 26px;
  font-weight: 700;
  color: #2d2d2d;
}

/* ======================================================
   FILTER BAR
====================================================== */
.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

/* ======================================================
   ACTION BAR
====================================================== */
.report-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f7;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 14px;
}

.show-hide-btn {
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #2d2d5f;
  cursor: pointer;
  text-decoration: underline;
}

.download-btn {
  background: var(--primary-color);
  color: #fff;
  padding: 10px 22px;
  border-radius: 9px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.download-btn:hover {
  opacity: 0.9;
}

/* ======================================================
   TABLE
====================================================== */
.table-wrapper {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
}

.custom-table thead th {
  background: #fafafa;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  color: #444;
  border-bottom: 2px solid #e6e6e6;
  white-space: nowrap;
}

.custom-table thead th.sortable {
  cursor: pointer;
  user-select: none;
}

.custom-table thead th.sortable:hover {
  color: var(--primary-color);
}

.custom-table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #2d2d2d;
  vertical-align: middle;
}

.custom-table tbody tr:hover {
  background: #f9f9f9;
}

/* ======================================================
   PROGRESS BAR (COMPLETION)
====================================================== */
.progress-bar {
  width: 100%;
  height: 10px;
  background: #ececec;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  border-radius: 6px;
  transition: width 0.3s ease;
}

/* ======================================================
   SLA / RESPONSE / SCORE COLORS
====================================================== */
.sla-high {
  color: #27ae60;
  font-weight: 700;
}

.sla-mid {
  color: #f1c40f;
  font-weight: 700;
}

.sla-low {
  color: #e74c3c;
  font-weight: 700;
}

.resp-fast {
  color: #2ecc71;
}

.resp-med {
  color: #f1c40f;
}

.resp-slow {
  color: #e74c3c;
}

.score-high {
  color: #27ae60;
}

.score-mid {
  color: #f1c40f;
}

.score-low {
  color: #e74c3c;
}

/* ======================================================
   EMPTY & LOADING STATES
====================================================== */
.empty-msg,
.loading-indicator {
  text-align: center;
  padding: 28px;
  font-size: 15px;
  color: #888;
}

/* ======================================================
   PAGINATION
====================================================== */
.pagination-container {
  margin-top: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  font-size: 14px;
  color: #666;
}

.page-btn {
  padding: 8px 22px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: #fff;
  cursor: pointer;
  transition: 0.2s ease;
}

.page-btn:hover {
  background: #f5f5f5;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ======================================================
   SHOW / HIDE COLUMNS MODAL
====================================================== */
.columns-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.columns-modal {
  width: 520px;
  max-width: 92%;
  background: #fff;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.columns-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.columns-header h2 {
  font-size: 20px;
  font-weight: 700;
}

.columns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 26px;
  margin-bottom: 26px;
}

.column-item {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.columns-footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.select-all-btn {
  background: none;
  border: none;
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
}

.cancel-btn {
  background: #e7e7e7;
  color: #333;
  padding: 9px 22px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #dcdcdc;
}

.apply-btn {
  background: var(--primary-color);
  color: #fff;
  padding: 9px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.apply-btn:hover {
  opacity: 0.9;
}

/* ======================================================
   RESPONSIVE
====================================================== */
@media (max-width: 768px) {
  .custom-table {
    font-size: 13px;
  }

  .filters-row select,
  .filters-row input {
    min-width: 100%;
  }

  .report-header-row {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
