import { defineStore } from 'pinia'
import axios from '../api/axiosClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  
  actions: {
   async login(username, password) {
  try {
    const res = await axios.post('/login', { username, password })

    this.token = res.data.token
    this.user = res.data.user

    localStorage.setItem('token', this.token)

    // return full response to UI
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
      localStorage.removeItem('token')
    }
  }
})
