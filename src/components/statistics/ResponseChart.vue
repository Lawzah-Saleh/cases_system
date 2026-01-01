<template>
  <div class="chart-box">
    <h4 class="chart-title">Average First Response Time (Minutes)</h4>

    <apexchart
      type="line"
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
    default: () => []
  }
})

const chartSeries = computed(() => [
  {
    name: 'Response Time (min)',
    data: props.data.map(item => item.value)
  }
])

const chartOptions = computed(() => ({
 chart: {
    type: 'line',
    toolbar: {
      show: true,
      tools: { download: true }
    },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif'
  },

  colors: ['#3b82f6'], // Blue (calm & professional)

  stroke: {
    width: 3,
    curve: 'smooth'
  },

  markers: {
    size: 5,
    colors: ['#3b82f6'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 7 }
  },

  xaxis: {
    categories: props.data.map(item => item.name),
    labels: {
      rotate: -30,
      style: {
        fontSize: '12px',
        colors: '#6b7280'
      }
    }
  },

  yaxis: {
    labels: {
      formatter: val => `${val} min`,
      style: { colors: '#6b7280' }
    }
  },

  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4
  },

  tooltip: {
    y: {
      formatter: val => `${val} minutes`
    }
  },

  dataLabels: { enabled: false },

  legend: { show: false }
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
