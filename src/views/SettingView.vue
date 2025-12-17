<template>
  <div class="table-container">
    <h2 class="main-header">Settings</h2>

    <p class="page-hint">
      Configure system access, roles, personal preferences, and operational rules.
    </p>

    <div class="cards-grid">
      <!-- PERMISSIONS -->
      <GlobalCard
        title="Permission"
        @click="goTo('/app/settings/permission')"
      >
        <template #icon>
          <i class="bi bi-shield-lock"></i>
        </template>
        <template #description>
          Control access rights and permissions across the system.
        </template>
      </GlobalCard>

      <!-- ROLES -->
      <GlobalCard
        title="Role"
        @click="goTo('/app/settings/role')"
      >
        <template #icon>
          <i class="bi bi-people"></i>
        </template>
        <template #description>
          Define user roles and assign permissions to each role.
        </template>
      </GlobalCard>

      <!-- PERSONAL ACCOUNT -->
      <GlobalCard
        title="Personal Account"
        @click="goTo('/app/settings/personalAccount')"
      >
        <template #icon>
          <i class="bi bi-person-circle"></i>
        </template>
        <template #description>
          Manage your profile details, password, and preferences.
        </template>
      </GlobalCard>

      <!-- CASES DELAY -->
      <GlobalCard
        title="Cases Delay Time"
        @click="goTo('/app/settings/cases_delay_time')"
      >
        <template #icon>
          <i class="bi bi-clock-history"></i>
        </template>
        <template #description>
          Configure delay thresholds and timing rules for cases workflow.
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
