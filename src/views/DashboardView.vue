<!-- <template>
  <div class="dashboard-container">

    <h2 class="page-title">Dashboard</h2>

  
    <div class="cards-grid">
      <StatsCard
        title="This Month CRM Supports"
        :current="12"
        :total="45"
        :trend="1.3"
        trendText="Up from past week"
      />
      <StatsCard
        title="This Month CRM Supports"
        :current="0"
        :total="2"
        :trend="-4.3"
        trendText="Down from yesterday"
      />
      <StatsCard
        title="This Month Customers"
        :current="0"
        :total="8"
        :trend="1.3"
        trendText="Up from past week"
      />
      <StatsCard
        title="This Month Team Members"
        :current="0"
        :total="9"
        :trend="1.3"
        trendText="Up from past week"
      />
    </div>

  </div>
</template>

<script setup>
import StatsCard from '@/components/Dashboard/StatsCard.vue'
</script>

<style scoped>


.dashboard-container {
  padding: 25px 30px;
  background: #f5f7fb;
  min-height: 100%;
  width: 100%;
  max-width: 100% !important;
  margin: 0 !important;
  display: block;
  padding-top: 10px;


}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  gap: 22px;
  justify-items: start !important; 
}


.page-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #222;
}



@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style> -->
<template>
  <div class="dashboard">
    <!-- CARDS ROW -->
    <div class="cards">
      <StatsCard title="Total Case" :total="cards.total_cases" icon="bi bi-people" />
      <StatsCard title="Total Clients" :total="cards.total_clients" icon="bi bi-people" />
      <StatsCard title="Total Employees" :total="cards.total_employees" icon="bi bi-people" />
      <StatsCard title="Completion Rate" :total="completionRate + '%'" icon="bi bi-pie-chart" />
    </div>

    <!-- FIRST ROW -->
    <div class="charts-grid">
      <div class="chart-box large">
        <h3 class="chart-title">Daily Complaints</h3>
        <apexchart
          type="bar"
          height="300"
          :options="casesPerDayOptions"
          :series="casesPerDaySeries"
        />
      </div>

      <div class="chart-box small">
        <h3 class="chart-title">Cases by Status</h3>
        <apexchart
          type="donut"
          height="300"
          :options="casesByStatusOptions"
          :series="casesByStatusSeries"
        />
      </div>
    </div>

    <!-- SECOND ROW -->
    <div class="charts-grid">
      <div class="chart-box small">
        <h3 class="chart-title">Case Type</h3>
        <apexchart
          type="donut"
          height="300"
          :options="casesByTypeOptions"
          :series="casesByTypeSeries"
        />
      </div>

      <div class="chart-box small">
        <h3 class="chart-title">Priority Levels</h3>
        <apexchart
          type="donut"
          height="300"
          :options="casesByPriorityOptions"
          :series="casesByPrioritySeries"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsCard from '@/components/Dashboard/StatsCard.vue'
import { useAuthStore } from '../stores/auth'
export default {
  components: {
    StatsCard
  },
  data() {
    return {
      cards: {},

      // Charts Data
      casesPerDayOptions: {},
      casesPerDaySeries: [],
      casesByStatusOptions: {},
      casesByStatusSeries: [],
      casesByPriorityOptions: {},
      casesByPrioritySeries: [],
      casesByTypeOptions: {},
      casesByTypeSeries: [],
      topClientsOptions: {},
      topClientsSeries: [],

      completionRate: 0
    }
  },

  async mounted() {
    await this.loadCards()
    await this.loadCasesPerDay()
    await this.loadCasesByStatus()
    await this.loadCasesByPriority()
    await this.loadCasesByType()
    await this.loadTopClients()
    await this.loadCompletionRate()
  },

  methods: {
    async loadCards() {
      const token = useAuthStore().token

      const res = await axios.get(`http://localhost:8000/api/dashboard/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.cards = res.data
    },

    async loadCasesPerDay() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/cases-per-day`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.casesPerDayOptions = {
        chart: {
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 50,
            columnWidth: '20%'
          }
        },
        colors: ['#5A4FCF'],
        xaxis: {
          categories: res.data.map((r) => r.date),
          labels: { style: { fontSize: '13px' } }
        },
        yaxis: { labels: { style: { fontSize: '13px' } } },
        grid: { strokeDashArray: 3 }
      }

      this.casesPerDaySeries = [
        {
          name: 'Cases',
          data: res.data.map((r) => r.total)
        }
      ]
    },

    async loadCasesByStatus() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/cases-by-status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.casesByStatusOptions = {
        labels: res.data.map((r) => r.status),
        chart: { toolbar: { show: false } },
        legend: { position: 'bottom' },
        colors: ['#573DFF', '#10B981', '#F59E0B', '#EF4444']
      }
      this.casesByStatusSeries = res.data.map((r) => r.total)
    },

    async loadCasesByPriority() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/cases-by-priority`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.casesByPriorityOptions = {
        labels: res.data.map((r) => r.priority)
      }
      this.casesByPrioritySeries = res.data.map((r) => r.total)
    },

    async loadCasesByType() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/cases-by-type`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.casesByTypeOptions = {
        labels: res.data.map((r) => r.type)
      }
      this.casesByTypeSeries = res.data.map((r) => r.total)
    },

    async loadTopClients() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/top-clients`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.topClientsOptions = {
        xaxis: { categories: res.data.map((r) => r.client_name) }
      }
      this.topClientsSeries = [
        {
          name: 'Cases',
          data: res.data.map((r) => r.cases_count)
        }
      ]
    },

    async loadCompletionRate() {
      const token = useAuthStore().token
      const res = await axios.get(`http://localhost:8000/api/dashboard/completion-rate`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.completionRate = res.data.completion_rate
    }
  }
}
</script>

<style>
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
</style>
