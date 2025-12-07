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
      <i v-if="icon" :class="['icon', icon]"></i>
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

// LOCAL COPY (this fixes your error)
const localValue = ref(props.modelValue)

// keep local updated when parent changes
watch(
  () => props.modelValue,
  (val) => (localValue.value = val)
)

// emit change to parent
function emitChange() {
  emit('update:modelValue', localValue.value)
}
</script>

<style scoped>
.stats-card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.06);
  width: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.1);
}

/* TOP RIGHT AREA (select + icon) */
.top-right {
  position: absolute;
  top: 14px;
  right: 14px;

  display: flex;
  align-items: center;
  gap: 10px;
}

.top-right select {
  padding: 4px 6px;
  border-radius: 6px;
  border: none;
  background-color: #f1f2f6;
  font-size: 13px;
}

/* CONTENT LEFT SIDE */
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
  color: #333;
}

.total {
  font-size: 26px;
  font-weight: 700;
  color: #222;
}

.icon {
  padding-right: 20px;
  font-size: 40px;
  color: #555;
}
</style>
