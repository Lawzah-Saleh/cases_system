<template>
  <div class="table-container">
     
    <h2 class="main-header">Settings</h2>

    <div class="settings-grid">
      <SettingCard
        title="Permission"
        @click="goTo('/app/settings/permission')"
      >
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
      </SettingCard>

      <SettingCard
        title="Role"
        @click="goTo('/app/settings/role')"
      >
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
      </SettingCard>

      <SettingCard
        title="Personal account"
        @click="goTo('/app/settings/account')"
      >
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
      </SettingCard>

      <SettingCard
        title="Complaints delays time"
        @click="goTo('/app/settings/complaints')"
      >
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
</style>
