<template>
  <div class="table-container">
    <h2 class="main-header">Statistics</h2>

    <p class="page-hint">
      Analyze system performance and key indicators across cases, employees, and clients.
    </p>

    <div class="cards-grid">
      <!-- CASES STATISTICS -->
      <GlobalCard
        title="Cases Statistics"
        @click="goTo('/app/statistics/cases')"
      >
        <template #icon>
          <i class="bi bi-shield-check"></i>
        </template>
        <template #description>
          Overview of cases volume, status distribution, and trends.
        </template>
      </GlobalCard>

      <!-- EMPLOYEES PERFORMANCE -->
      <GlobalCard
        title="Employees Performance"
        @click="goTo('/app/statistics/employees')"
      >
        <template #icon>
          <i class="bi bi-graph-up-arrow"></i>
        </template>
        <template #description>
          Track employee KPIs, productivity, and response metrics.
        </template>
      </GlobalCard>

      <!-- CLIENTS STATISTICS -->
      <GlobalCard
        title="Clients Statistics"
        @click="goTo('/app/statistics/clients')"
      >
        <template #icon>
          <i class="bi bi-person-lines-fill"></i>
        </template>
        <template #description>
          Insights about client activity, engagement, and growth.
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
