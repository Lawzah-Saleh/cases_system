<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-small">
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-message">{{ message }}</p>

      <div class="btn-row">
        <button class="btn-secondary" @click="close">Cancel</button>

          <button class="btn-danger" @click="confirmDelete" :disabled="loading">
          {{ loading ? 'Deleting…' : 'Delete' }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Confirm Delete' },
  message: { type: String, required: true }
})

const emit = defineEmits(['close', 'confirm'])

const loading = ref(false)

function confirmDelete() {
  loading.value = true
  emit('confirm', finish)
}

function finish() {
  loading.value = false
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-small {
  width: 420px;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  animation: popIn 0.25s ease;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.modal-message {
  font-size: 15px;
  color: #555;
  margin-bottom: 25px;
}
</style>
