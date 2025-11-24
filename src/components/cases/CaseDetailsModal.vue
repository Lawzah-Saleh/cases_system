<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- Header -->
      <div class="modal-header">
        <h3>Case Details</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Full information about this support case.</p>

      <!-- Avatar -->
      <div class="avatar-wrapper">
        <img :src="clientAvatar" class="avatar-img" alt="client" />
      </div>

      <!-- Case Title -->
      <h2 class="case-title">{{ caseItem.title }}</h2>

      <!-- Client Name -->
      <p class="case-client">Client: {{ caseItem.client?.client_name ?? '—' }}</p>

      <!-- Badges -->
      <div class="badges-row">
        <span class="badge type">{{ caseItem.type }}</span>
        <span class="badge status" :class="caseItem.status">{{ caseItem.status }}</span>
        <span class="badge priority" :class="caseItem.priority">{{ caseItem.priority }}</span>
      </div>

      <!-- DETAILS GRID -->
      <div class="details-grid">

        <div class="row">
          <label>ID</label>
          <p>{{ caseItem.id }}</p>
        </div>

        <div class="row">
          <label>Entry Way</label>
          <p>{{ caseItem.way_entry }}</p>
        </div>

        <div class="row">
          <label>Description</label>
          <p>{{ caseItem.description }}</p>
        </div>

        <div class="row">
          <label>Created At</label>
          <p>{{ caseItem.created_at }}</p>
        </div>

        <div class="row">
          <label>Updated At</label>
          <p>{{ caseItem.updated_at }}</p>
        </div>

      </div>

      <!-- Notes -->
      <div class="notes-box" v-if="caseItem.note">
        <label>Notes</label>
        <p>{{ caseItem.note }}</p>
      </div>

      <!-- Attachment -->
      <div class="attachment-box" v-if="caseItem.attachment">
        <label>Attachment</label>
        <a :href="caseItem.attachment" target="_blank" class="attach-link">View Attachment</a>
      </div>

      <!-- TEAM MEMBERS -->
      <div class="team-box">
        <label>Team Members</label>

        <div class="team-list">
          <span v-for="emp in caseItem.employees" :key="emp.id" class="team-chip">
            {{ emp.first_name.charAt(0) }}{{ emp.last_name.charAt(0) }}
          </span>
        </div>

        <button class="assign-btn" @click="assign">Assign Employees</button>
      </div>

      <!-- Buttons -->
      <div class="btn-row">
        <button class="btn-primary" @click="edit">Edit Case</button>
        <button class="btn-secondary" @click="close">Close</button>
      </div>

    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  caseItem: { type: Object, required: true }
});

const emit = defineEmits(["close", "edit", "assign"]);

function close() {
  emit("close");
}

function edit() {
  emit("edit", props.caseItem);
}

function assign() {
  emit("assign", props.caseItem);
}

const clientAvatar = "/images/avatar.png";
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-large {
  width: 650px;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: popIn .25s ease;
  position: relative;
}

/* Header */
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
}

.modal-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 18px;
}

/* Avatar */
.avatar-wrapper {
  display: flex;
  justify-content: center;
}

.avatar-img {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  border: 3px solid var(--primary-color);
  object-fit: cover;
  margin-bottom: 15px;
}

/* Case Title */
.case-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
}

.case-client {
  text-align: center;
  color: #555;
  margin-bottom: 18px;
}

/* Badges */
.badges-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.badge {
  padding: 5px 14px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
}

.badge.type { background: #5b6dff; }
.badge.priority.high { background: red; }
.badge.priority.middle { background: orange; }
.badge.priority.low { background: green; }
.badge.priority.normal { background: gray; }

.badge.status.opened { background: #666; }
.badge.status.assigned { background: #007bff; }
.badge.status.in_progress { background: #ff9800; }
.badge.status.reassigned { background: #9c27b0; }
.badge.status.closed { background: #2e7d32; }

/* Details grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.row label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.row p {
  font-size: 15px;
  font-weight: 500;
  color: #222;
}

/* Notes */
.notes-box, .attachment-box {
  margin-bottom: 20px;
}

.attach-link {
  color: var(--primary-color);
}

/* Team Members */
.team-box {
  margin-bottom: 25px;
}

.team-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 10px 0;
}

.team-chip {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.assign-btn {
  background: #f3f3f3;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* Buttons */
.btn-row {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 10px 22px;
  background: var(--primary-color);
  border-radius: var(--radius-md);
  color: white;
}

.btn-secondary {
  padding: 10px 22px;
  background: #eaeaea;
  border-radius: var(--radius-md);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
