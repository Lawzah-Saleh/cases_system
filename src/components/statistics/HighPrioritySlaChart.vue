<template>
  <div class="chart-card">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const series = computed(() => [
  {
    name: 'SLA %',
    data: props.data.map(e => e.value)
  }
])

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6
    }
  },
  xaxis: {
    categories: props.data.map(e => e.name),
    max: 100,
    title: {
      text: 'SLA Percentage'
    }
  },
  annotations: {
    xaxis: [
      {
        x: 90,
        borderColor: '#e74c3c',
        label: {
          text: 'SLA Threshold (90%)',
          style: {
            color: '#fff',
            background: '#e74c3c'
          }
        }
      }
    ]
  },
  colors: props.data.map(e =>
    e.value >= 95 ? '#2ecc71'
    : e.value >= 90 ? '#f1c40f'
    : '#e74c3c'
  ),
  tooltip: {
    y: {
      formatter: val => `${val}%`
    }
  }
}))
</script>

<style scoped>
.chart-card {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
}
</style>
