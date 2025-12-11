<template>
  <div class="client-report-page">
    <!-- HEADER -->
    <div class="header-row">
      <!-- LEFT: TITLE -->
      <div class="title-container">
        <h2 class="page-title">
          <span class="link-back" @click="$router.back()">Reports</span> / Client Reports
        </h2>
      </div>

      <!-- RIGHT: ACTIONS (button + filter) -->
      <div class="actions-container">
        <button class="btn btn-success" @click="downloadExcel">Download Excel</button>

        <div class="client-selector">
          <label for="clientSelect">Client:</label>
          <select id="clientSelect" v-model="selectedClientId" @change="onClientChange">
            <option v-for="c in clients" :key="c.id" :value="c.id">
              {{ c.client_name }} ({{ c.cases_count }} cases)
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- LOADING / ERROR -->
    <div v-if="isLoading" class="center-msg">Loading report...</div>
    <div v-else-if="!selectedClientId" class="center-msg">No client selected.</div>

    <!-- CONTENT -->
    <div v-else class="content-grid">
      <!-- LEFT COLUMN -->
      <div class="left-column">
        <!-- Client Card -->
        <div class="card">
          <h3>Client Info</h3>
          <p class="client-name">{{ client.client_name }}</p>
          <p v-if="client.email">Email: {{ client.email }}</p>
          <p v-if="client.address">Address: {{ client.address }}</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">Total Cases</p>
            <p class="stat-value">{{ stats.total_cases }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Opened</p>
            <p class="stat-value">{{ stats.status.opened }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">In Progress</p>
            <p class="stat-value">{{ stats.status.inprogress }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">assigned</p>
            <p class="stat-value">{{ stats.status.assigned }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">re-assigned</p>
            <p class="stat-value">{{ stats.status.reassigned }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Closed</p>
            <p class="stat-value">{{ stats.status.closed }}</p>
          </div>
        </div>

        <!-- Team -->
        <div class="card">
          <h3>Team Involved</h3>
          <p v-if="team.length === 0" class="muted">No employees assigned yet.</p>
          <ul v-else class="team-list">
            <li v-for="e in team" :key="e.id">
              <span class="team-name">{{ e.full_name }}</span>
              <span class="team-meta" v-if="e.job_title"> · {{ e.job_title }}</span>
              <span class="team-meta" v-if="e.email"> · {{ e.email }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-column">
        <!-- Charts Row -->
        <div class="charts-row">
          <div class="card chart-card">
            <h3>Cases by Status</h3>
            <apexchart
              v-if="statusChartSeries.length"
              type="donut"
              height="260"
              :options="statusChartOptions"
              :series="statusChartSeries"
            />
            <p v-else class="muted">No data.</p>
          </div>

          <div class="card chart-card">
            <h3>Cases by Priority</h3>
            <apexchart
              v-if="priorityChartSeries.length"
              type="donut"
              height="260"
              :options="priorityChartOptions"
              :series="priorityChartSeries"
            />
            <p v-else class="muted">No data.</p>
          </div>
        </div>

        <!-- Latest Cases Table -->
        <div class="card">
          <div class="table-header">
            <h3>Latest Cases ( 10 )</h3>
          </div>

          <table class="cases-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created At</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="latestCases.length === 0">
                <td colspan="6" class="muted center-msg">No cases found for this client.</td>
              </tr>
              <tr v-for="c in latestCases" :key="c.id">
                <td>{{ c.id }}</td>
                <td>{{ c.title }}</td>
                <td>{{ c.status }}</td>
                <td>{{ c.priority || '—' }}</td>
                <td>{{ c.created_at }}</td>
                <td>
                  <div v-if="c.employees.length">
                    <div v-for="(e, idx) in c.employees" :key="idx">• {{ e }}</div>
                  </div>
                  <span v-else>—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()

const clients = ref([])
const selectedClientId = ref(null)

const isLoading = ref(false)

const client = ref({})
const stats = ref({
  total_cases: 0,
  status: {
    opened: 0,
    assigned: 0,
    inprogress: 0,
    reassigned: 0,
    closed: 0
  },
  priority: {}
})
const latestCases = ref([])
const team = ref([])

// Charts
const statusChartOptions = ref({})
const statusChartSeries = ref([])

const priorityChartOptions = ref({})
const priorityChartSeries = ref([])

async function downloadExcel() {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/reports/clients/${selectedClientId.value}/export`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        responseType: 'blob'
      }
    )

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `client-report-${selectedClientId.value}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    console.error(err)
    toast.error('Failed to download Excel')
  }
}

async function loadClients() {
  try {
    isLoading.value = true

    const res = await axios.get('http://localhost:8000/api/reports/clients', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    clients.value = res.data.data || []

    if (clients.value.length > 0) {
      selectedClientId.value = clients.value[0].id
      await loadClientReport(selectedClientId.value)
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to load clients')
  } finally {
    isLoading.value = false
  }
}

async function loadClientReport(clientId) {
  if (!clientId) return

  try {
    isLoading.value = true

    const res = await axios.get(`http://localhost:8000/api/reports/clients/${clientId}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    client.value = res.data.client
    stats.value = res.data.stats
    latestCases.value = res.data.latest_cases || []
    team.value = res.data.team || []

    buildCharts()
  } catch (err) {
    console.error(err)
    toast.error('Failed to load client report')
  } finally {
    isLoading.value = false
  }
}

function onClientChange() {
  loadClientReport(selectedClientId.value)
}

function buildCharts() {
  // Status chart
  const st = stats.value.status || {}
  const statusLabels = []
  const statusValues = []

  for (const [key, value] of Object.entries(st)) {
    statusLabels.push(key)
    statusValues.push(value)
  }

  statusChartOptions.value = {
    labels: statusLabels,
    legend: { position: 'bottom' }
  }
  statusChartSeries.value = statusValues

  // Priority chart
  const pr = stats.value.priority || {}
  const priorityLabels = []
  const priorityValues = []

  for (const [key, value] of Object.entries(pr)) {
    priorityLabels.push(key)
    priorityValues.push(value)
  }

  priorityChartOptions.value = {
    labels: priorityLabels,
    legend: { position: 'bottom' }
  }
  priorityChartSeries.value = priorityValues
}

onMounted(() => {
  loadClients()
})
</script>

<style scoped>
.client-report-page {
  background: #fff;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

/* Header */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
}

.page-subtitle {
  font-size: 14px;
  color: #777;
  margin-top: 4px;
}

.client-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.client-selector label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.client-selector select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-width: 220px;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 2fr;
  gap: 20px;
  margin-top: 10px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cards */
.card {
  background: #fafafa;
  border-radius: 14px;
  padding: 16px 18px;
  border: 1px solid #eee;
}

.card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* Client info */
.client-name {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
}

.stat-label {
  font-size: 13px;
  color: #777;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  margin-top: 2px;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.chart-card {
  min-height: 320px;
}

/* Team list */
.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list li {
  font-size: 14px;
  margin-bottom: 4px;
}

.team-name {
  font-weight: 600;
}

.team-meta {
  font-size: 12px;
  color: #777;
}

/* Table */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.cases-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.cases-table th,
.cases-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
}

.cases-table th {
  background: #f3f3f7;
  font-weight: 700;
  text-align: left;
}

/* Helpers */
.center-msg {
  text-align: center;
  padding: 18px;
  font-size: 14px;
}

.error-msg {
  color: #b3261e;
  background: #fdecea;
  border-radius: 10px;
  padding: 10px 12px;
}

.muted {
  color: #888;
  font-size: 13px;
}

/*** INPUTS ***/

.input:focus {
  border-color: #5c4dff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(92, 77, 255, 0.18);
  outline: none;
}

.header-row {
  display: flex;
  justify-content: space-between; /* LEFT vs RIGHT */
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

/* Container for the right side items */
.actions-container {
  display: flex;
  align-items: center;
  gap: 15px; /* space between button and select */
}

/* Make selector look aligned */
.client-selector {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
