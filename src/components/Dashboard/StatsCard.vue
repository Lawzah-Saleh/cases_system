<template>
  <div class="stats-card">
    <div class="content">
      <div class="left">
        <h4 class="title">{{ title }}</h4>
        <span class="total">{{ total }}</span>
      </div>

      <div class="right">
        <i v-if="icon" :class="['icon', icon]"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  total: Number,

  // optional icon props
  icon: { type: String, default: null }, // for title
  iconNumber: { type: String, default: null } // for number
})
</script>

<style scoped>
.stats-card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.06);
  width: 100%; /* FULL WIDTH */
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.1);
}

/* Layout */
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Title */
.title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* Total number */
.total {
  font-size: 26px;
  font-weight: 700;
  color: #222;
}

/* Icon */
.right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 40px;
  color: #555;
}

/* When screen becomes smaller */
@media (max-width: 900px) {
  .total {
    font-size: 22px;
  }
  .icon {
    font-size: 32px;
  }
}

@media (max-width: 600px) {
  .content {
    flex-direction: row;
  }
  .total {
    font-size: 20px;
  }
}
</style>
