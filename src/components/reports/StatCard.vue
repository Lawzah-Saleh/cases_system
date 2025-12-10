<template>
  <div class="stat-card" :style="{ borderColor: color }">

    <div class="stat-header">
      <div class="stat-title">{{ title }}</div>

      <!-- SLOT FOR FILTER -->
      <slot name="filter"></slot>
    </div>

    <div class="stat-value" :style="{ color: color }">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    value: String,
    color: {
      type: String,
      default: "#2d2d2d"
    }
  }
}
</script>

<style scoped>
.stat-card {
  padding: 18px;
  background: white;
  border-left: 4px solid;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-size: 14px;
  font-weight: 600;
  color: #777;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
}
</style>
