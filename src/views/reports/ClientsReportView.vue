<template>
  <div class="table-container">
    <!-- HEADER -->
    <div class="header-row">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">Reports</span> / Clients Report
      </h2>
    </div>

    <div class="filter-row">
      <input
        class="search-input"
        v-model="search"
        @input="onSearch"
        placeholder="Search employee..."
      />
    </div>
    <!-- FILTER BAR -->
    <div class="report-header-row">
      <button class="show-hide-btn" @click="showFilter = true">
        Show/Hide Columns ({{ visibleCount }}/{{ columns.length }})
      </button>

      <button class="download-btn" @click="exportExcel">DOWNLOAD EXCEL</button>
    </div>

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

    <!-- TABLE -->
    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th v-if="isVisible('client_name')">Client</th>
          <th v-if="isVisible('email')">Email</th>
          <th v-if="isVisible('address')">Address</th>
          <th v-if="isVisible('total_cases')">Total Cases</th>
          <th v-if="isVisible('employees')">Employees</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading" v-for="n in 5" :key="n">
          <td colspan="14"><div class="skeleton-bar"></div></td>
        </tr>

        <tr v-else v-for="row in rows" :key="row.client_id" class="table-row-hover">
          <td v-if="isVisible('client_name')">{{ row.client_name }}</td>
          <td v-if="isVisible('email')">{{ row.email }}</td>
          <td v-if="isVisible('address')">{{ row.address }}</td>
          <td v-if="isVisible('total_cases')">{{ row.total_cases }}</td>
          <td v-if="isVisible('employees')">{{ row.employees_count }}</td>
        </tr>

        <tr v-if="!loading && rows.length === 0">
          <td colspan="14" class="empty-msg">No results found.</td>
        </tr>
      </tbody>
    </table>

    <!-- PAGINATION -->
    <div class="pagination-container">
      <p class="results-count">Page {{ currentPage }} of {{ lastPage }}</p>

      <div>
        <button
          class="page-btn"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1 || loading"
        >
          ‹ Prev
        </button>

        <button
          class="page-btn"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === lastPage || loading"
        >
          Next ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
const auth = useAuthStore()

const rows = ref([])
const loading = ref(false)

const search = ref('')
const currentPage = ref(1)
const lastPage = ref(1)
const showFilter = ref(false)

const columns = ref([
  { key: 'client_name', label: 'Client', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'address', label: 'Address', visible: true },
  { key: 'total_cases', label: 'Total Cases', visible: true },
  { key: 'employees', label: 'Employees', visible: true }
])

const isVisible = (key) => columns.value.find((c) => c.key === key)?.visible ?? false

const visibleCount = computed(() => columns.value.filter((c) => c.visible).length)

const selectAllColumns = () => columns.value.forEach((c) => (c.visible = true))

const closeFilter = () => (showFilter.value = false)
const applyColumnFilters = () => (showFilter.value = false)

const clients = ref([])
const priorities = ref([])
const employees = ref([])

/* ================= LOAD REPORT ================= */
async function loadReport(page = 1) {
  try {
    loading.value = true
    currentPage.value = page

    const res = await axios.get('http://127.0.0.1:8000/api/report/clients', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      params: {
        page,
        search: search.value
      }
    })

    rows.value = res.data?.data ?? []
    lastPage.value = res.data?.last_page ?? 1
  } finally {
    loading.value = false
  }
}
let searchTimeout = null

function onSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadReport(1)
  }, 300)
}

function changePage(page) {
  if (page < 1 || page > lastPage.value) return
  loadReport(page)
}

/* ================= EXPORT ================= */
async function exportExcel() {
  const visibleColumns = columns.value.filter((c) => c.visible).map((c) => c.key)

  const response = await axios.get('http://127.0.0.1:8000/api/report/clients/export', {
    headers: { Authorization: `Bearer ${auth.token}` },
    params: {
      search: search.value,
      columns: visibleColumns
    },
    responseType: 'blob'
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'clients-report.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

onMounted(() => {
  loadReport()
})
</script>

<style scoped>
.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  background: #f3f3f7;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 18px;
}
/* reuse SAME style language as cases report */
.search-input {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  background: #fff;
  width: 200px;
}


.report-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f7;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.search-input {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 320px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-row th {
  background: #fafafa;
  padding: 14px;
  font-weight: 700;
}

.custom-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
}

.table-row-hover:hover {
  background: #f9f9f9;
}

.empty-msg {
  text-align: center;
  padding: 25px;
  color: #999;
}

.pagination-container {
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
}

.page-btn {
  padding: 7px 22px;
  border-radius: 7px;
  border: 1px solid #d0d0d0;
  background: #fff;
}

.skeleton-bar {
  height: 14px;
  background: #ececec;
  border-radius: 6px;
  animation: pulse 1.4s infinite ease-in-out;
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
