<template>
  <div class="table-container">
    <h2 class="main-header">Settings</h2>

    <div class="settings-grid">
      <SettingCard title="Permission" @click="goTo('/app/permission')">
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
      </SettingCard>

      <SettingCard title="Role" @click="goTo('/app/role')">
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
      </SettingCard>

      <SettingCard title="Personal account" @click="goTo('/app/personalAccount')">
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
      </SettingCard>

      <SettingCard title="Cases delays time" @click="goTo('/app/cases_delay_time')">
        <template #icon>
          <i class="bi bi-clock-history"></i>
        </template>
      </SettingCard>
    </div>
  </div>
</template>

<script setup>
import SettingCard from '@/components/SettingCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.settings-page {
  padding: 30px;
}

h2 {
  margin-bottom: 25px;
  font-weight: 600;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
</style>
