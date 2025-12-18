<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Case Details</h3>
        <button class="modal-close-btn" @click="close">×</button>
      </div>

      <div class="modal-form-grid">
        <div class="form-group">
          <h3 class="modal-section-title">Case Name</h3>
          <div class="readonly">{{ caseData.title }}</div>
        </div>
        <div class="form-group">
          <h3 class="modal-section-title">Client Name</h3>
          <div class="readonly">{{ caseData.client?.client_name || '—' }}</div>
        </div>
        <div class="form-group input-full">
          <h3 class="modal-section-title">Description</h3>
          <div class="readonly">{{ caseData.description || '—' }}</div>
        </div>

        <div class="form-group">
          <h3 class="modal-section-title">Type</h3>
          <div class="readonly capitalize">{{ caseData.type }}</div>
        </div>

        <div class="form-group">
          <h3 class="modal-section-title">Way Entry</h3>
          <div class="readonly capitalize">{{ caseData.way_entry }}</div>
        </div>

        <div class="form-group">
          <h3 class="modal-section-title">Status</h3>
          <div class="readonly badge-box">
            <span class="micro-badge" :class="statusClass(caseData.status)">
              {{ caseData.status }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <h3 class="modal-section-title">Priority</h3>
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

      <h3 class="modal-section-title">Internal Note</h3>
      <div class="field-box">
        {{ caseData.note || '—' }}
      </div>

    <h3 class="section-title">Assigned Employees</h3>

    <div class="employees-container">

      <div
        v-for="e in caseData.employees"
        :key="e.id"
        class="employee-card"
      >
        <!-- EMPLOYEE HEADER -->
        <div class="emp-header">
          <span class="emp-dot">•</span>
          <span class="emp-name">{{ e.first_name }} {{ e.last_name }}</span>
        </div>

        <!-- STATUS -->
        <p class="emp-status">
          <strong>Status:</strong>

          <span v-if="e.case_status === 'closed'" class="status-badge closed">
            <i class="icon">🔒</i> Closed
          </span>

          <span v-else-if="e.case_status === 'accepted'" class="status-badge accepted">
            <i class="icon">✔️</i> Accepted
          </span>

          <span v-else class="status-badge pending">
            <i class="icon">⏳</i> Pending
          </span>
        </p>

        <!-- TIMELINE -->
        <div class="timeline-box" v-if="e.timeline?.length">
          <strong class="timeline-title">
            <i class="icon-small">🕒</i> Timeline
          </strong>
          <ul class="timeline-list">
            <li v-for="t in e.timeline" :key="t.time">
              <span class="tl-time">{{ formatDate(t.time) }}</span>
              –
              <span class="tl-action">{{ readableAction(t.action) }}</span>
            </li>
          </ul>
        </div>

      </div>

      <p v-if="!caseData.employees?.length">—</p>
    </div>


      <h3 class="modal-section-title">Attachment</h3>
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

      <div class="btn-row input-full">
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
function formatDate(date) {
  if (!date) return "—"
  return new Date(date).toLocaleString()
}


/* ==============================
   TRANSLATE ACTION NAME
============================== */
function readableAction(action) {
  const map = {
    created: "Case created",
    assigned: "Employee assigned",
    assign_to_me: "Assigned to employee",
    case_accepted: "Case accepted",
    reassigned: "Reassigned",
    removed_employee: "Employee removed",
    closed: "Case closed"
  }
  return map[action] || action
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

  return (
    {
      high: 'badge-high',
      middle: 'badge-middle',
      low: 'badge-low',
      normal: 'badge-normal'
    }[name] || ''
  )
}
</script>

<style scoped>
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
/* Container */
.employees-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Each Employee Card */
.employee-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  padding: 14px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* Header */
.emp-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.emp-dot {
  font-size: 20px;
  line-height: 0;
  margin-right: 6px;
  color: #6c63ff;
}

.emp-name {
  font-size: 15px;
  font-weight: 600;
  color: #222;
}

/* Status badges */
.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-badge.accepted {
  background: #e6ffed;
  color: #1e7a3b;
}

.status-badge.closed {
  background: #ffe6e6;
  color: #b3261e;
}

.status-badge.pending {
  background: #fff4e5;
  color: #b45b00;
}

/* Timeline */
.timeline-box {
  margin-top: 10px;
  background: #fafafa;
  padding: 10px 12px;
  border-left: 3px solid #6c63ff;
  border-radius: 6px;
}

.timeline-title {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.timeline-list {
  margin: 6px 0 0 0;
  padding-left: 18px;
}

.timeline-list li {
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}

.tl-time {
  color: #555;
  font-weight: 500;
}

.tl-action {
  color: #111;
  font-weight: 600;
}

.icon-small {
  margin-right: 4px;
}

</style>
