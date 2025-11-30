<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Case Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <h3 class="section-title">Case Name</h3>
          <div class="readonly">{{ caseData.title }}</div>
        </div>
        <div class="form-group">
          <h3 class="section-title">Client Name</h3>
          <div class="readonly">{{ caseData.client?.client_name || '—' }}</div>
        </div>
        <div class="form-group full">
          <h3 class="section-title">Description</h3>
          <div class="readonly">{{ caseData.description || '—' }}</div>
        </div>

        <div class="form-group">
          <h3 class="section-title">Type</h3>
          <div class="readonly capitalize">{{ caseData.type }}</div>
        </div>

        <div class="form-group">
          <h3 class="section-title">Way Entry</h3>
          <div class="readonly capitalize">{{ caseData.way_entry }}</div>
        </div>

        <div class="form-group">
          <h3 class="section-title">Status</h3>
          <div class="readonly badge-box">
            <span class="micro-badge" :class="statusClass(caseData.status)">
              {{ caseData.status }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <h3 class="section-title">Priority</h3>
          <div class="readonly badge-box">
    <span
      class="micro-badge"
      :class="priorityClass(caseData.priority?.priority_name?.toLowerCase())"
    >
      {{ caseData.priority?.priority_name ?? '—' }}
    </span>
          </div>
        </div>
      </div>

      <h3 class="section-title">Internal Note</h3>
      <div class="field-box">
        {{ caseData.note || '—' }}
      </div>

      <h3 class="section-title">Assigned Employees</h3>
      <div class="field-box employees-list">
        <p v-for="e in caseData.employees" :key="e.id">• {{ e.first_name }} {{ e.last_name }}</p>
        <p v-if="!caseData.employees?.length">—</p>
      </div>

      <h3 class="section-title">Attachment</h3>
      <div class="field-box">
        <a
          v-if="caseData.attachment_url"
          :href="caseData.attachment_url"
          target="_blank"
          class="attach-link"
        >
          📎 View Attachment
        </a>
        <span v-else>—</span>
      </div>

      <div class="btn-row full">
        <button class="btn-secondary" @click="close">Close</button>
        <button class="btn-primary" @click="edit">Edit Case</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  caseData: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

function edit() {
  emit('edit', props.caseData)
}

function close() {
  emit('close')
}

function statusClass(status) {
  return (
    {
      opened: 'badge-open',
      assigned: 'badge-assigned',
      in_progress: 'badge-progress',
      reassigned: 'badge-reassigned',
      closed: 'badge-closed'
    }[status] || ''
  )
}

function priorityBadgeClass(priority) {
  if (!priority) return ''

  const p = priority.toLowerCase()

  if (p.includes('high')) return 'badge-priority-high'
  if (p.includes('middle')) return 'badge-priority-middle'
  if (p.includes('low')) return 'badge-priority-low'
  if (p.includes('normal')) return 'badge-priority-normal'

  return ''
}

function priorityClass(priorityName) {
  if (!priorityName) return ''

  const name = priorityName.toLowerCase()

  return {
    high: 'badge-high',
    middle: 'badge-middle',
    low: 'badge-low',
    normal: 'badge-normal'
  }[name] || ''
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

.modal-large {
  width: 750px;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 42px rgba(0, 0, 0, 0.15);
  animation: popIn 0.25s ease;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: #444;
}

.section-title {
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--primary-color);
  font-size: 15px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 6px;
}

.full {
  grid-column: span 2;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
  margin-bottom: 5px;
}

.readonly {
  padding: 10px;
  background: #fafafa;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: #333;
  user-select: text;
}

.field-box {
  background: #fafafa;
  padding: 10px 14px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
}

.micro-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  text-transform: capitalize;
}

.micro-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.badge-open {
  background: #fff4e5;
  color: #b45b00;
}
.badge-assigned {
  background: #e7f5ff;
  color: #0b6fb8;
}
.badge-progress {
  background: #fff3cd;
  color: #896100;
}
.badge-reassigned {
  background: #e0e7ff;
  color: #3b3bb3;
}
.badge-closed {
  background: #e6ffed;
  color: #1e7a3b;
}

.badge-high {
  background: #ffe5e5;
  color: #b3261e;
}
.badge-middle {
  background: #fff4e5;
  color: #b45b00;
}
.badge-low {
  background: #e5f6ff;
  color: #006395;
}
.badge-normal {
  background: #edf2ff;
  color: #364fc7;
}

.employees-list p {
  margin: 3px 0;
}

.attach-link {
  color: var(--primary-color);
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: #efefef;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  font-weight: 600;
}

.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
