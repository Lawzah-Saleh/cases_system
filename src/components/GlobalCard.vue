<template>
  <div class="setting-card" @click="$emit('click')">
    <div class="icon-box">
      <slot name="icon"></slot>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true }
})
</script>

<style scoped>
.setting-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: 0.2s;
}

.setting-card:hover {
  background: #f8f9fa;
}

.icon-box {
  width: 45px;
  height: 45px;
  background: #f8c930;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>