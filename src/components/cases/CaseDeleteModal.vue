<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content small-modal">
      <h3 class="modal-title">Delete Case</h3>

      <p class="modal-text">
        Are you sure you want to delete this support case? 
        <br />
        <strong>{{ caseData.title }}</strong>
      </p>

      <div class="btn-row">
        <button class="btn-secondary" @click="close">Cancel</button>
        <button class="btn-danger" @click="confirmDelete" :disabled="loading">
          {{ loading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  caseData: { type: Object, required: true }
})

const emit = defineEmits(['close', 'deleted'])

const loading = ref(false)

function close() {
  emit('close')
}

async function confirmDelete() {
  if (loading.value) return
  loading.value = true

  try {
    const token = useAuthStore().token
    await axios.delete(`http://localhost:8000/api/cases/${props.caseData.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    emit('deleted', props.caseData.id)
    close()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.small-modal {
  width: 420px;
  padding: 30px;
  border-radius: 16px;
  background: white;
  animation: popIn .25s ease;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.modal-text {
  font-size: 15px;
  color: #555;
  margin-bottom: 22px;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-danger {
  background: #e63946;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-danger:hover {
  background: #c72b37;
}

.btn-secondary {
  background: #efefef;
  padding: 10px 22px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 600;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to   { opacity: 1; transform: scale(1);   }
}
</style>
