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
  labels: ["High (85–100)", "Medium (60–84)", "Low (<60)"],
  colors: ["#2ecc71", "#f1c40f", "#e74c3c"],
  legend: {
    position: "bottom",
    fontSize: "14px"
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(1)}%`
  },
  tooltip: {
    y: {
      formatter: (value) => `${value} employees`
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Employees",
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
