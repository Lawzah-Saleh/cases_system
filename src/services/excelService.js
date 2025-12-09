// src/services/excelService.js
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

function getAuthHeaders() {
  const authStore = useAuthStore()
  return {
    Authorization: `Bearer ${authStore.token}`
  }
}

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function downloadExcel(endpoint, filename) {
  // endpoint مثال: '/dashboard/cases-per-priority/excel?range=month'
  const response = await axios.get(`http://localhost:8000/api${endpoint}`, {
    responseType: 'blob',
    headers: getAuthHeaders()
  })

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  triggerDownload(blob, filename)
}
