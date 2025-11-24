<template>
  <div v-if="filters.length" class="filter-tags-bar">
    <div v-for="f in filters" :key="f.key" class="tag">
      {{ f.label }}
      <span class="remove" @click="$emit('remove', f.key)">×</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: {
    type: Array,
    default: () => []
  }
});
defineEmits(['remove']);
</script>

<style scoped>
.filter-tags-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #e6e6e6;
  margin-bottom: 20px;
}

.tag {
  background: #e9e7ff;
  color: #4b32c3;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag .remove {
  cursor: pointer;
  font-weight: bold;
}
</style>
