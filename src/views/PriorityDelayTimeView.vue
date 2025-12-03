<template>
  <div class="table-container">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="main-header">
        <span class="link-back" @click="$router.back()">Setting</span> / Cases Delay Time
      </h2>
    </div>

    <!-- ===== FILTERS ===== -->
    <div class="filters-wrapper">
      <input type="text" class="search-input" placeholder="Search..." v-model="search" />
    </div>

    <table class="custom-table">
      <thead>
        <tr class="table-header-row">
          <th>id</th>
          <th>Priority Name</th>
          <th>Priority Delay time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(priority, index) in priorities" :key="priority.id">
          <td>{{ index + 1 }}</td>

          <td>{{ priority.priority_name }}</td>
          <td>{{ priority.delay_time }}</td>

          <td class="action-cell">
            <div class="menu-trigger" @click="toggleMenu(priority.id)">⋮</div>
            <div v-if="openMenu === priority.id" class="menu-dropdown">
              <div class="menu-item" @click="startEdit(priority)">Edit</div>
              <div class="menu-item delete" @click="deletepriority(priority)">Delete</div>
            </div>
          </td>
        </tr>

        <!-- ===== NO DATA STATE ===== -->
        <tr v-if="!isLoading && priorities.length === 0">
          <td colspan="7" style="text-align: center; padding: 20px; color: #777">
            No priorities found.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container mt-4 flex items-center justify-between">
      <p class="text-result">{{ priorities.length }} results</p>
    </div>
  </div>

  <PriorityEditModal
    v-if="openEdit"
    :priority="selectedPriority"
    @close="openEdit = false"
    @updated="handleRefresh"
  />
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import PriorityEditModal from '@/components/priorities/PriorityEditModal.vue'
export default {
  components: { PriorityEditModal },
  watch: {
    search() {
      this.debounceSearch()
    }
  },
  data() {
    return {
      search: '',
      priorities: [],
      openMenu: null,
      openCreate: false,
      openEdit: false,
      selectedPriority: null,
      openPriorityDetailsModal: false,
      isLoading: false
    }
  },
  methods: {
    openDetails(priority) {
      this.selectedPriority = priority
      this.openPriorityDetailsModal = true
    },

    startEdit(priority) {
      this.selectedPriority = JSON.parse(JSON.stringify(priority))
      this.openEdit = true
    },

    debounceSearch() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchpriorities()
      }, 400)
    },
    handleRefresh() {
      this.fetchpriorities()
    },
    toggleMenu(id) {
      this.openMenu = this.openMenu === id ? null : id
    },

    async deletepriority(priority) {
      if (!confirm('Delete this priority?')) return

      try {
        const token = useAuthStore().token

        await axios.delete(`http://localhost:8000/api/priorities/${priority.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        toast.success('priority deleted successfully!', {
          autoClose: 1500
        })

        await new Promise((resolve) => setTimeout(resolve, 500))

        this.handleRefresh()
      } catch (e) {
        console.error(e)
        toast.error('Failed to delete priority.', { autoClose: 2000 })
      }
    },

    async fetchpriorities() {
      try {
        this.isLoading = true

        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('token')

        const res = await axios.get('http://localhost:8000/api/priorities', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: this.search
          }
        })

        this.priorities = res.data
      } catch (err) {
        console.error('Error fetching priorities:', err)
      } finally {
        this.isLoading = false // ← أضف هذا دائمًا لإطفاء حالة التحميل
      }
    },

    handleClickOutside(event) {
      const menuElements = document.querySelectorAll('.menu-dropdown, .menu-trigger')
      let clickedInside = false
      menuElements.forEach((el) => {
        if (el.contains(event.target)) clickedInside = true
      })
      if (!clickedInside) this.openMenu = null
    }
  },
  mounted() {
    this.fetchpriorities()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.filter-button {
  padding-bottom: 20px;
  cursor: pointer;
  color: var(--primary-color);
  border: none;
  background-color: transparent;
  text-decoration: underline;
  font-size: 18px;
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 40px;
  row-gap: 20px;
  margin-bottom: 30px;
}

.filter-dropdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 50px;
  border-radius: 8px;
  width: 600px;
  z-index: 2000;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 18px;
}

.model {
  background-color: white;
  display: block;
}

.action-cell {
  position: relative;
}

.user-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
}

.menu-trigger {
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  user-select: none;
}
.menu-dropdown {
  position: absolute;
  top: 80%;
  right: 50%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}
.menu-item {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}
.menu-item:hover {
  background: #f4f4f4;
}
.delete {
  color: red;
}

/* Flex helpers */
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}

.client-logo {
  width: 80px;
  border-radius: 50%;
}

.pagination-container {
  display: flex;
  justify-content: space-between; /* push items to edges */
  align-items: center; /* vertically center them */
  margin-top: 1rem;
}

.page-btn {
  padding: 5px 20px;
  border-radius: 6px;
  border-color: gray;
  background-color: white;
  cursor: pointer;
  margin-left: 5px;
}

.link-back {
  cursor: pointer;
  color: gray;
  font-weight: 700;
}
.link-back:hover {
  text-decoration: underline;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-result {
  font-weight: bold;
}

.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  background: #fff;
  width: 200px;
}
</style>
