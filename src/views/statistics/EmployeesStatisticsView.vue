<template>
  <div class="page-container">
    <!-- ================= HEADER ================= -->
    <div class="page-header">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">statistics</span>
        / Employee Performance statistics
      </h2>
      <select v-model="range" @change="loadStatistics">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </div>

    <!-- SKELETON LOADING -->
    <div v-if="loading">
      <div class="stats-grid">
        <SkeletonCard v-for="i in 9" :key="i" />
      </div>

      <div class="charts-grid">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
    <!-- ================= PERFORMANCE SECTION ================= -->
    <template v-if="!loading">
      <div class="stats-grid">
        <StatCard title="Top Performer" :value="stats.highest?.name ?? '—'" color="#27ae60">
          <template #subtitle>
            Completion Rate:
            {{
              stats.highest?.completion_rate !== undefined
                ? stats.highest.completion_rate + '%'
                : '—'
            }}
          </template>

          <template #info> Employee with the highest overall performance score. </template>
        </StatCard>

        <StatCard
          title="Lowest Performer"
          :value="stats.lowest?.name ?? '—'"
          color="#e74c3c"
          clickable
          @click="goToEmployee(stats.lowest?.name)"
        >
          <template #subtitle>
            Completion Rate:
            {{
              stats.lowest?.completion_rate !== undefined ? stats.lowest.completion_rate + '%' : '—'
            }}
          </template>

          <template #info> Employee with the lowest overall performance score. </template>
        </StatCard>
        <StatCard
          title="Overall Performance"
          :value="trends.performance ? trends.performance.current + '%' : '—'"
          :trend="trends.performance?.delta ?? 0"
          color="#34495e"
        >
          <template #info> Average performance score compared to the previous period </template>
        </StatCard>
        <StatCard
          title="Fastest Response"
          :value="stats.fastest ? stats.fastest.avg_first_response_time + ' min' : '—'"
          color="#8e44ad"
        >
          <template #subtitle>
            {{ stats.fastest?.name }}
          </template>
          <template #info> Employee with the shortest first response time </template>
        </StatCard>
        <!-- <StatCard
          title="Best SLA"
          :value="stats.best_sla ? stats.best_sla.sla_rate + '%' : '—'"
          color="#2980b9"
        >
          <template #subtitle>
            {{ stats.best_sla?.name }}
          </template>
          <template #info>
            Employee with the highest SLA compliance rate
          </template>
        </StatCard> -->
        <StatCard title="SLA Breach Rate" :value="slaBreach.rate + '%'" color="#e74c3c">
          <template #subtitle> {{ slaBreach.breached }} of {{ slaBreach.total }} cases </template>
          <template #info> Percentage of closed cases that violated SLA </template>
        </StatCard>
      </div>

      <!-- ================= CHARTS ================= -->
      <div class="charts-grid">
        <PerformanceBarChart v-if="charts.performance.length" :data="charts.performance" />
        <ResponseLineChart v-if="charts.response_time.length" :data="charts.response_time" />
        <PerformanceDistributionChart
          v-if="distribution.high + distribution.medium + distribution.low > 0"
          :distribution="distribution"
        />
      </div>

      <div v-if="charts.performance.length === 0" class="empty-state">
        <i class="bi bi-bar-chart"></i>
        <p>No statistics available for selected range</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

import StatCard from '@/components/statistics/StatCard.vue'
import PerformanceBarChart from '@/components/statistics/PerformanceBarChart.vue'
import ResponseLineChart from '@/components/statistics/ResponseChart.vue'
import PerformanceDistributionChart from '@/components/statistics/PerformanceDistributionChart.vue'
import SkeletonCard from '@/components/statistics/SkeletonCard.vue'
import SkeletonChart from '@/components/statistics/SkeletonChart.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

const goToEmployee = (name) => {
  if (!name) return

  router.push({
    path: '/app/reports/employees',
    query: { employee: name }
  })
}
const auth = useAuthStore()

const range = ref('month')
const loading = ref(false)

const stats = ref({})
const distribution = ref({ high: 0, medium: 0, low: 0 })
const slaBreach = ref({ rate: 0, breached: 0, total: 0 })

const charts = ref({
  performance: [],
  response_time: []
})

const trends = ref({})

const loadStatistics = async () => {
  try {
    loading.value = true

    const res = await axios.get('http://localhost:8000/api/statistics/employees', {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: { range: range.value }
    })

    stats.value = res.data.stats
    distribution.value = res.data.distribution
    slaBreach.value = res.data.sla_breach
    charts.value = {
      performance: res.data.charts?.performance ?? [],
      response_time: res.data.charts?.response_time ?? []
    }
    trends.value = res.data.trends
  } catch (e) {
    console.error('Failed loading employee statistics', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadStatistics)
</script>

<style scoped>
.page-container {
  background-color: white;
  background: #fff;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.page-header h2 {
  font-size: 26px;
  font-weight: 700;
}

.page-header select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-weight: 600;
}

.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  width: 100%;
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
