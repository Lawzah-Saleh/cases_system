<template>
  <div class="table-container">
    <h2 class="main-header">Statistics</h2>

    <div class="cards-grid">
      <!-- CASES STATISTICS -->
      <GlobalCard title="Cases Statistics" @click="goTo('/app/statistics/cases')">
        <template #icon>
          <i class="bi bi-shield-check"></i>
        </template>
      </GlobalCard>

      <!-- EMPLOYEES PERFORMANCE -->
      <GlobalCard title="Employees Performance" @click="goTo('/app/statistics/employees')">
        <template #icon>
          <i class="bi bi-graph-up-arrow"></i>
        </template>
      </GlobalCard>

      <!-- CLIENTS STATISTICS -->
      <GlobalCard title="Clients Statistics" @click="goTo('/app/statistics/clients')">
        <template #icon>
          <i class="bi bi-person-lines-fill"></i>
        </template>
      </GlobalCard>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GlobalCard from '@/components/GlobalCard.vue'

const router = useRouter()
const auth = useAuthStore()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.page-container {
  padding: 10px;
}

.main-header {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.cards-grid > * {
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.cards-grid > *:hover {
  transform: translateY(-6px);
}
</style>
