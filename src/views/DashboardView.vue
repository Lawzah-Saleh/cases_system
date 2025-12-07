<template>
  <div class="dashboard">
    <div class="cards">
      <!-- Total Cases -->
      <StatsCard
        title="Total Cases"
        :total="cards.total_cases"
        icon="bi bi-people"
        v-model="filterTotalCases"
        @update:modelValue="loadCards"
      />

      <!-- Clients -->
      <StatsCard
        title="Clients"
        :total="cards.total_clients"
        icon="bi bi-people"
        v-model="filterTotalClients"
        @update:modelValue="loadCards"
      />

      <!-- Employees -->
      <StatsCard
        title="Employees"
        :total="cards.total_employees"
        icon="bi bi-people"
        v-model="filterTotalEmployees"
        @update:modelValue="loadCards"
      />

      <!-- Completion Rate -->
      <StatsCard
        title="Completion Rate"
        :total="completionRate + '%'"
        icon="bi bi-pie-chart"
        v-model="filterCompletionRate"
        @update:modelValue="loadCards"
      />
    </div>

    <!-- DAILY CASES CHART -->
    <div class="charts-grid">
      <div class="chart-box">
        <div class="chart-header">
          <h3>Daily Complaints</h3>
          <select v-model="filterCasesPerDay" @change="loadCasesPerDay">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <apexchart
          type="bar"
          height="300"
          :options="casesPerDayOptions"
          :series="casesPerDaySeries"
        />
      </div>

      <!-- STATUS CHART -->
      <div class="chart-box">
        <div class="chart-header">
          <h3>Cases by Status</h3>
          <select v-model="filterCasesByStatus" @change="loadCasesByStatus">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <apexchart
          type="pie"
          height="300"
          :options="casesByStatusOptions"
          :series="casesByStatusSeries"
        />
      </div>
    </div>

    <div class="charts-grid">
      <!-- TYPE CHART -->
      <div class="chart-box">
        <div class="chart-header">
          <h3>Case Type</h3>
          <select v-model="filterCasesByType" @change="loadCasesByType">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <apexchart
          type="donut"
          height="300"
          :options="casesByTypeOptions"
          :series="casesByTypeSeries"
        />
      </div>
      <div class="chart-box">
        <div class="chart-header">
          <h3>Top Clients</h3>
          <select v-model="filterTopClients" @change="loadTopClients">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <apexchart
          type="bar"
          height="300"
          :options="topClientsOptions"
          :series="topClientsSeries"
        />
      </div>
    </div>
    <!-- TOP CLIENTS -->
    <!-- PRIORITY CHART -->
    <div class="chart-box">
      <div class="chart-header">
        <h3>Priority Levels</h3>
        <select v-model="filterCasesByPriority" @change="loadCasesByPriority">
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <apexchart
        type="donut"
        height="300"
        :options="casesByPriorityOptions"
        :series="casesByPrioritySeries"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCard from '@/components/Dashboard/StatsCard.vue'
import { useAuthStore } from '../stores/auth'

