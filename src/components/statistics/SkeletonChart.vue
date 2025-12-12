<template>
  <div class="skeleton-chart shimmer"></div>
</template>

<style scoped>
.skeleton-chart {
  height: 320px;
  border-radius: 14px;
  background: #f0f0f0;
}

.shimmer {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f5f5f5 37%,
    #e0e0e0 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
</style>
