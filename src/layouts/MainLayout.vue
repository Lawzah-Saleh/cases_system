<template>
  <div class="layout">
    <!-- Sidebar ثابت -->
    <Sidebar :isOpen="isOpen" @close="isOpen = false" />

    <!-- Main content -->
    <div class="main">
      <AppBar @toggle="toggleSidebar" />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import AppBar from '@/components/Navbar.vue'

const isOpen = ref(false)
const toggleSidebar = () => { isOpen.value = !isOpen.value }
</script>

<style scoped>
:root {
  --sidebar-width: 250px;
  --appbar-height: 60px;
}

/* Layout */
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar ثابت */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  z-index: 1000;
}

/* AppBar ثابت مثل Sidebar */
.appbar {
  position: fixed;
  top: 0;
  left: var(--sidebar-width); /* يبدأ عند نهاية Sidebar */
  width: calc(100% - var(--sidebar-width));
  height: var(--appbar-height);
  z-index: 900;
}

/* Main content تحت AppBar */
.main {
  padding-top: var(--appbar-height);
  padding-left: var(--sidebar-width);
  height: 100%;
  overflow-y: auto; /* فقط التمرير العمودي */
}

/* Content area */
.content {
  min-height: 100%;
  background: #f5f5f5;
  padding: 20px;
}

/* Responsive: على الموبايل Sidebar يغطي الشاشة */
@media (max-width: 768px) {
  .appbar {
    left: 0;
    width: 100%;
  }
  .main {
    padding-left: 0;
  }
  .sidebar {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
