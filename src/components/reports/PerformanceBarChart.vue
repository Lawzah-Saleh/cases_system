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
import { computed } from "vue"

const props = defineProps({
  employees: { type: Array, required: true }
})

const chartSeries = computed(() => [
  {
    name: "Performance Score",
    data: props.employees.map(e => e.performance_score)
  }
])

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false }
  },
  xaxis: {
    categories: props.employees.map(e => e.name),
    labels: { rotate: -45 }
  },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "60%" }
  },
  colors: ["#3498db"],
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
