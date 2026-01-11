<template>
  <div class="main-layout">
    <Sidebar :isOpen="isOpen" @close="isOpen = false" />
    
      <AppBar @toggle="toggleSidebar" />
      <main class="content">
        <router-view />
      </main>
   
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
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  z-index: 1000;
}

.appbar {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  height: var(--appbar-height);
  z-index: 900;
}


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
