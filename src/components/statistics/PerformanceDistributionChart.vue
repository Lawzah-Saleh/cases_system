<template>
  <div class="chart-box">
    <h4 class="chart-title">Performance Distribution</h4>

    <!-- Empty State -->
    <div v-if="total === 0" class="empty-state">
      <i class="bi bi-pie-chart"></i>
      <p>No performance data available</p>
    </div>

    <!-- Donut Chart -->
    <apexchart
      v-else
      type="donut"
      height="320"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from "vue"

/**
 * Props
 * distribution = {
 *   high: Number,
 *   medium: Number,
 *   low: Number
 * }
 */
const props = defineProps({
  distribution: {
    type: Object,
    required: true,
    default: () => ({
      high: 0,
      medium: 0,
      low: 0
    })
  }
})

// Total for empty-state check
const total = computed(() =>
  props.distribution.high +
  props.distribution.medium +
  props.distribution.low
)

// Donut series
const series = computed(() => [
  props.distribution.high,
  props.distribution.medium,
  props.distribution.low
])

// Chart options
const chartOptions = computed(() => ({
    chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      }
    }
  },
  labels: ["High (85–100)", "Medium (60–84)", "Low (<60)"],
  colors: ["#22c55e", "#f59e0b", "#ef4444"],
  legend: {
    position: 'bottom',
    fontSize: '13px',
    markers: {
      radius: 6
    },
    itemMargin: {
      horizontal: 10,
      vertical: 6
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(1)}%`
  },
  tooltip: {
    y: {
      formatter: (value, { seriesIndex }) => {
        const percentage = total.value
          ? ((value / total.value) * 100).toFixed(1)
          : 0
        return `${value} employees (${percentage}%)`
      }
    }
  },
  plotOptions: {
  pie: {
    donut: {
      size: '68%',
      labels: {
        show: true,
        name: {
          fontSize: '14px',
          color: '#6b7280'
        },
        value: {
          fontSize: '22px',
          fontWeight: 600,
          color: '#111827'
        },
        total: {
          show: true,
          label: 'Employees',
          fontSize: '13px',
          color: '#6b7280',
          formatter: () => total.value
        }
      }
    }
  }
}

}))
</script>

<style scoped>
.chart-box {
  padding: 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
}

.empty-state {
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.empty-state i {
  font-size: 36px;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 14px;
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
