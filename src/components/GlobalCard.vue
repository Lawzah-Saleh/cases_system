<template>
  <div
    class="setting-card"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="icon-box" aria-hidden="true">
      <slot name="icon" />
    </div>

    <div class="content">
      <div class="title">{{ title }}</div>

      <div v-if="$slots.description" class="description">
        <slot name="description" />
      </div>
    </div>

    <div class="arrow" aria-hidden="true">
      <!-- simple chevron -->
      <svg viewBox="0 0 20 20" fill="currentColor" class="arrow-icon">
        <path
          fill-rule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24c.3.3.3.77 0 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: { type: String, required: true }
})

defineEmits(['click'])
</script>
<style scoped>
.setting-card {
  display: flex;
  align-items: center;
  gap: 14px;

  background: var(--bg-main, #fff);
  border: 1px solid var(--border-soft, #e5e7eb);
  border-radius: var(--radius-md, 12px);

  padding: 16px 18px;
  cursor: pointer;

  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.14s ease;
}

/* Hover */
.setting-card:hover {
  background: var(--bg-soft, #f9fafb);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  transform: translateY(-1px);
  border-color: rgba(245,181,29,0.35);
}

/* Focus (Keyboard accessibility) */
.setting-card:focus-visible {
  outline: none;
  border-color: var(--brand-accent, #F5B51D);
  box-shadow: 0 0 0 3px rgba(245,181,29,0.22);
}

/* Active press */
.setting-card:active {
  transform: translateY(0);
}

/* Icon */
.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;

  display: grid;
  place-items: center;

  background: rgba(245, 181, 29, 0.12);
  color: var(--brand-accent, #F5B51D);
  flex-shrink: 0;
}

/* If the icon is an <i> font-icon */
.icon-box :deep(i) {
  font-size: 18px;
  line-height: 1;
}

/* Text */
.content {
  flex: 1;
  min-width: 0; /* prevents overflow */
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 15.5px;
  font-weight: 600;
  color: var(--text-main, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text-muted, #6b7280);

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Arrow */
.arrow {
  color: var(--text-muted, #6b7280);
  display: grid;
  place-items: center;
  transition: transform 0.18s ease, color 0.18s ease;
}

.arrow-icon {
  width: 18px;
  height: 18px;
}

.setting-card:hover .arrow {
  transform: translateX(4px);
  color: var(--text-main, #111827);
}
</style>
