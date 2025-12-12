<template>
  <div
    class="stat-card"
    :class="{ clickable }"
    :style="{ borderColor: color }"
    @click="handleClick"
    @mouseenter="$emit('mouse-enter', title)"
    @mouseleave="$emit('mouse-leave', title)"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
  >
    <!-- Header -->
    <div class="stat-header">
      <div class="stat-title">{{ title }}</div>
      <slot name="filter"></slot>
    </div>
<div v-if="$slots.info" class="stat-info">
  <slot name="info"></slot>
</div>

    <!-- Value -->
    <div class="stat-value" :style="{ color }">
      {{ value }}
    </div>

    <!-- Subtitle -->
    <div v-if="$slots.subtitle" class="stat-subtitle">
      <slot name="subtitle" />
    </div>

    <!-- Trend -->
    <div v-if="trend !== undefined" class="trend" :class="trendClass">
      <span v-if="trend > 0">▲ {{ trend }}%</span>
      <span v-else-if="trend < 0">▼ {{ Math.abs(trend) }}%</span>
      <span v-else>—</span>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    color: { type: String, default: '#2d2d2d' },
    trend: Number,
    clickable: Boolean
  },

  computed: {
    trendClass() {
      if (this.trend > 0) return 'trend-up'
      if (this.trend < 0) return 'trend-down'
      return 'trend-flat'
    }
  },

  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('click')
      }
    }
  }
}
</script>


<style scoped>
.stat-card {
  padding: 18px;
  background: #fff;
  border-left: 4px solid;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.06);
  transition: all 0.25s ease;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-title {
  font-size: 13px;
  font-weight: 600;
  color: #777;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
}

.stat-subtitle {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}

.trend {
  font-size: 12px;
  margin-top: 6px;
  font-weight: 600;
}

.trend-up { color: #2ecc71; }
.trend-down { color: #e74c3c; }
.trend-flat { color: #999; }



.stat-card:hover .tooltip {
  opacity: 1;
}
.stat-info {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}


</style>
