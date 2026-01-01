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
    default: () => []
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
    type: 'bar',
    toolbar: {
      show: true,
      tools: { download: true }
    },
    fontFamily: 'Inter, sans-serif'
  },

  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '45%',
      distributed: false,
      colors: {
        ranges: [
          {
            from: 0,
            to: 55,
            color: '#ef4444'
          },
          {
            from: 60,
            to: 84,
            color: '#6366f1'
          },
          {
            from: 85,
            to: 100,
            color: '#22c55e'
          }
        ]
      }
    }
  },

  dataLabels: {
    enabled: true,
    formatter: (val) => `${val}%`,
    style: {
      fontSize: '12px',
      colors: ['#374151']
    }
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
    max: 100,
    labels: {
      style: { colors: '#6b7280' }
    }
  },

  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4
  },

  tooltip: {
    y: {
      formatter: (val) => `${val}%`
    }
  },

  legend: { show: false }
}))
</script>
<style scoped>
.chart-box {
  padding: 22px;
  background: linear-gradient(180deg, #ffffff, #fafafa);
  border-radius: 18px;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.6);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 14px;
}

@media (max-width: 768px) {
  .chart-box {
    padding: 16px;
  }

  .chart-title {
    font-size: 16px;
  }
}
</style>