export default {
  components: { StatsCard },

  data() {
    return {
      // individual filters
      filterCards: 'month',
      filterCasesPerDay: 'month',
      filterCasesByStatus: 'month',
      filterCasesByPriority: 'month',
      filterCasesByType: 'month',
      filterTopClients: 'month',
      filterTotalCases: 'month',
      filterTotalClients: 'month',
      filterTotalEmployees: 'month',
      filterCompletionRate: 'month',
      cards: {},
      completionRate: 0,

      // charts data
      casesPerDayOptions: {},
      casesPerDaySeries: [],
      casesByStatusOptions: {},
      casesByStatusSeries: [],
      casesByPriorityOptions: {},
      casesByPrioritySeries: [],
      casesByTypeOptions: {},
      casesByTypeSeries: [],
      topClientsOptions: {},
      topClientsSeries: []
    }
  },

  async mounted() {
    await Promise.all([
      this.loadCards(),
      this.loadCasesPerDay(),
      this.loadCasesByStatus(),
      this.loadCasesByPriority(),
      this.loadCasesByType(),
      this.loadTopClients()
    ])
  },

  methods: {
    token() {
      return { headers: { Authorization: `Bearer ${useAuthStore().token}` } }
    },

    async loadCards() {
      const token = this.token()

      // total cases
      const casesRes = await axios.get(
        `http://localhost:8000/api/dashboard/cards?range=${this.filterTotalCases}`,
        token
      )

      // total clients
      const clientsRes = await axios.get(
        `http://localhost:8000/api/dashboard/cards?range=${this.filterTotalClients}`,
        token
      )

      // total employees
      const employeesRes = await axios.get(
        `http://localhost:8000/api/dashboard/cards?range=${this.filterTotalEmployees}`,
        token
      )

      // completion rate
      const completionRes = await axios.get(
        `http://localhost:8000/api/dashboard/completion-rate?range=${this.filterCompletionRate}`,
        token
      )

      this.cards.total_cases = casesRes.data.total_cases
      this.cards.total_clients = clientsRes.data.total_clients
      this.cards.total_employees = employeesRes.data.total_employees
      this.completionRate = completionRes.data.completion_rate
    },

    async loadCasesPerDay() {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/cases-per-day?range=${this.filterCasesPerDay}`,
        this.token()
      )

      this.casesPerDayOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#190F4E', '#4338CA'],
        plotOptions: { bar: { distributed: true, columnWidth: '20%' } },
        legend: { show: false },
        xaxis: { categories: res.data.map((r) => r.date) }
      }

      this.casesPerDaySeries = [{ name: 'Cases', data: res.data.map((r) => r.total) }]
    },

    async loadCasesByStatus() {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/cases-by-status?range=${this.filterCasesByStatus}`,
        this.token()
      )
      this.casesByStatusOptions = {
        labels: res.data.map((r) => r.status),
        colors: ['#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#8E44AD', '#E74C3C'],
        legend: { position: 'right' }
      }
      this.casesByStatusSeries = res.data.map((r) => r.total)
    },

    async loadCasesByPriority() {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/cases-by-priority?range=${this.filterCasesByPriority}`,
        this.token()
      )
      this.casesByPriorityOptions = {
        labels: res.data.map((r) => r.priority),
        legend: { position: 'right' },
        colors: ['#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#8E44AD', '#E74C3C']
      }
      this.casesByPrioritySeries = res.data.map((r) => r.total)
    },

    async loadCasesByType() {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/cases-by-type?range=${this.filterCasesByType}`,
        this.token()
      )
      this.casesByTypeOptions = {
        labels: res.data.map((r) => r.type),
        legend: { position: 'right' }
      }
      this.casesByTypeSeries = res.data.map((r) => r.total)
    },

    async loadTopClients() {
      const res = await axios.get(
        `http://localhost:8000/api/dashboard/top-clients?range=${this.filterTopClients}`,
        this.token()
      )
      this.topClientsOptions = {
        chart: { toolbar: { show: false } },
        colors: ['#190F4E', '#4338CA'],
        plotOptions: { bar: { distributed: true, columnWidth: '20%' } },
        legend: { show: false },
        xaxis: { categories: res.data.map((r) => r.client_name) }
      }
      this.topClientsSeries = [{ name: 'Cases', data: res.data.map((r) => r.cases_count) }]
    }
  }
}
</script>

<style>
.card {
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #374151;
}

.dashboard {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  font-size: 14px;
}

.dashboard {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.charts-grid:first-of-type {
  grid-template-columns: 2fr 1fr;
}

.charts-grid:last-of-type {
  grid-template-columns: 1fr 1fr;
}
.chart-box {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

/* Responsive */
@media (max-width: 900px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.dashboard {
  padding: 20px;
}
.cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  font-size: 20px;
}
.completion-box {
  background: #e3ffe3;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
}

select {
  padding: 4px 6px;
  border-radius: 6px;
  border: none;
  background-color: #f1f2f6;
  font-size: 13px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.charts-grid:first-of-type {
  grid-template-columns: 2fr 1fr;
}
.charts-grid:last-of-type {
  grid-template-columns: 1fr 1fr;
}
</style>
