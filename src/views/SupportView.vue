<template>
  <div class="table-container">
    <!-- ===================== HEADER ===================== -->
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Support Cases</h2>
        <p class="sub-header">Detailed overview and management of all customer support cases.</p>
      </div>

      <button class="add-button" @click="openCreate = true">+ Create Support</button>
    </div>

    <!-- ===================== FILTERS (ADVANCED) ===================== -->
<SupportFilters 
    :clients="clients" 
    :priorities="priorities" 
    @applyFilters="handleFilters"
/>

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
        <!-- ===== SKELETON ROWS ===== -->
        <tr v-if="isLoading" v-for="n in 5" :key="n" class="skeleton-row">
          <td colspan="10">
            <div class="skeleton-bar"></div>
          </td>
        </tr>

        <!-- ===== DATA ROWS ===== -->
        <tr v-else v-for="(c, index) in cases" :key="c.id" class="table-row-hover">
          <td v-if="isVisible('id')">
          {{ (currentPage - 1) * 10 + (index + 1) }}
          </td>
          <td v-if="isVisible('title')" class="title-cell clickable-title" @click="openDetails(c)">
            {{ c.title }}
          </td>
          <td v-if="isVisible('type')">
            <span class="badge badge-soft">
              {{ c.type }}
            </span>
          </td>

          <td v-if="isVisible('way_entry')">
            {{ c.way_entry }}
          </td>

          <td v-if="isVisible('status')">
            <span class="badge" :class="statusBadgeClass(c.status)">
              {{ c.status }}
            </span>
          </td>

          <td v-if="isVisible('priority')" @click="setSort('priority')" class="sortable">
            <span class="badge" :class="priorityBadgeClass(c.priority?.priority_name ?? '')">
              {{ c.priority?.priority_name ?? '—' }}
            </span>
          </td>


          <td v-if="isVisible('client')">
            {{ c.client?.client_name ?? '—' }}
          </td>

          <td v-if="isVisible('employees')">
            <div v-for="e in c.employees" :key="e.id" class="employee-line">
              • {{ e.first_name }} {{ e.last_name }}
            </div>
            <span v-if="!c.employees || !c.employees.length">—</span>
          </td>
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(c.id)">⋮</div>

            <div v-if="openMenu === c.id" class="menu-dropdown">
              <div class="menu-item" @click="openEditModal(c)">Edit</div>
              <div class="menu-item delete" @click="openDeleteModal(c)">Delete</div>
            </div>
          </td>
        </tr>

        <tr v-if="!isLoading && cases.length === 0">
          <td colspan="10" style="text-align: center; padding: 20px; color: #777">
            No cases found.
          </td>
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
  <CaseDetailsModal
    v-if="openDetailsModal"
    :caseData="selectedCase"
    @close="closeDetails"
    @edit="openEditModal"   
  />
  <CaseCreateModal
    v-if="openCreate"
    @close="openCreate = false"
    @created="fetchCases(currentPage)"
  />
<CaseEditModal
  v-if="showEdit"
  :caseData="selectedCase"
  @close="closeEditModal"
  @updated="handleRefresh"
/>

<CaseDeleteModal
  v-if="showDelete"
  :caseData="selectedCase"
  @close="showDelete = false"
  @deleted="handleDelete"
/>

</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onBeforeUnmount } from 'vue'

import SupportFilters from '@/components/cases/SupportFilters.vue'
import CaseDetailsModal from '@/components/cases/CaseDetailsModal.vue'
import CaseCreateModal from '@/components/cases/CaseCreateModal.vue'
import CaseEditModal from '@/components/cases/CaseEditModal.vue'
import CaseDeleteModal from '@/components/cases/CaseDeleteModal.vue'

const openCreate = ref(false)
const sortBy = ref(null)
const sortDirection = ref('asc')
const cases = ref([])
const isLoading = ref(false)

const showDelete = ref(false)


function openDeleteModal(item) {
  closeAllMenus()
  selectedCase.value = item
  showDelete.value = true
}

function handleDelete(id) {
  cases.value = cases.value.filter(c => c.id !== id)
  showDelete.value = false
}


const openDetailsModal = ref(false)
const selectedCase = ref(null)

const clients = ref([])
const priorities = ref([])

async function loadFilterData() {
  const token = useAuthStore().token

  clients.value = (await axios.get('http://localhost:8000/api/clients', {
    headers: { Authorization: `Bearer ${token}` }
  })).data.data

  priorities.value = (await axios.get('http://localhost:8000/api/priorities', {
    headers: { Authorization: `Bearer ${token}` }
  })).data
}

onMounted(() => {
  loadFilterData()
  fetchCases()
})




function openDetails(c) {
  selectedCase.value = c
  openDetailsModal.value = true
}
const showDetails = ref(false)
const showEdit = ref(false)

function openEditModal(item) {
  closeAllMenus()
  selectedCase.value = item
  openDetailsModal.value = false
  showEdit.value = true
}

