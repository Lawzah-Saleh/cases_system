<template>
  <header class="appbar">
    <div class="appbar-left">
      <button class="hamburger-btn" @click="$emit('toggle')">
        <i class="bi bi-list"></i>
      </button>
    </div>

    <div class="actions">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          v-model="search"
          @input="onSearchInput"
          @keydown="handleKey"
        />

        <i class="bi bi-search search-icon"></i>

        <!-- DROPDOWN -->
        <ul v-if="showDropdown" class="search-dropdown">
          <li
            v-for="(item, index) in filteredSuggestions"
            :key="item.label"
            :class="{ focused: index === focusedIndex }"
            @mousedown.prevent="selectSuggestion(item)"
          >
            <span v-html="highlight(item.label, search)"></span>
          </li>
        </ul>
      </div>

      <button class="icon-btn notification-btn">
        <i class="bi bi-bell"></i>
        <span class="badge">3</span>
      </button>

      <div class="profile" @click="toggleMenu">
        <i class="bi bi-person-circle avatar-icon"></i>

        <div class="profile-info">
          <span class="username">{{ auth.user?.username || 'User' }}</span>
        </div>

        <div v-if="menuOpen" class="profile-menu">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['toggle'])
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchRoutes } from '@/router/searchMap'
import { useAuthStore } from '@/stores/auth'
import axios from '../api/axiosClient'
const auth = useAuthStore()
const router = useRouter()

const search = ref('')
const showDropdown = ref(false)
const focusedIndex = ref(0)
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function logout() {
  try {
    await axios.post(
      '/logout',
      {},
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    )

    auth.logout()
    router.push('/login')
  } catch (err) {
    console.error(err)
  }
}

// AUTO-COMPLETE FILTER
const filteredSuggestions = computed(() => {
  const term = search.value.toLowerCase()

  if (term.length < 2) {
    showDropdown.value = false
    return []
  }

  const matches = searchRoutes.filter(
    (r) => r.label.toLowerCase().includes(term) || r.keywords.some((k) => k.includes(term))
  )

  showDropdown.value = matches.length > 0
  return matches
})

// HIGHLIGHT
function highlight(text, term) {
  if (!term) return text
  const regex = new RegExp(`(${term})`, 'gi')
  return text.replace(regex, '<strong>$1</strong>')
}

// SELECT BY CLICK / ENTER
function selectSuggestion(item) {
  search.value = ''
  showDropdown.value = false
  router.push(item.route)
}

// ON TYPE
function onSearchInput() {
  showDropdown.value = search.value.length >= 2
  focusedIndex.value = 0
}

// KEYBOARD NAVIGATION
function handleKey(e) {
  if (!showDropdown.value || filteredSuggestions.value.length === 0) return

  if (e.key === 'ArrowDown') {
    focusedIndex.value = (focusedIndex.value + 1) % filteredSuggestions.value.length
  } else if (e.key === 'ArrowUp') {
    focusedIndex.value =
      (focusedIndex.value - 1 + filteredSuggestions.value.length) % filteredSuggestions.value.length
  } else if (e.key === 'Enter') {
    selectSuggestion(filteredSuggestions.value[focusedIndex.value])
  }
}
</script>

<style scoped>
:root {
  --appbar-height: 60px;
  --appbar-bg: #ffffff;
  --appbar-text: #333;
  --appbar-border: #e0e0e0;
}

.search-dropdown {
  position: absolute;
  top: 42px;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 9999;
  list-style: none;
  padding: 6px 0;
  margin: 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  max-height: 220px;
  overflow-y: auto;
}

.search-dropdown li {
  padding: 10px 14px;
  cursor: pointer;
  display: block;
  transition: 0.15s;
}

.search-dropdown li:hover,
.search-dropdown li.focused {
  background: #f3f5fa;
}

strong {
  color: var(--primary-color);
}
.avatar-icon {
  font-size: 25px;
  color: var(--appbar-text);
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-right: 20px;
}

.profile-menu {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-width: 140px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  z-index: 2000;
}

.profile-menu button {
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.profile-menu button:hover {
  background: #f3f5fa;
}

.profile-info {
  display: flex;
  flex-direction: column;
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
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

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
