<template>
  <div class="table-wrapper">
    <table class="perf-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Total Cases</th>
          <th>Closed Cases</th>

          <th>Completion %</th>
          <th>Response (min)</th>
          <th>Resolution (hr)</th>

          <th>SLA %</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="e in employees" :key="e.id">

          <!-- Employee -->
          <td class="emp-col">
            <strong>{{ e.name }}</strong>
          </td>

          <!-- Total Cases -->
          <td>{{ e.total_cases }}</td>

          <!-- Closed -->
          <td>{{ e.closed_cases }}</td>

          <!-- Completion Rate -->
          <td>
            <div class="comp-wrapper">
              <div class="comp-bar" :style="{ width: e.completion_rate + '%'}"></div>
              <span class="comp-text">{{ e.completion_rate }}%</span>
            </div>
          </td>

          <!-- Response Time -->
          <td :class="responseClass(e.avg_first_response_time)">
            {{ e.avg_response_time }} 
          </td>

          <!-- Resolution Time -->
          <td>
            {{ e.avg_resolution_time }}
          </td>

          <!-- SLA Rate -->
          <td :class="slaClass(e.sla_rate)">
            {{ e.sla_rate }}%
          </td>

          <!-- Performance Score -->
          <td :class="scoreClass(e.performance_score)">
            <strong>{{ e.performance_score }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
export default {
  props: ["employees"],

  methods: {
    scoreClass(score) {
      if (score >= 85) return "score-high"
      if (score >= 60) return "score-mid"
      return "score-low"
    },

    slaClass(val) {
      if (val >= 90) return "sla-high"
      if (val >= 60) return "sla-mid"
      return "sla-low"
    },

    responseClass(val) {
      if (val <= 5) return "resp-fast"
      if (val <= 30) return "resp-med"
      return "resp-slow"
    }
  }
}
</script>


<style scoped>
.table-wrapper {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.perf-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 12px;
  font-weight: 700;
  border-bottom: 2px solid #f2f2f2;
  background: #fafafa;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
}

/* COMPLETION BAR */
.comp-wrapper {
  position: relative;
  background: #f1f1f1;
  border-radius: 6px;
  height: 10px;
  width: 100%;
}

.comp-bar {
  height: 100%;
  background: #2ecc71;
  border-radius: 6px;
  transition: width .3s ease;
}

.comp-text {
  font-size: 13px;
  margin-left: 6px;
}

/* SLA COLORS */
.sla-high { color: #27ae60; font-weight: bold; }
.sla-mid  { color: #f1c40f; font-weight: bold; }
.sla-low  { color: #e74c3c; font-weight: bold; }

/* RESPONSE COLORS */
.resp-fast { color: #2ecc71; }
.resp-med  { color: #f1c40f; }
.resp-slow { color: #e74c3c; }

/* SCORE COLORS */
.score-high { color: #2ecc71; }
.score-mid  { color: #f1c40f; }
.score-low  { color: #e74c3c; }

.emp-col {
  font-weight: 600;
}
</style>
