<template>
  <div class="table-container">

    <div class="header-row">
      <div class="header-title-container">
          <h2 class="main-header">Cases Report</h2>
      </div>
    </div>

    <ReportFilters :clients="clients" :priorities="priorities"   :employees="employees"
 @applyFilters="handleFilters"/>

    <!-- ===================== SHOW / HIDE COLUMNS BUTTON ===================== -->
    <!-- <button class="filter-button" @click="showFilter = true">Show / Hide Columns</button> -->
    <div class="report-header-row">
  <!-- Left side: Show / Hide Columns text -->
  <button class="show-hide-btn" @click="showFilter = true">
    Show/Hide Columns ({{ visibleCount }}/{{ columns.length }})
  </button>

  <!-- Right side: Export -->
  <button class="download-btn" @click="exportCSV">
    DOWNLOAD EXCEL
  </button>
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
          <th v-if="isVisible('created')"> Created at</th>

        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading" v-for="n in 5" :key="n">
          <td colspan="10"><div class="skeleton-bar"></div></td>
        </tr>

        <tr v-else v-for="(item, index) in cases" :key="item.id" class="table-row-hover">
          <td v-if="isVisible('id')">{{ item.id }}</td>
          <td v-if="isVisible('title')">{{ item.title }}</td>
          <td v-if="isVisible('type')">{{ item.type }}</td>
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
  { key: 'created', label: 'Created At', visible: true },

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

onMounted(() => {
  loadFilterData()
  loadReport()
})


const clients = ref([])
const priorities = ref([])
const employees = ref([])


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
  employees.value = (await axios.get('http://localhost:8000/api/employees', {
  headers: { Authorization: `Bearer ${token}` }
})).data.data

}
</script>


<style scoped>
/* CONTAINER */
.table-container {
  background: #fff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 4px 22px rgba(0,0,0,0.06);
  border: 1px solid #eee;
  margin-bottom: 30px;
}

/* HEADER */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 20px;
}

.main-header {
  font-size: 26px;
  font-weight: 700;
  color: #2d2d2d;
}

/* ACTION ROW (Export / Filters Button) */
.export-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

/* BUTTONS */
.add-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: 0.2s ease;
}
.add-button:hover {
  opacity: 0.85;
}

.filter-button {
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  text-decoration: underline;
}
.filter-button:hover {
  opacity: 0.7;
}

/* TABLE */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table-header-row th {
  background: #fafafa;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 700;
  color: #444;
  border-bottom: 2px solid #e6e6e6;
}

.custom-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #2d2d2d;
}

.table-row-hover:hover {
  background: #f9f9f9;
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

/* PAGINATION */
.pagination-container {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.results-count {
  font-size: 14px;
  color: #666;
}

.page-btn {
  padding: 7px 22px;
  border: 1px solid #d0d0d0;
  border-radius: 7px;
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

/* MODAL - SHOW/HIDE COLUMNS */
.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.filter-modal {
  width: 650px;
  max-width: 90%;
  background: #fff;
  padding: 35px 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.filter-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.select-all-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
}

.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 40px;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.filter-footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.apply-btn, .cancel-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: #e7e7e7;
  color: #333;
}
.cancel-btn:hover {
  background: #dcdcdc;
}

.apply-btn {
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
}
.apply-btn:hover {
  opacity: 0.85;
}

/* SKELETON LOADING */
.skeleton-bar {
  height: 14px;
  background: #ececec;
  border-radius: 6px;
  animation: pulse 1.4s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: .5; }
  50% { opacity: .1; }
  100% { opacity: .5; }
}
.report-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f7; /* light gray analytics style */
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.show-hide-btn {
  background: transparent;
  border: none;
  color: #2d2d5f;
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.show-hide-btn:hover {
  opacity: 0.8;
}

.download-btn {
  background: var(--primary-color);
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.download-btn:hover {
  background: var(--primary-hover);
}

</style>
