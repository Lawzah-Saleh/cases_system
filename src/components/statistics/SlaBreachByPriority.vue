<template>
  <div class="sla-breach-card">
    <!-- Header -->
    <div class="sla-header">
      <h4 class="sla-title">SLA Breach by Priority</h4>
      <div class="sla-controls">
        <select v-model="filterRange" @change="loadSlaBreach" class="filter-select">
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
    <div v-if="chartSeries[0].data.length > 0">
      <apexchart
        type="bar"
        height="380"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
    <div v-else class="no-data">
      No data available for the selected period.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import VueApexCharts from "vue3-apexcharts"

const auth = useAuthStore()
const filterRange = ref('month')

// Priority color mapping
const priorityColors = {
  High: '#e74c3c',   // Red
  Middle: '#f39c12', // Orange
  Normal: '#3498db', // Green
  Low: '#27ae60'     // Blue
}

// Chart state
const chartSeries = ref([{ name: 'Breached Cases', data: [] }])
const chartOptions = ref({
  chart: {
    id: 'sla-breach-bar',
    toolbar: { show: true ,
      tools: { download: true },
      
     },
    animations: { enabled: true, easing: 'easeout', speed: 600 }
  },
  plotOptions: { 
    bar: { 
      horizontal: false, 
      columnWidth: '50%', 
      borderRadius: 6,
      distributed: true
    } 
  },
  dataLabels: { 
    enabled: true,
    formatter: val => val,
    style: { fontSize: '12px', colors: ['#fff'] }
  },
  xaxis: { categories: [], title: { text: 'Priority' } },
  yaxis: { title: { text: 'Breached Cases' } },
  tooltip: { y: { formatter: val => `${val} case(s)` } },
  colors: []
})

// Load SLA Breach Data
const loadSlaBreach = async () => {
  try {
    const res = await axios.get(
      'http://localhost:8000/api/statistics/sla-breach-by-priority',
      { params: { range: filterRange.value }, headers: { Authorization: `Bearer ${auth.token}` } }
    )
    const data = res.data.data || []

    chartOptions.value.xaxis.categories = data.map(item => item.priority)
    chartSeries.value[0].data = data.map(item => item.breached_cases)
    chartOptions.value.colors = data.map(item => priorityColors[item.priority] || '#7f8c8d')
  } catch (err) {
    console.error('Failed to load SLA Breach data:', err)
  }
}

// Export Excel
const downloadExcelFile = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/statistics/sla-breach-by-priority/excel',
      { params: { range: filterRange.value }, headers: { Authorization: `Bearer ${auth.token}` }, responseType: 'blob' }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'SLA_Breach_by_Priority.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    console.error('Failed to download Excel file:', err)
  }
}

onMounted(loadSlaBreach)
</script>

<style scoped>
.sla-breach-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
}
.sla-breach-card:hover {
  transform: translateY(-2px);
}

.sla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sla-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.sla-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-weight: 500;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-select:focus {
  border-color: #4f46e5;
  outline: none;
}

.download-btn {
  background-color: #4f46e5;
  color: #fff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.download-btn:hover {
  background-color: #4338ca;
}

.no-data {
  text-align: center;
  font-size: 16px;
  color: #6b7280;
  padding: 60px 0;
}
</style>
