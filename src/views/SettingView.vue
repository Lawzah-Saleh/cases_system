<template>
  <div class="table-container">
    <h2 class="main-header">Settings</h2>

    <div class="cards-grid">
      <GlobalCard title="Permission" @click="goTo('/app/settings/permission')">
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
      </GlobalCard>

      <GlobalCard title="Role" @click="goTo('/app/settings/role')">
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
      </GlobalCard>

      <GlobalCard title="Personal account" @click="goTo('/app/settings/personalAccount')">
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
      </GlobalCard>

      <GlobalCard title="Cases delays time" @click="goTo('/app/settings/cases_delay_time')">
        <template #icon>
          <i class="bi bi-clock-history"></i>
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
