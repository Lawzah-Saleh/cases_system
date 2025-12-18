<template>
  <div class="table-container">
    <div class="header-row">
      <div class="header-title-container">
        <h2 class="main-header">Support Cases</h2>
        <p class="sub-header">Detailed overview and management of all system cases.</p>

      </div>
        <button v-if="can('cases.create')" class="add-button" @click="openCreate = true">
          + Create Support
        </button>
      </div>
    <SupportFilters 
        :clients="clients" 
        :priorities="priorities" 
        :employees="employees"
        @applyFilters="handleFilters"
    />
    <div class="case-tabs">
      <button v-if="can('cases.view_all')" :class="['case-tab', activeTab === 'all' ? 'active' : '']"  @click="changeTab('all')">
        All Cases
      </button>
      <button v-if="can('cases.view_assigned')" :class="['case-tab', activeTab === 'mine' ? 'active' : '']" @click="changeTab('mine')" >
        My Cases
      </button>
      <button v-if="can('cases.view_unassigned')" :class="['case-tab', activeTab === 'unassigned' ? 'active' : '']" @click="changeTab('unassigned')">
        Unassigned
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
           <th v-if="isVisible('action')">Action</th>
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
          <td v-if="isVisible('id')">{{ (currentPage - 1) * 10 + (index + 1) }}</td>
          <td v-if="isVisible('title')" class="title-cell clickable-title" @click="openDetails(c)">{{ c.title }}</td>
          <td v-if="isVisible('type')"><span class="badge badge-soft">{{ c.type }}</span></td>
          <td v-if="isVisible('way_entry')">{{ c.way_entry }}</td>
          <td v-if="isVisible('status')"><span class="badge" :class="statusBadgeClass(c.status)">{{ c.status }}</span></td>
          <td v-if="isVisible('priority')" @click="setSort('priority')" class="sortable">
            <span class="badge" :class="priorityBadgeClass(c.priority?.priority_name ?? '')">
              {{ c.priority?.priority_name ?? '—' }}
            </span>
          </td>
          <td v-if="isVisible('client')">{{ c.client?.client_name ?? '—' }}</td>
          <td v-if="isVisible('employees')">
            <div v-if="c.employees && c.employees.length">
              <div v-for="e in c.employees" :key="e.id" class="employee-line">
                • {{ e.first_name }} {{ e.last_name }}
              </div>
            </div>
            <div v-else>
              <span>—</span>
            </div>
          </td>
          <td v-if="isVisible('action')">
            <button v-if="c.status === 'opened' && can('cases.assign')" class="workflow-btn" @click="openAssignModal(c)">Assign</button>
            <button v-if="c.allowed?.accept" class="workflow-btn" @click="acceptCase(c)">Accept</button>
            <button v-if="c.allowed?.close" class="workflow-btn"  @click="closeCase(c)">Close</button>
            <button v-if="c.allowed?.reassign" class="workflow-btn" @click="openReassignModal(c)">Reassign</button>
          </td>
          <td class="action-cell">
            <div class="menu-trigger" @click.stop="toggleMenu(c.id)">⋮</div>
            <div v-if="openMenu === c.id" class="menu-dropdown">
              <div v-if="can('cases.edit')" class="menu-item" @click="openEditModal(c)">Edit</div>
              <div v-if="can('cases.delete')" class="menu-item delete" @click="openDeleteModal(c)">Delete</div>
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
      <p class="results-count">
        Showing {{ cases.length }} of {{ total }} cases
      </p>
      <div>
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1 || isLoading" class="page-btn">
          &lt; Prev
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage || isLoading" class="page-btn">
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
  <CaseAssignModal
    v-if="showAssign"
    :caseData="selectedCase"
    :mode="'assign'"
    @close="closeAssignModal"
    @assigned="handleAssigned"
  />
  <CaseAssignModal
    v-if="showReassign"
    :caseData="selectedCase"
    :mode="'reassign'"
    @close="closeReassignModal"
    @reassigned="handleReassigned"
  />
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onBeforeUnmount } from 'vue'
const auth = useAuthStore()

const can = (permission) => {
  return auth.permissions?.includes(permission)
}

