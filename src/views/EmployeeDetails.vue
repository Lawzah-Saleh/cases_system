<template>
  <div class="details-overlay">
    <div class="details-card">

      <button class="details-close" @click="$emit('close')">×</button>

      <div class="details-avatar">
        {{ employee.name.charAt(0) }}
      </div>

      <h2 class="details-name">{{ employee.name }}</h2>
      <p class="details-role">{{ employee.role }}</p>

      <div class="details-grid">
        <p><strong>Email:</strong> {{ employee.email }}</p>
        <p><strong>Phone:</strong> {{ employee.phone }}</p>

        <p><strong>City:</strong> {{ employee.city }}</p>
        <p><strong>Gender:</strong> {{ employee.gender }}</p>

        <p><strong>Username:</strong> {{ employee.username }}</p>
        <p><strong>ID:</strong> {{ employee.id }}</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeDetails",
  props: {
    employee: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.details-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(2px);
}

.details-card {
  width: 420px;
  background: white;
  padding: 30px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--table-border);
  box-shadow: 0 10px 35px rgba(0,0,0,0.1);
  position: relative;
  animation: fadePop 0.25s ease;
}

@keyframes fadePop {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.details-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.details-avatar {
  width: 85px;
  height: 85px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin: 0 auto 12px auto;
}

.details-name {
  text-align: center;
  font-size: 20px;
  margin-bottom: 3px;
}

.details-role {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 14px;
}
</style>