function closeDetails() {
  openDetailsModal.value = false
}

function closeEditModal() {
  showEdit.value = false
}

const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const filterParams = ref({})

// ====== SHOW / HIDE COLUMNS STATE ======
const showFilter = ref(false)
const columns = ref([
  { key: 'id', label: 'ID', visible: true },
  { key: 'title', label: 'Title', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'way_entry', label: 'Way Entry', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'priority', label: 'Priority', visible: true },
  { key: 'client', label: 'Client', visible: true },
  { key: 'employees', label: 'Employees', visible: true }
])

// ====== HANDLERS ======
function handleFilters(f) {
  filterParams.value = { ...f }
  fetchCases(1)
}
function handleRefresh() {
  cases.value = [];
  fetchCases(currentPage.value).then(() => {
    selectedCase.value = null;
  });
}

async function fetchCases(page = 1) {
  try {
    isLoading.value = true
    currentPage.value = page

    const token = useAuthStore().token

    const res = await axios.get('http://localhost:8000/api/cases', {
      headers: {
        Authorization: `Bearer ${token}`
      },
params: {
  page,
  sort_by: sortBy.value,
  sort_direction: sortDirection.value,
  ...filterParams.value
}

    })

    cases.value = res.data.data
    lastPage.value = res.data.last_page
    total.value = res.data.total
  } catch (e) {
    console.error('Error fetching cases:', e)
  } finally {
    isLoading.value = false
  }
}

function changePage(p) {
  if (p < 1 || p > lastPage.value) return
  fetchCases(p)
}

// ====== COLUMNS LOGIC ======
function isVisible(key) {
  const col = columns.value.find((c) => c.key === key)
  return col ? col.visible : false
}

function selectAllColumns() {
  columns.value.forEach((c) => (c.visible = true))
}

function closeFilter() {
  showFilter.value = false
}

function applyColumnFilters() {
  showFilter.value = false
}
/* ========== ACTION MENU STATE ========== */
const openMenu = ref(null)

function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}

function closeAllMenus() {
  openMenu.value = null
}

onMounted(() => {
  document.addEventListener('click', closeAllMenus)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAllMenus)
})

/* ========== ACTION FUNCTIONS ========== */



/* ========== FETCH DATA ========== */

// ====== BADGE STYLES ======
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


// ====== INIT ======
fetchCases()


function setSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }

  fetchCases(1)
}

</script>

<style scoped>
/* CONTAINER */
.table-container {
  background: #ffffff;
  padding: 24px 26px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
}

/* HEADER */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.main-header {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.sub-header {
  font-size: 13px;
  color: #777;
}

.add-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

/* SHOW/HIDE COLUMNS BUTTON */
.filter-button {
  padding: 6px 0;
  cursor: pointer;
  color: var(--primary-color);
  border: none;
  background: transparent;
  text-decoration: underline;
  font-size: 15px;
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
  font-size: 15px;
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
  font-size: 14px;
  cursor: pointer;
}

.apply-btn {
  background: var(--primary-color);
  color: white;
  padding: 10px 26px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

/* TABLE */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-row th {
  background: var(--table-header-bg);
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  border-bottom: 1px solid var(--table-border);
}

.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--table-border);
  vertical-align: top;
  font-size: 14px;
}

.table-row-hover:hover td {
  background: #fafafa;
}

.title-cell {
  font-weight: 600;
  color: #333;
}

.desc-cell {
  color: #555;
}

/* EMPLOYEES LIST */
.employee-line {
  margin-bottom: 3px;
  font-size: 13px;
}

/* BADGES */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-soft {
  background: #eef1ff;
  color: #4b32c3;
}

.badge-status-open {
  background: #fff4e5;
  color: #b45b00;
}

.badge-status-assigned {
  background: #e7f5ff;
  color: #0b6fb8;
}

.badge-status-inprogress {
  background: #fff3cd;
  color: #896100;
}

.badge-status-reassigned {
  background: #e0e7ff;
  color: #3b3bb3;
}

.badge-status-closed {
  background: #e6ffed;
  color: #1e7a3b;
}

.badge-priority-high {
  background: #ffe5e5;
  color: #b3261e;
}

.badge-priority-middle {
  background: #fff4e5;
  color: #b45b00;
}

.badge-priority-low {
  background: #e5f6ff;
  color: #006395;
}

.badge-priority-normal {
  background: #edf2ff;
  color: #364fc7;
}

/* PAGINATION */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}

.results-count {
  font-size: 13px;
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

/* SKELETON */
.skeleton-bar {
  width: 100%;
  height: 18px;
  background: linear-gradient(90deg, #eee, #ddd, #eee);
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
/* ACTION MENU */
.action-cell {
  position: relative;
}

.menu-trigger {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
}

.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
}

.menu-item.delete {
  color: red;
}

.menu-item:hover {
  background: #f4f4f4;
}
.clickable-title {
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 600;
}
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  text-decoration: underline;
}

</style>