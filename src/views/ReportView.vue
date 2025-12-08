<template>
  <div class="table-container">
    <h2 class="main-header">Reports</h2>

    <div class="cards-grid">
      
      <!-- CASES REPORT -->
      <GlobalCard title="Cases / Supports" @click="goTo('/app/reports/cases')">
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
      </GlobalCard>

      <!-- EMPLOYEE PERFORMANCE REPORT -->
      <GlobalCard title="Employees Achievement" @click="goTo('/app/reports/employees')">
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
      </GlobalCard>

      <!-- CLIENTS REPORT -->
      <GlobalCard title="Clients" @click="goTo('/app/reports/clients')">
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
      </GlobalCard>
    </div>
  </div>
</template>

<script setup>
import GlobalCard from '@/components/GlobalCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 20px;
}

.cards-grid > * {
  cursor: pointer;
  transition: 0.2s;
}

.cards-grid > *:hover {
  transform: translateY(-5px);
}
</style>
