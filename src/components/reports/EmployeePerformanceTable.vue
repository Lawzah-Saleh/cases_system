<template>
  <div class="table-wrapper">
    <table class="perf-table">
      <thead>
        <tr>
          <th @click="sortTable('name')">Employee</th>
          <th @click="sortTable('total_cases')">Total Cases</th>
          <th @click="sortTable('closed_cases')">Closed Cases</th>
          <th @click="sortTable('completion_rate')">Completion %</th>
          <th @click="sortTable('avg_first_response_time')">Response (min)</th>
          <th @click="sortTable('avg_resolution_time')">Resolution (hr)</th>
          <th @click="sortTable('sla_rate')">SLA %</th>
          <th @click="sortTable('performance_score')">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in sortedEmployees" :key="e.id">
          <td class="emp-col">
            <strong>{{ e.name }}</strong>
          </td>
          <td>{{ e.total_cases.toLocaleString() }}</td>
          <td>{{ e.closed_cases.toLocaleString() }}</td>
          <td>
            <div class="comp-wrapper">
              <div class="comp-bar" :style="{ width: e.completion_rate + '%'}"></div>
              <span class="comp-text">{{ e.completion_rate.toFixed(2) }}%</span>
            </div>
          </td>
          <td :class="responseClass(e.avg_first_response_time)">
            {{ e.avg_first_response_time.toFixed(2) }} min
          </td>
          <td>{{ e.avg_resolution_time.toFixed(2) }} hr</td>
          <td :class="slaClass(e.sla_rate)">
            {{ e.sla_rate.toFixed(2) }}%
          </td>
          <td :class="scoreClass(e.performance_score)">
            <strong>{{ e.performance_score.toFixed(2) }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["employees"],
  data() {
    return {
      sortKey: 'performance_score', // Default sorting
      sortOrder: 'desc' // Default descending order
    }
  },
  computed: {
    sortedEmployees() {
      return this.employees.slice().sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return a[this.sortKey] - b[this.sortKey];
        } else {
          return b[this.sortKey] - a[this.sortKey];
        }
      });
    }
  },
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
    },
    sortTable(key) {
      // Toggle sort order if the same column is clicked
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc'; // default to ascending
      }
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
  overflow-x: auto;
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
  cursor: pointer;
}

th:hover {
  background-color: #f1f1f1;
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

@media (max-width: 768px) {
  .perf-table {
    font-size: 14px;
  }
}
</style>
