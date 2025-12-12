<template>
  <div class="chart-box">
    <h4 class="chart-title">Performance Score</h4>

    <apexchart
      type="bar"
      height="320"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []   // ← يمنع أي crash
  }
})

const chartSeries = computed(() => [
  {
    name: 'Performance Score',
    data: props.data.map(item => item.value)
  }
])

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false }
  },
  xaxis: {
    categories: props.data.map(item => item.name),
    labels: { rotate: -45 }
  },
  plotOptions: {
    bar: { columnWidth: '60%' }
  },
  colors: props.data.map(item =>
    item.value >= 85 ? '#2ecc71'
    : item.value >= 60 ? '#f1c40f'
    : '#e74c3c'
  ),
  dataLabels: { enabled: false }
}))
</script>


<style scoped>
.chart-box {
  padding: 20px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}

.chart-title {
  font-size: 18px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .chart-box {
    padding: 15px;
  }

  .chart-title {
    font-size: 16px;
  }
}
</style>
