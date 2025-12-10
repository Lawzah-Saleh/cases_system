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
import { computed } from "vue"

const props = defineProps({
  employees: { type: Array, required: true }
})

const chartSeries = computed(() => [
  {
    name: "Response Time (min)",
    data: props.employees.map(e => e.avg_first_response_time)
  }
])

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  stroke: { width: 3, curve: "smooth" },
  xaxis: {
    categories: props.employees.map(e => e.name),
    labels: { rotate: -40 }
  },
  colors: ["#e67e22"],
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
</style>
