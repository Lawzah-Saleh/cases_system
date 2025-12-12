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
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    categories: props.data.map(item => item.name),
    labels: { rotate: -40 }
  },
  dataLabels: { enabled: false },
  markers: { size: 4 }
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
