<template>
  <div class="page-container">
    <!-- ================= HEADER ================= -->
    <div class="page-header">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">statistics</span>
        / Case Statistics
      </h2>
      <div class="range-select">
        <select v-model="range" @change="loadStatistics">
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <span v-if="loading" class="loading-text">Loading...</span>
      </div>
    </div>

    <!-- SKELETON LOADING -->
    <div v-if="loading" class="stats-grid">
      <SkeletonCard v-for="i in 6" :key="i" />
    </div>

    <!-- ================= CASE STATISTICS SECTION ================= -->
    <div v-else class="stats-grid">
      <StatCard title="Total Cases" :value="cards.total_cases" color="#2980b9">
      <template #subtitle>
        Closed: {{ cards.closed_cases.closure_rate }}% | Open: {{ 100 - cards.closed_cases.closure_rate }}%
      </template>



        <template #info>
          Total number of cases including both open and closed.
        </template>
      </StatCard>

      <StatCard
        title="Closed Cases"
        :value="cards.closed_cases.total"
        :color="getColor(cards.closed_cases.closure_rate)"
      >
        <template #subtitle>
          Closure Rate: {{ cards.closed_cases.closure_rate }}%
        </template>
        <template #info>Number of cases successfully closed in selected period</template>
      </StatCard>

      <StatCard
        title="Open Backlog"
        :value="cards.open_backlog.total"
        :color="getColor(cards.open_backlog.breach_rate, true)"
      >
        <template #subtitle>
          Breach Rate: {{ cards.open_backlog.breach_rate }}%
        </template>
        <template #info>
          Number of open cases exceeding priority SLA
        </template>
      </StatCard>

      <StatCard
        title="Avg Resolution Time (days)"
        :value="cards.avg_resolution_time"
        color="#8e44ad"
      >
        <template #info>
          Average time taken to resolve closed cases
        </template>
      </StatCard>

      <StatCard
        title="SLA Compliance"
        :value="cards.sla_compliance.total_closed"
        :color="getColor(cards.sla_compliance.compliance_rate)"
      >
        <template #subtitle>
          Compliance: {{ cards.sla_compliance.compliance_rate }}%
        </template>
        <template #info>
          Percentage of closed cases within SLA
        </template>
      </StatCard>

      <StatCard
        title="High Priority Risk"
        :value="cards.high_priority_risk.total_closed"
        :color="getColor(cards.high_priority_risk.breach_rate, true)"
      >
        <template #subtitle>
          Breach: {{ cards.high_priority_risk.breach_rate }}%
        </template>
        <template #info>
          High priority cases that exceeded SLA
        </template>
      </StatCard>
    </div>
    <div class="charts-grid">
      <div class="chart-wrapper">
        <SlaBreachByPriority />
      </div>
      <div class="chart-wrapper">
        <CaseStatusChart />
      </div>

    </div>



  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import StatCard from '@/components/statistics/StatCard.vue'
import SkeletonCard from '@/components/statistics/SkeletonCard.vue'
import SlaBreachByPriority from '@/components/statistics/SlaBreachByPriority.vue'
import CaseStatusChart from '@/components/statistics/CaseStatusChart.vue'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const loading = ref(false)
const showCharts = ref(true)

const cards = ref({
  total_cases: 0,
  closed_cases: { total: 0, closure_rate: 0 },
  open_backlog: { total: 0, breached: 0, breach_rate: 0 },
  avg_resolution_time: 0,
  sla_compliance: { total_closed: 0, compliance_rate: 0 },
  high_priority_risk: { total_closed: 0, breached: 0, breach_rate: 0, avg_resolution_days: 0 }
})

const range = ref('month')
const chartData = ref([])

const getColor = (value, inverse = false) => {
  if (inverse) {
    if (value <= 20) return '#27ae60'
    if (value <= 50) return '#f39c12'
    return '#e74c3c'
  } else {
    if (value >= 80) return '#27ae60'
    if (value >= 50) return '#f39c12'
    return '#e74c3c'
  }
}
import { useRouter } from 'vue-router'
const router = useRouter()



const loadStatistics = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/statistics/cards', {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: { range: range.value }
    })
    if (res.data && res.data.cards) {
      cards.value = res.data.cards

      // تحضير بيانات المخطط
      chartData.value = [
        { name: 'Closed', value: cards.value.closed_cases.total },
        { name: 'Open', value: cards.value.open_backlog.total },
        { name: 'High Priority Breach', value: cards.value.high_priority_risk.total_closed }
      ]
    }
  } catch (err) {
    console.error('Failed to load case statistics', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadStatistics)

</script>

<style scoped>
.page-container {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.range-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-select select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-weight: 600;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.charts-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.chart-wrapper {
  flex: 1 1 45%;
  min-width: 300px;
}

</style>
