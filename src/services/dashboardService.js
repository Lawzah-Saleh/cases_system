// src/services/dashboardService.js

import axios from 'axios'
import { useAuthStore } from '../stores/auth'

function token() {
  return {
    headers: {
      Authorization: `Bearer ${useAuthStore().token}`
    }
  }
}

export default {
  getCasesPerDay(range) {
    return axios.get(`http://localhost:8000/api/dashboard/cases-per-day?range=${range}`, token())
  },

  getCasesByStatus(range) {
    return axios.get(`http://localhost:8000/api/dashboard/cases-by-status?range=${range}`, token())
  },

  getCasesByPriority(range) {
    return axios.get(
      `http://localhost:8000/api/dashboard/cases-by-priority?range=${range}`,
      token()
    )
  },

  getCasesByType(range) {
    return axios.get(`http://localhost:8000/api/dashboard/cases-by-type?range=${range}`, token())
  },

  getCasesByWayEntry(range) {
    return axios.get(`http://localhost:8000/api/dashboard/cases-by-way-entry?range=${range}`, token())
  },

  getTopClients(range) {
    return axios.get(`http://localhost:8000/api/dashboard/top-clients?range=${range}`, token())
  },

  getCards(range) {
    return axios.get(`http://localhost:8000/api/dashboard/cards?range=${range}`, token())
  },

  getCompletionRate(range) {
    return axios.get(`http://localhost:8000/api/dashboard/completion-rate?range=${range}`, token())
  }
}
