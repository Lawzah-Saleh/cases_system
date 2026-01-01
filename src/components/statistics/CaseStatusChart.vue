<template>
  <div class="case-status-chart-card">
    <div class="chart-header">
      <h4>Case Counts & Status</h4>
        <div class="chart-filters">
        <select v-model="filterRange" @change="loadCaseCounts">
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
        </select>
        </div>

    </div>



    <apexchart
      type="bar"
      height="380"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const filterRange = ref('month')

const chartSeries = ref([{ name: 'Cases', data: [] }])
const chartOptions = ref({
  chart: { id: 'case-status-bar', toolbar: { show: true ,tools: { download: true }, } },
  plotOptions: { 
    bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 } ,
  },
  dataLabels: { enabled: true ,  style: { fontSize: '14px', fontWeight: 'bold' } },
  xaxis: { categories: ['Opened', 'Assigned', 'In Progress', 'Reassigned', 'Closed'], title: { text: 'Status' } },
  yaxis: { title: { text: 'Case Counts' } },
  tooltip: { y: { formatter: (val) => `${val} case(s)`, title: { formatter: (seriesName) => `Status: ${seriesName}` }} },
  colors: ['#3498db', '#f39c12', '#8e44ad', '#e67e22', '#2ecc71']
  
})

const loadCaseCounts = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/statistics/case-status', {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: { range: filterRange.value } // نفس الطريقة المستخدمة في البطاقات الأخرى
    })

    const data = res.data || {}
    chartSeries.value[0].data = [
      data.opened || 0,
      data.assigned || 0,
      data.in_progress || 0,
      data.reassigned || 0,
      data.closed || 0
    ]
  } catch (err) {
    console.error('Failed to load case counts', err)
  }
}


onMounted(loadCaseCounts)
</script>

<style scoped>
.case-status-chart-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}
.chart-filters {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-filters select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

</style>
