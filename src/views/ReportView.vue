<template>
  <div class="table-container">
    <h2 class="main-header">Reports</h2>

    <p class="page-hint">
      Generate detailed reports to analyze system activity, performance, and customer data.
    </p>

    <div class="cards-grid">
      <!-- CASES REPORT -->
      <GlobalCard
        title="Cases / Supports"
        @click="goTo('/app/reports/cases')"
      >
        <template #icon>
          <i class="bi bi-life-preserver"></i>
        </template>
        <template #description>
          Comprehensive reports covering cases lifecycle, status, and priorities.
        </template>
      </GlobalCard>

      <!-- EMPLOYEE PERFORMANCE REPORT -->
      <GlobalCard
        title="Employees Achievement"
        @click="goTo('/app/reports/employees')"
      >
        <template #icon>
          <i class="bi bi-graph-up"></i>
        </template>
        <template #description>
          Measure employee productivity, SLA compliance, and performance metrics.
        </template>
      </GlobalCard>

      <!-- CLIENTS REPORT -->
      <GlobalCard
        title="Clients"
        @click="goTo('/app/reports/clients')"
      >
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
        <template #description>
          Insights into client activity, engagement, and historical data.
        </template>
      </GlobalCard>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import GlobalCard from '@/components/GlobalCard.vue'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>
<style scoped>
.page-hint {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}
</style>
