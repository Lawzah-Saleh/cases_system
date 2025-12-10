<template>
  <div class="chart-box">
    <apexchart
      width="100%"
      height="320"
      type="line"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from "vue"


const props = defineProps({
  employees: Array
})

const series = computed(() => [
  {
    name: "Avg Response Time (min)",
    data: props.employees.map(e => e.avg_response_time ?? 0)
  }
])

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: {
    categories: props.employees.map(e => `${e.first_name}`),
    labels: { rotate: -45 }
  },
  colors: ["#0087ff"],
  stroke: {
    curve: "smooth",
    width: 3
  },
  markers: {
    size: 4,
    colors: ["#0087ff"]
  }
}))
</script>

<style scoped>
.chart-box {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
