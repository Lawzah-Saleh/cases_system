<template>
  <header class="appbar">
    <!-- Left: Hamburger + Logo -->
    <div class="appbar-left">
      <button class="hamburger-btn" @click="$emit('toggle')">
        <i class="bi bi-list"></i>
        
      </button>
    </div>

    <!-- Center: Search -->


    <!-- Right: Actions -->
    <div class="actions">
          <div class="search-box">
      <input type="text" placeholder="Search..." />
      <i class="bi bi-search search-icon"></i>
    </div>
      <button class="icon-btn"><i class="bi bi-brightness-high"></i></button>
      <button class="icon-btn notification-btn">
        <i class="bi bi-bell"></i>
        <span class="badge">3</span>
      </button>
      <div class="profile">
        <img src="https://via.placeholder.com/35" class="avatar" />
        <span class="username">John Doe</span>
      </div>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['toggle'])
</script>

<style scoped>
:root {
  --appbar-height: 60px;
  --appbar-bg: #ffffff;
  --appbar-text: #333;
  --appbar-border: #e0e0e0;
}

/* Appbar layout */
.appbar {
  height: var(--appbar-height);
  background: var(--appbar-bg);
  border-bottom: 1px solid var(--appbar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  font-family: 'Segoe UI', sans-serif;
}

/* Left: Hamburger + logo */
.appbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hamburger-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--appbar-text);
  cursor: pointer;
  display: none;
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: block;
  }
}

/* Logo */
.logo {
  height: 40px;
  width: auto;
  display: block;
}

/* Search box */
.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 8px 35px 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: var(--bg-light);
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #007bff; /* Highlight عند التركيز */
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888; /* يمكن تغييره للتماشي مع اللون */
}


/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  color: var(--appbar-text);
}

.notification-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 50%;
}

/* Profile */
.profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
}

.username {
  display: none;
  font-weight: 500;
  color: var(--appbar-text);
}

/* Show username on desktop */
@media (min-width: 769px) {
  .username {
    display: inline;
  }
}
</style>
