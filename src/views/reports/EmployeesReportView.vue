<template>
  <div class="page-container">

    <!-- Title -->
    <h2 class="page-title">Employee Performance Report</h2>


<div class="stats-grid">
  <StatCard title="Top Performer" :value="stats?.highest?.name ?? '—'" color="#27ae60">
    <template #filter>
      <select v-model="filterRange" @change="loadReport">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </template>
  </StatCard>

  <StatCard title="Lowest Performer" :value="stats?.lowest?.name ?? '—'" color="#e74c3c">
    <template #filter>
      <select v-model="filterRange" @change="loadReport">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </template>
  </StatCard>

  <StatCard title="Best Completion Rate" :value="format(stats?.best_completion?.completion_rate, '%')">
    <template #filter>
      <select v-model="filterRange" @change="loadReport">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </template>
  </StatCard>

  <StatCard title="Best SLA" :value="format(stats?.best_sla?.sla_rate, '%')">
    <template #filter>
      <select v-model="filterRange" @change="loadReport">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </template>
  </StatCard>

  <StatCard title="Fastest Response" :value="format(stats?.fastest?.avg_first_response_time, 'min')">
    <template #filter>
      <select v-model="filterRange" @change="loadReport">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </template>
  </StatCard>
</div>


    <!-- CHARTS -->
    <div class="charts-section">
      <PerformanceBarChart :employees="employees" />
      <ResponseChart :employees="employees" />
    </div>
        <div class="report-header-row">
          <!-- Left side: Show / Hide Columns text -->
          <button class="show-hide-btn">
            Show/Hide Columns
          </button>

          <!-- Right side: Export -->
          <button class="download-btn" @click="exportCSV">
            DOWNLOAD EXCEL
          </button>
        </div>

    <!-- EMPLOYEE TABLE -->
    <EmployeePerformanceTable :employees="employees" />

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useAuthStore } from "@/stores/auth"

// Components
import StatCard from "@/components/reports/StatCard.vue"
import PerformanceBarChart from "@/components/reports/PerformanceBarChart.vue"
import ResponseChart from "@/components/reports/ResponseChart.vue"
import EmployeePerformanceTable from "@/components/reports/EmployeePerformanceTable.vue"

const auth = useAuthStore()

const stats = ref({})
const employees = ref([])
const filterRange = ref("month") // default range

// Formatting helper
function format(val, unit) {
  if (val === undefined || val === null) return "—"
  return `${val} ${unit}`
}

async function loadReport() {
  try {
    const res = await axios.get("http://localhost:8000/api/reports/employees", {
      headers: { Authorization: `Bearer ${auth.token}` },
      params: { range: filterRange.value }
    })

    stats.value = res.data.stats
    employees.value = res.data.data

  } catch (err) {
    console.error("Failed loading employee report:", err)
  }
}

onMounted(loadReport)
</script>
<style scoped>
.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 14px;
}

.range-filter {
  margin-bottom: 20px;
  background: #f3f3f7;
  padding: 12px 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.stat-card select {
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  font-size: 12px;
  cursor: pointer;
}


.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-bottom: 30px;
}
.report-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f3f3f7; /* light gray analytics style */
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.show-hide-btn {
  background: transparent;
  border: none;
  color: #2d2d5f;
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.show-hide-btn:hover {
  opacity: 0.8;
}

.download-btn {
  background: var(--primary-color);
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.download-btn:hover {
  background: var(--primary-hover);
}
@media (max-width: 900px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
