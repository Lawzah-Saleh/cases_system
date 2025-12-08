<template>
  <div class="table-container">

    <div class="header-row">
      <div class="header-title-container">
          <h2 class="main-header">Cases Report</h2>
      </div>
    </div>

    <ReportFilters :clients="clients" :priorities="priorities"  @applyFilters="handleFilters"/>
    <div class="export-row">
      <button class="add-button" @click="exportCSV">
        Export CSV
      </button>
    </div>
    <!-- ===================== SHOW / HIDE COLUMNS BUTTON ===================== -->
    <button class="filter-button" @click="showFilter = true">Show / Hide Columns</button>

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
            Status <span>{{ sortBy === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}</span>
          </th>
          <th v-if="isVisible('priority')" @click="setSort('priority')" class="sortable">
            Priority <span>{{ sortBy === 'priority' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}</span>
          </th>
          <th v-if="isVisible('client')">Customer</th>
          <th v-if="isVisible('employees')">Team Members</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading" v-for="n in 5" :key="n">
          <td colspan="10"><div class="skeleton-bar"></div></td>
        </tr>

        <tr v-else v-for="(item, index) in cases" :key="item.id" class="table-row-hover">
          <td v-if="isVisible('id')">{{ item.id }}</td>
          <td v-if="isVisible('title')">{{ item.title }}</td>
          <td v-if="isVisible('status')">{{ item.type }}</td>
          <td v-if="isVisible('way_entry')">{{ item.way_entry }}</td>
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
    <div class="pagination-container mt-4">
      <p class="results-count">{{ cases.length }} results</p>

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
function exportCSV() {
  window.open('http://localhost:8000/api/reports/cases/export', '_blank')
}

onMounted(() => loadReport())

const clients = ref([])
const priorities = ref([])

// import { shallowRef } from 'vue'
// const clients = shallowRef([])
// const priorities = shallowRef([])

async function loadFilterData() {
  const token = useAuthStore().token

  clients.value = (await axios.get('http://localhost:8000/api/clients', {
    headers: { Authorization: `Bearer ${token}` }
  })).data.data

  priorities.value = (await axios.get('http://localhost:8000/api/priorities', {
    headers: { Authorization: `Bearer ${token}` }
  })).data
}
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
  font-size: 16px;
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
/* SHOW/HIDE COLUMNS BUTTON */
.filter-button {
  padding: 6px 0;
  cursor: pointer;
  color: var(--primary-color);
  border: none;
  background: transparent;
  text-decoration: underline;
  font-size: 20px;
  margin-bottom: 15px;
}

/* MODAL */
.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.filter-modal {
  width: 750px;
  max-width: 95%;
  background: white;
  border-radius: 16px;
  padding: 32px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.select-all-btn {
  font-size: 16px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 18px;
  column-gap: 40px;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.filter-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  background: #e5e5e5;
  padding: 10px 26px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.apply-btn {
  background: var(--primary-color);
  color: white;
  padding: 10px 26px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
/* PAGINATION */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}

.results-count {
  font-size: 16px;
  color: #666;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border: 1px solid gray;
  background: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
}
.table-header-row th {
  background: var(--table-header-bg);
  padding: 12px 16px;
  font-size: 20px;
  text-align: left;
  border-bottom: 1px solid var(--table-border);
}

.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--table-border);
  vertical-align: top;
  font-size: 18px;
}
.add-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}
</style>
