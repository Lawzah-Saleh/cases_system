<template>
  <div class="case-report-page">
    <div class="dashboard">
      <div class="title-container">
        <h2 class="page-title">
          <span class="link-back" @click="$router.back()">Statistics</span> / Cases Statistics
        </h2>
      </div>
      <div class="cards">
        <!-- Total Cases -->
        <StatsCard
          title="Total Cases"
          :total="cards.total_cases"
          icon="bi bi-people"
          v-model="filterTotalCases"
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
            <h5>Daily Complaints</h5>
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

          <div class="d-flex justify-content-end mb-3">
            <button @click="downloadCaseBerDayExcel" class="btn btn-success">Download Excel</button>
          </div>
        </div>

        <!-- STATUS CHART -->
        <div class="chart-box">
          <div class="chart-header">
            <h5>Cases by Status</h5>
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

          <div class="d-flex justify-content-end mb-3">
            <button @click="downloadCaseStatusExcel" class="btn btn-success">Download Excel</button>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <!-- TYPE CHART -->
        <div class="chart-box">
          <div class="chart-header">
            <h5>Case Type</h5>
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
          <div class="d-flex justify-content-end mb-3">
            <button @click="downloadCaseTypeExcel" class="btn btn-success">Download Excel</button>
          </div>
        </div>

        <div class="chart-box">
          <div class="chart-header">
            <h5>Priority Levels</h5>
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

          <div class="d-flex justify-content-end mb-3">
            <button @click="downloadCasePriorityExcel" class="btn btn-success">
              Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCard from '@/components/Dashboard/StatsCard.vue'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue3-toastify'
import { downloadExcel } from '@/services/excelService'
import dashboardService from '@/services/dashboardService'
import { useCasesByPriorityChart } from '@/composables/charts/useCasesByPriorityChart'
import { useCasesByTypeChart } from '@/composables/charts/useCasesByTypeChart'
import { useTopClientsChart } from '@/composables/charts/useTopClientsChart'
import { useCasesPerDayChart } from '@/composables/charts/useCasesPerDayChart'
import { useCasesByStatusChart } from '@/composables/charts/useCasesByStatusChart'

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
    async downloadCasePriorityExcel() {
      try {
        await downloadExcel(
          `/dashboard/cases-per-priority/excel?range=${this.filterCasesByPriority}`,
          'Cases-Per-Priority.xlsx'
        )

        toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to download the Excel file.', {
          timeout: 3000
        })
      }
    },
    async downloadCaseStatusExcel() {
      try {
        await downloadExcel(
          `/dashboard/cases-per-status/excel?range=${this.filterCasesByStatus}`,
          'Cases-Per-Status.xlsx'
        )

        toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to download the Excel file.', {
          timeout: 3000
        })
      }
    },
    async downloadCaseTypeExcel() {
      try {
        await downloadExcel(
          `/dashboard/cases-per-type/excel?range=${this.filterCasesByType}`,
          'Cases-Per-Type.xlsx'
        )

        toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to download the Excel file.', {
          timeout: 3000
        })
      }
    },
    async downloadTopClientsExcel() {
      try {
        await downloadExcel(
          `/dashboard/top-clients/excel?range=${this.filterTopClients}`,
          'Top-Clients.xlsx'
        )

        toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to download the Excel file.', {
          timeout: 3000
        })
      }
    },
    async downloadCaseBerDayExcel() {
      try {
        await downloadExcel(
          `/dashboard/cases-per-day/excel?range=${this.filterCasesPerDay}`,
          'Cases-Per-Day.xlsx'
        )

        toast.success('Excel file downloaded successfully!', {
          timeout: 3000
        })
      } catch (err) {
        console.error(err)
        toast.error('Failed to download the Excel file.', {
          timeout: 3000
        })
      }
    },
    token() {
      return { headers: { Authorization: `Bearer ${useAuthStore().token}` } }
    },

    async loadCards() {
      const casesRes = await dashboardService.getCards(this.filterTotalCases)
      const clientsRes = await dashboardService.getCards(this.filterTotalClients)
      const employeesRes = await dashboardService.getCards(this.filterTotalEmployees)
      const completionRes = await dashboardService.getCompletionRate(this.filterCompletionRate)

      this.cards.total_cases = casesRes.data.total_cases
      this.cards.total_clients = clientsRes.data.total_clients
      this.cards.total_employees = employeesRes.data.total_employees
      this.completionRate = completionRes.data.completion_rate
    },
    async loadCasesPerDay() {
      const res = await dashboardService.getCasesPerDay(this.filterCasesPerDay)

      const { options, series } = useCasesPerDayChart(res.data)

      this.casesPerDayOptions = options
      this.casesPerDaySeries = series
    },
    async loadCasesByStatus() {
      const res = await dashboardService.getCasesByStatus(this.filterCasesByStatus)

      const { options, series } = useCasesByStatusChart(res.data)

      this.casesByStatusOptions = options
      this.casesByStatusSeries = series
    },
    async loadCasesByPriority() {
      const res = await dashboardService.getCasesByPriority(this.filterCasesByPriority)

      const { options, series } = useCasesByPriorityChart(res.data)

      this.casesByPriorityOptions = options
      this.casesByPrioritySeries = series
    },
    async loadCasesByType() {
      const res = await dashboardService.getCasesByType(this.filterCasesByType)

      const { options, series } = useCasesByTypeChart(res.data)

      this.casesByTypeOptions = options
      this.casesByTypeSeries = series
    },
    async loadTopClients() {
      const res = await dashboardService.getTopClients(this.filterTopClients)

      const { options, series } = useTopClientsChart(res.data)

      this.topClientsOptions = options
      this.topClientsSeries = series
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

.apexcharts-menu-item.exportCSV {
  display: none !important;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #222;
}

.case-report-page {
  background: #fff;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}
</style>
