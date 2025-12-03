<template>
  <div class="table-container">
    <h2 class="main-header">Reports</h2>

    <div class="cards-grid">
      <GlobalCard title="Cases/supports">
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
      </GlobalCard>

      <GlobalCard title="Employees Acheivement">
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
      </GlobalCard>

      <GlobalCard title="Clients">
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
