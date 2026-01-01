<template>
  <div class="dashboard">
    <div class="cards">
   <StatsCard
        title="Support Cases"
        :total="cards.total_cases"
        icon="bi bi-headset"
        v-model="filterTotalCases"
        @update:modelValue="loadCards"
      />
      <StatsCard
        title="Clients"
        :total="cards.total_clients"
        icon="bi bi-people-fill"
        v-model="filterTotalClients"
        @update:modelValue="loadCards"
      />
      <StatsCard
        title="Employees"
        :total="cards.total_employees"
        icon="bi bi-person-badge"
        v-model="filterTotalEmployees"
        @update:modelValue="loadCards"
      />
      <StatsCard
        title="Completion Rate"
        :total="completionRate + '%'"
        icon="bi bi-bar-chart-line-fill"
        v-model="filterCompletionRate"
        @update:modelValue="loadCards"
      />
    </div>

    <!-- DAILY CASES CHART -->
    <div class="charts-grid">
      <div class="chart-box">
        <div class="chart-header">
          <h5>Daily Complaints</h5>
          <div>
            <select v-model="filterCasesPerDay" @change="loadCasesPerDay">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <apexchart
          type="bar"
          height="300"
          :options="casesPerDayOptions"
          :series="casesPerDaySeries"
        />

        <div class="d-flex justify-content-end mb-3">
          <button @click="downloadCaseBerDayExcel" class="download-btn">Download Excel</button>
        </div>
      </div>

      <!-- STATUS CHART -->
      <div class="chart-box">
        <div class="chart-header">
          <h5>Cases by Status</h5>
          <div>
            <select v-model="filterCasesByStatus" @change="loadCasesByStatus">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <apexchart
          type="pie"
          height="300"
          :options="casesByStatusOptions"
          :series="casesByStatusSeries"
        />

        <div class="d-flex justify-content-end mb-3">
          <button @click="downloadCaseStatusExcel" class="download-btn">Download Excel</button>
        </div>
      </div>
    </div>

    <div class="charts-grid charts-grid-wide">
      <!-- TYPE CHART -->
      <div class="chart-box">
        <div class="chart-header">
          <h5>Case Type</h5>
          <div>
            <select v-model="filterCasesByType" @change="loadCasesByType">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <apexchart
          type="donut"
          height="300"
          :options="casesByTypeOptions"
          :series="casesByTypeSeries"
        />
        <div class="d-flex justify-content-end mb-3">
          <button @click="downloadCaseTypeExcel" class="download-btn">Download Excel</button>
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-header">
          <h5>Top Clients</h5>
          <div>
            <select v-model="filterTopClients" @change="loadTopClients">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <apexchart
          type="bar"
          height="300"
          :options="topClientsOptions"
          :series="topClientsSeries"
        />

        <div class="d-flex justify-content-end mb-3">
          <button @click="downloadTopClientsExcel" class="download-btn">Download Excel</button>
        </div>
      </div>
    </div>
    <!-- TOP CLIENTS -->
    <!-- PRIORITY CHART -->
     <div class="charts-grid charts-grid-normal">
    <div class="chart-box">
      <div class="chart-header">
        <h5>Priority Levels</h5>
        <div>
          <select v-model="filterCasesByPriority" @change="loadCasesByPriority">
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      <apexchart
        type="donut"
        height="300"
        :options="casesByPriorityOptions"
        :series="casesByPrioritySeries"
      />

      <div class="d-flex justify-content-end mb-3">
        <button @click="downloadCasePriorityExcel" class="download-btn">Download Excel</button>
      </div>
    </div>


    <div class="chart-box">
        <div class="chart-header">
          <h5>Case Entry</h5>
          <div>
            <select v-model="filterCasesByWayEntry" @change="loadCasesByWayEntry">
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <apexchart
          type="donut"
          height="300"
          :options="casesByWayEntryOptions"
          :series="casesByWayEntrySeries"
        />
        <div class="d-flex justify-content-end mb-3">
          <button @click="downloadCaseWayEntryExcel" class="download-btn">Download Excel</button>
        </div>
      </div>



    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCard from '@/components/Dashboard/StatsCard.vue'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import { downloadExcel } from '@/services/excelService'
import dashboardService from '@/services/dashboardService'
import { useCasesByPriorityChart } from '@/composables/charts/useCasesByPriorityChart'
import { useCasesByTypeChart } from '@/composables/charts/useCasesByTypeChart'
import { useTopClientsChart } from '@/composables/charts/useTopClientsChart'
import { useCasesPerDayChart } from '@/composables/charts/useCasesPerDayChart'
import { useCasesByStatusChart } from '@/composables/charts/useCasesByStatusChart'
import { useCasesBywayEntryChart } from '@/composables/charts/useCasesBywayEntryChart'

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
      filterCasesByWayEntry : 'month',

      cards: {},
      completionRate: 0,

      // charts data
      casesByWayEntryOptions : {},
      casesByWayEntrySeries : [],
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
      this.loadTopClients(),
      this.loadCasesByWayEntry()
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

    async downloadCaseWayEntryExcel()
    {
     try {
        await downloadExcel(
          `/dashboard/cases-per-way-entry/excel?range=${this.filterCasesByWayEntry}`,
          'Cases-Per-Way-Of-Entry.xlsx'
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


    async loadCasesByWayEntry (){
      const res = await dashboardService.getCasesByWayEntry(this.filterCasesByWayEntry)

      const { options, series } = useCasesBywayEntryChart(res.data)

      this.casesByWayEntryOptions = options
      this.casesByWayEntrySeries = series
      
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

.dashboard {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 0 auto;

}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 10px;

}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

}

.chart-box {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

}
.chart-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}
.filter-select {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  font-size: 14px;
  background-color: #f9f9f9;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}
.charts-grid.charts-grid-wide {   
  grid-template-columns: 1fr 1fr;
 }
.charts-grid.charts-grid-normal { 
  grid-template-columns: 1fr 1fr; 
}

.completion-box {
  background: #e3ffe3;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
}

select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  font-size: 14px;

}

.apexcharts-menu-item.exportCSV {
  display: none !important;
}
/* Responsive */
@media (max-width: 1200px) {
  .charts-grid-wide { grid-template-columns: 1.5fr 1fr; }
  .charts-grid-normal { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .charts-grid-wide,
  .charts-grid-normal {
    grid-template-columns: 1fr;
  }
  .dashboard {
    padding: 20px;
  }
}
</style>
