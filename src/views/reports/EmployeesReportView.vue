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

      <!-- Range -->
      <select v-model="filters.range">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>

      <!-- Employee Search -->
      <input
        v-model="filters.employee"
        placeholder="Search employee..."
      />

      <!-- SLA -->
      <select v-model="filters.sla">
        <option value="">All SLA</option>
        <option value="met">SLA Met</option>
        <option value="breached">SLA Breached</option>
      </select>

      <button class="reset-btn" @click="resetFilters">Reset</button>
    </div>

    <!-- ================= ACTION BAR ================= -->
    <div class="report-header-row">
      <button class="download-btn" @click="exportExcel" :disabled="loading">
        DOWNLOAD EXCEL
      </button>
    </div>

    <!-- ================= TABLE ================= -->
    <EmployeePerformanceTable
      v-if="!loading && employees.length"
      :employees="employees"
    />

    <!-- ================= STATES ================= -->
    <div v-if="loading" class="loading-indicator">
      Loading data...
    </div>

    <div v-if="!loading && employees.length === 0" class="no-data">
      No results found.
    </div>

    <!-- ================= PAGINATION ================= -->
    <div class="pagination-container" v-if="lastPage > 1">
      <p class="results-count">{{ total }} results</p>

      <div>
        <button
          class="page-btn"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1 || loading"
        >
          &lt; Prev
        </button>

        <button
          class="page-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === lastPage || loading"
        >
          Next &gt;
        </button>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import EmployeePerformanceTable from '@/components/reports/EmployeePerformanceTable.vue'

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

/* ================= LOAD REPORT ================= */
async function loadReport(page = 1) {
  try {
    loading.value = true
    currentPage.value = page

    const res = await axios.get(
      'http://localhost:8000/api/reports/employees',
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: {
          page,
          ...filters
        }
      }
    )

    employees.value = res.data?.data ?? []
    total.value = res.data?.total ?? employees.value.length
    lastPage.value = res.data?.last_page ?? 1

  } catch (err) {
    console.error('Employee report error:', err)
    employees.value = []
  } finally {
    loading.value = false
  }
}

/* ================= AUTO SEARCH (DEBOUNCE) ================= */
let debounceTimer = null
watch(
  () => ({ ...filters }),
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      loadReport(1)
    }, 350)
  },
  { deep: true }
)

/* ================= PAGINATION ================= */
function changePage(page) {
  if (page < 1 || page > lastPage.value) return
  loadReport(page)
}

/* ================= RESET ================= */
function resetFilters() {
  filters.range = 'month'
  filters.employee = ''
  filters.sla = ''
  loadReport(1)
}

/* ================= EXPORT ================= */
async function exportExcel() {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/reports/employees/export',
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: filters,
        responseType: 'blob'
      }
    )

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'employees-report.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()

  } catch (e) {
    console.error('Export failed', e)
  }
}

onMounted(() => {
  loadReport()
})
</script>
<style scoped>
.table-container {
  background: #fff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
}

.header-row {
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 16px;
}

.main-header {
  font-size: 26px;
  font-weight: 700;
}

.filters-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  background: #f3f3f7;
  padding: 12px 14px;
  border-radius: 10px;
  margin: 18px 0;
}

.filters-row select,
.filters-row input {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-width: 180px;
}

.reset-btn {
  background: transparent;
  border: none;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.report-header-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.download-btn {
  background: var(--primary-color);
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
}

.loading-indicator,
.no-data {
  text-align: center;
  margin-top: 30px;
  font-size: 17px;
}

.pagination-container {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-btn {
  padding: 7px 22px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background: #fff;
}
</style>
