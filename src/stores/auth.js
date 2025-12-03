import { defineStore } from 'pinia'
import axios from '../api/axiosClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    role: null,
    permissions: []
  }),

  actions: {
    async login(username, password) {
      try {
        const res = await axios.post('/login', { username, password })

        const user = res.data.user
        const roleName = user.role?.role_name?.toLowerCase() || null

        const perms = user.role?.permissions?.map((p) => p.permission_name.toLowerCase()) || []

        this.token = res.data.token
        this.user = user
        this.role = roleName
        this.permissions = perms

        localStorage.setItem('token', this.token)

        return res.data
      } catch (err) {
        const message = err.response?.data?.message || 'Login failed'
        throw {
          success: false,
          message,
          raw: err.response?.data || null
        }
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.role = null
      this.permissions = []
      localStorage.removeItem('token')
    }
  },
  getters: {
    can: (state) => (perm) => state.permissions.includes(perm.toLowerCase()),
    isRole: (state) => (role) => state.role === role.toLowerCase()
  }
})
