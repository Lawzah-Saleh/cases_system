import { defineStore } from 'pinia'
import axios from '../api/axiosClient'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loaded: false
  }),

  actions: {
    async fetchNotifications() {
      const res = await axios.get('/notifications')
      this.notifications = res.data.notifications
      this.unreadCount = res.data.unread_count
      this.loaded = true
    },

    async markAsRead(id) {
      await axios.post(`/notifications/${id}/read`)
      const n = this.notifications.find((n) => n.id === id)
      if (n) {
        n.read_at = new Date().toISOString()
        this.unreadCount = Math.max(this.unreadCount - 1, 0)
      }
    },

    async markAllAsRead() {
      const unread = this.notifications.filter((n) => !n.read_at)

      for (const n of unread) {
        await this.markAsRead(n.id)
      }

      this.unreadCount = 0
    }
  }
})
