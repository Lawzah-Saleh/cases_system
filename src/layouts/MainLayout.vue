<template>
  <div class="layout">

    <!-- Sidebar -->
    <aside :class="['sidebar', { 'sidebar--open': isOpen }]">
      <div class="sidebar-header">LOGO</div>

      <ul class="sidebar-menu">
        <li><router-link to="/app/dashboard">Dashboard</router-link></li>
        <li><router-link to="/app/supports">Supports</router-link></li>
        <li><router-link to="/app/customers">Customers</router-link></li>
        <li><router-link to="/app/team">Team</router-link></li>
        <li><router-link to="/app/users">Users</router-link></li>
        <li><router-link to="/app/statistics">Statistics</router-link></li>
        <li><router-link to="/app/reports">Reports</router-link></li>
      </ul>
    </aside>

    <!-- Backdrop on mobile when sidebar open -->
    <div
      v-if="isOpen"
      class="backdrop"
      @click="closeSidebar"
    ></div>

    <!-- Main container -->
    <div class="main">

      <!-- AppBar -->
      <header class="appbar">
        <!-- Hamburger Icon - visible only on mobile -->
        <button class="hamburger-btn" @click="toggleSidebar">
          <i class="bi bi-list"></i>
        </button>

        <div class="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div class="actions">
          <i class="bi bi-brightness-high"></i>
          <i class="bi bi-bell"></i>
          <img src="https://via.placeholder.com/35" class="avatar">
        </div>
      </header>

      <!-- Page Content -->
      <main class="content">
       <router-view />

      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

// Optional: close sidebar automatically when window resized to desktop
const handleResize = () => {
  if (window.innerWidth >= 769) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ===== Layout wrapper ===== */
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding-top: var(--appbar-height);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transition: transform 0.35s ease-in-out;
  z-index: 2000;
}

/* Default for mobile: sidebar hidden */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.sidebar--open {
    transform: translateX(0);
  }
}

/* Desktop: sidebar always visible, ignore isOpen */
@media (min-width: 769px) {
  .sidebar {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.sidebar-menu {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-menu li a {
  color: var(--sidebar-text);
  padding: 14px 20px;
  display: block;
  text-decoration: none;
}

.sidebar-menu li a:hover,
.sidebar-menu li a.router-link-active {
  background: var(--sidebar-hover);
}

/* ===== Backdrop (mobile only) ===== */
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

/* ===== Main area ===== */
.main {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  width: 100%;
}

/* On mobile, main content should not be shifted */
@media (max-width: 768px) {
  .main {
    margin-left: 0;
  }
}

/* ===== AppBar ===== */
.appbar {
  height: var(--appbar-height);
  background: var(--appbar-bg);
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

/* Hamburger button */
.hamburger-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--appbar-text);
  cursor: pointer;
  margin-right: 10px;
  display: none; /* hidden on desktop */
}

/* Show hamburger only on mobile */
@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
  }
}

.search-box input {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 260px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  border-radius: 50%;
}

/* ===== Content ===== */
.content {
  padding: 20px;
}
</style>
