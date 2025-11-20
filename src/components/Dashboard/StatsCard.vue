<template>
  <div class="stats-card">

    <!-- blob background -->
    <div class="blob"></div>

    <div class="content">
      <!-- title -->
      <h4 class="title">{{ title }}</h4>

      <!-- values -->
      <div class="numbers">
        <span class="current">{{ current }}</span>
        <span class="slash">/</span>
        <span class="total">{{ total }}</span>
      </div>

      <!-- trend -->
      <div class="trend">
        <i
          class="bx"
          :class="trend > 0 ? 'bx-trending-up up' : 'bx-trending-down down'"
        ></i>

        <span class="trend-value" :class="trend > 0 ? 'up' : 'down'">
          {{ trend }}%
        </span>

        <span class="trend-text">{{ trendText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  current: Number,
  total: Number,
  trend: Number,
  trendText: String,
})
</script>

<style scoped>
.stats-card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 280px;
  min-width: 240px;
  display: flex;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

/* Professional hover effect */
.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.10);
}

/* Yellow blob */
.blob {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 58px;
  height: 46px;
  background: #fdecc8;
  opacity: 0.7;
  border-radius: 50%;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* Title */
.title {
  font-size: 15px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

/* Number Line */
.numbers {
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.current {
  color: #1a1a1a;
}

.slash {
  margin: 0 6px;
  color: #999;
}

.total {
  color: #333;
  font-weight: 500;
}

/* Trend section */
.trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.up {
  color: #24c18f;
}

.down {
  color: #e84343;
}

.trend-text {
  color: #555;
  font-size: 12px;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .stats-card {
    max-width: 100%;
    min-width: 100%;
  }

  .numbers {
    font-size: 24px;
  }
}
</style>
