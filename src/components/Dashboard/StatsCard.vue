<template>
  <div class="stats-card">
    <div class="top-right">
      <select v-model="localValue" @change="emitChange">
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
    </div>

    <div class="content">
      <div class="left">
        <h4 class="title">{{ title }}</h4>
        <span class="total">{{ total }}</span>
      </div>
      <div v-if="icon" class="icon-wrapper">
        <i :class="['icon', icon]"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: String,
  total: [String, Number],
  icon: String,
  modelValue: { type: String, default: 'month' }
})

const emit = defineEmits(['update:modelValue'])
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => (localValue.value = val))

function emitChange() {
  emit('update:modelValue', localValue.value)
}
</script>

<style scoped>
:root {
  --primary-color: #190f4a;
  --brand-accent: #F5B51D;
}

.stats-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff, #fbfbfd);
  border-radius: 18px;
  padding: 22px;
  width: 100%;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-6px);
  box-shadow: 0px 14px 28px rgba(0, 0, 0, 0.12);
}

/* Top-right select */
.top-right {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-right select {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-size: 13px;
  color: var(--primary-color);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.top-right select:hover {
  border-color: var(--primary-color);
}

/* Content */
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-color);
}

.total {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  background: rgba(245, 181, 29, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.icon-wrapper:hover {
  transform: scale(1.1);
}

.icon {
  font-size: 28px;
  color: var(--brand-accent);
}
</style>