import SupportFilters from '@/components/cases/SupportFilters.vue'
import CaseDetailsModal from '@/components/cases/CaseDetailsModal.vue'
import CaseCreateModal from '@/components/cases/CaseCreateModal.vue'
import CaseEditModal from '@/components/cases/CaseEditModal.vue'
import CaseDeleteModal from '@/components/cases/CaseDeleteModal.vue'
import CaseAssignModal from '@/components/cases/CaseAssignModal.vue'


const showAssign = ref(false)
const activeTab = ref('all')
function changeTab(tab) {
  activeTab.value = tab
  
  filterParams.value.tab = tab
  
  fetchCases(1)
}
const showReassign = ref(false);
function openReassignModal(item) {
  selectedCase.value = item;
  showReassign.value = true;
}
function closeReassignModal() {
  showReassign.value = false;
}

function openAssignModal(item) {
  selectedCase.value = item
  showAssign.value = true
}

function closeAssignModal() {
  showAssign.value = false
}

function refreshAfterAssign() {
  fetchCases(currentPage.value)
}

function handleReassigned(updatedCase) {
  if (!updatedCase) {
    console.error("No updated case received");
    return;
  }

  updateCaseInTable(updatedCase);
}

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
const employees = ref([])


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

async function openDetails(c) {
  try {
    const token = useAuthStore().token;

    // Request fresh and full case data
    const res = await axios.get(
      `http://localhost:8000/api/cases/${c.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    selectedCase.value = res.data.case;
    openDetailsModal.value = true;
  } catch (e) {
    console.error("Failed to load case details:", e);
  }
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
  { key: 'employees', label: 'Employees', visible: true },
  { key: 'action', label: 'Action', visible: true }

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
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
        tab: activeTab.value,
        ...filterParams.value
      }
    })

    cases.value = res.data.data

    lastPage.value = res.data.last_page
    total.value = res.data.total

    return true
  } catch (e) {
    console.error(e)
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
  loadFilterData()
  fetchCases()
  document.addEventListener('click', closeAllMenus)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAllMenus)
})

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
function handleAssigned() {
  fetchCases(currentPage.value)
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

function setSort(column) {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDirection.value = 'asc'
  }

  fetchCases(1)
}
const authHeader = {
  headers: {
    Authorization: `Bearer ${auth.token}`
  }
}
function updateCaseInTable(updatedCase) {
  const i = cases.value.findIndex(x => x.id === updatedCase.id)
  if (i !== -1) {
    cases.value[i] = { ...updatedCase }
  }
}

async function assignToMe(c) {
  await axios.post(`/api/cases/${c.id}/assign-to-me`, {}, authHeader)
  fetchCases()
}
async function acceptCase(c) {
  const res = await axios.post(
    `http://localhost:8000/api/cases/${c.id}/accept`,
    {},
    authHeader
  )

  // Instant update in table
  updateCaseInTable(res.data.case)

}

async function closeCase(c) {
  const res = await axios.post(
    `http://localhost:8000/api/cases/${c.id}/close`,
    {},
    authHeader
  )

  updateCaseInTable(res.data.case)

}

async function removeEmployee(c, employeeId) {
  await axios.post(`/api/cases/${c.id}/remove-employee`, { employee_id: employeeId }, authHeader)
  fetchCases()
}

</script>

<style scoped>
/* ACTION MENU */
.action-cell {
  position: relative;
}

.menu-trigger {
  cursor: pointer;
  font-size: 22px;
  padding: 5px;
  color: var(--text-muted);

}
.menu-trigger:hover {
  color: var(--text-main);
}

.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 0;
  background: white;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  width: 140px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.menu-item {
  padding: 10px;
  font-size: var(--fs-section);
  cursor: pointer;
}
.menu-item:hover {
  background: var(--bg-soft);
}
.menu-item.delete {
  color: red;
}

.menu-item:hover {
  background: #f4f4f4;
}

.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  text-decoration: underline;
}
.assign-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: 0.2s;
}

.assign-btn:hover {
  background: var(--primary-hover);
}
.case-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}

.case-tab {
  padding: 9px 20px;
  font-size: 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fafafa;
  cursor: pointer;
  font-weight: 600;
}

.case-tab.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);

  border-color: var(--primary-color);
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>