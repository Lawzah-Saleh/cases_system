<template>
  <div class="table-container">

    <!-- ===================== HEADER ===================== -->
    <div class="header-row">
    <div class="header-title-container">
        <h2 class="main-header">Cases Report</h2>
        <p class="sub-header">Overview and analytics for all support cases.</p>
    </div>
    </div>


  
    <!-- ===================== FILTERS ===================== -->
    <ReportFilters @applyFilters="applyFilters" />
    <div class="export-row">
  <button class="add-button" @click="exportCSV">
    Export CSV
  </button>
</div>


    <!-- ===================== SHOW/HIDE COLUMNS ===================== -->
    <button class="filter-button" @click="showFilter = true">
      Show / Hide Columns
    </button>

    <div v-if="showFilter" class="filter-overlay" @click.self="closeFilter">
      <div class="filter-modal">
        <div class="filter-header">
          <h2>Columns</h2>
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
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th v-if="isVisible('id')">ID</th>
          <th v-if="isVisible('title')" @click="setSort('title')" class="sortable">
            Title
          </th>
          <th v-if="isVisible('status')">Status</th>
          <th v-if="isVisible('priority')">Priority</th>
          <th v-if="isVisible('client')">Client</th>
          <th v-if="isVisible('employees')">Employees</th>
          <th v-if="isVisible('created')">Created At</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading" v-for="n in 5" :key="n">
          <td colspan="10"><div class="skeleton-bar"></div></td>
        </tr>

        <tr v-else v-for="(item, index) in cases" :key="item.id" class="table-row-hover">
          <td v-if="isVisible('id')">{{ item.id }}</td>
          <td v-if="isVisible('title')">{{ item.title }}</td>
          <td v-if="isVisible('status')">{{ item.status }}</td>
          <td v-if="isVisible('priority')">{{ item.priority?.priority_name ?? '—' }}</td>
          <td v-if="isVisible('client')">{{ item.client?.client_name ?? '—' }}</td>
          <td v-if="isVisible('employees')">
            <div v-for="e in item.employees" :key="e.id">
              • {{ e.first_name }} {{ e.last_name }}
            </div>
          </td>
          <td v-if="isVisible('created')">{{ formatDate(item.created_at) }}</td>
        </tr>

        <tr v-if="!isLoading && cases.length === 0">
          <td colspan="10" class="empty-msg">No results found.</td>
        </tr>
      </tbody>
    </table>

    <!-- ===== PAGINATION ===== -->
    <div class="pagination-container">
      <p>{{ total }} results</p>
      <div>
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          Prev
        </button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage">
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import ReportFilters from '@/components/reports/ReportFilters.vue'

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
  { key: 'status', label: 'Status', visible: true },
  { key: 'priority', label: 'Priority', visible: true },
  { key: 'client', label: 'Client', visible: true },
  { key: 'employees', label: 'Employees', visible: true },
  { key: 'created', label: 'Created At', visible: true }
])

const isVisible = (key) => columns.value.find(c => c.key === key)?.visible ?? false
const selectAllColumns = () => columns.value.forEach(c => (c.visible = true))
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

function applyFilters(filters) {
  filterParams.value = filters
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
function exportCSV() {
  window.open('http://localhost:8000/api/reports/cases/export', '_blank')
}

onMounted(() => loadReport())
</script>


<style scoped>
/* IDENTICAL styling from SupportView (clean + consistent) */
.table-container {
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
}
.header-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.main-header {
  font-size: 22px;
  font-weight: 700;
}
.sub-header {
  font-size: 13px;
  color: #777;
}
.add-button {
  padding: 10px 20px;
  border-radius: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}
.stats-container {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.stat-box {
  background: #f7f7f7;
  padding: 16px;
  border-radius: 12px;
  flex: 1;
  text-align: center;
}
.stat-box h4 {
  margin: 0;
  font-size: 14px;
  color: #666;
}
.stat-box p {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}
.filter-button {
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 15px;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
}
.custom-table th,
.custom-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}
.empty-msg {
  text-align: center;
  padding: 20px;
  color: #666;
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.skeleton-bar {
  height: 14px;
  background: #eee;
}
.export-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

</style>
