<template>
  <aside :class="['sidebar', { 'sidebar--open': isOpen }]">
    <!-- Logo -->
    <div class="sidebar-header">
      <img src="@/assets/temmamLogo.png" alt="Logo" class="logo" />
    </div>

    <!-- Menu -->
    <ul class="sidebar-menu">
      <li>
        <router-link to="/app/dashboard">
          <i class="bi bi-speedometer2"></i>
          <span class="menu-text">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/supports">
          <i class="bi bi-life-preserver"></i>
          <span class="menu-text">Supports</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/clients">
          <i class="bi bi-people"></i>
          <span class="menu-text">clients</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/employees">
          <i class="bi bi-person-badge"></i>
          <span class="menu-text">Employee</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/users">
          <i class="bi bi-person"></i>
          <span class="menu-text">Users</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/statistics">
          <i class="bi bi-bar-chart"></i>
          <span class="menu-text">Statistics</span>
        </router-link>
      </li>
      <li>
        <router-link to="/app/reports">
          <i class="bi bi-file-earmark-text"></i>
          <span class="menu-text">Reports</span>
        </router-link>
      </li>

      <li>
        <router-link to="/app/settings">
          <i class="bi bi-gear-fill"></i>
          <span class="menu-text">Setting</span>
        </router-link>
      </li>
    </ul>

    <!-- Backdrop for mobile -->
    <div v-if="isOpen" class="backdrop" @click="$emit('close')"></div>
  </aside>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const handleResize = () => {
  if (window.innerWidth >= 769) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
:root {
  --sidebar-width: 250px;
  --sidebar-bg: #190F4A;
  --sidebar-text: #fff;
  --sidebar-hover: #3a3a5a;
  --appbar-height: 60px;
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  z-index: 2000;
  overflow-y: auto;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', sans-serif;
}

/* Mobile hidden by default */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.sidebar--open {
    transform: translateX(0);
  }
}

/* Desktop always visible */
@media (min-width: 769px) {
  .sidebar {
    transform: translateX(0);
  }
}

/* Logo */
.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  max-width: 150px;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Menu */
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin: 5px 0;
}

.sidebar-menu li a {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.sidebar-menu li a:hover,
.sidebar-menu li a.router-link-active {
  background: var(--sidebar-hover);
}

.sidebar-menu i {
  font-size: 18px;
}

/* Hide menu text on mobile when collapsed (optional) */
@media (max-width: 768px) {
  .menu-text {
    display: inline;
  }
}

/* Backdrop for mobile */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1500;
}

@media (min-width: 769px) {
  .backdrop {
    display: none;
  }
}

/* Scrollbar for long menu */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
