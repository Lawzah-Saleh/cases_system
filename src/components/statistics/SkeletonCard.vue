<template>
  <div class="skeleton-card">
    <div class="skeleton-title shimmer"></div>
    <div class="skeleton-value shimmer"></div>
    <div class="skeleton-subtitle shimmer"></div>
  </div>
</template>

<style scoped>
.skeleton-card {
  padding: 18px;
  background: #f5f6f7;
  border-radius: 12px;
  border-left: 4px solid #ddd;
  height: 110px;
}

.skeleton-title {
  width: 60%;
  height: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
}

.skeleton-value {
  width: 40%;
  height: 22px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.skeleton-subtitle {
  width: 50%;
  height: 10px;
  border-radius: 6px;
}

/* shimmer animation */
.shimmer {
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f0f0f0 37%,
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
