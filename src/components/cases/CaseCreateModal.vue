<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- ================= HEADER ================= -->
      <div class="modal-header">
        <h3>Create New Support Case</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <!-- ================= FORM GRID ================= -->
      <div class="form-grid">

        <!-- Case Title -->
        <div class="form-group full">
          <h3 class="section-title">Case Title</h3>
          <input
            type="text"
            v-model="form.title"
            class="input"
            placeholder="Enter Case Name"
          />
        </div>

        <!-- Description -->
        <div class="form-group full">
          <h3 class="section-title">Description</h3>
          <textarea
            v-model="form.description"
            class="input textarea"
            placeholder="Case Description"
          ></textarea>
        </div>

        <!-- Client -->
        <div class="form-group">
          <h3 class="section-title">Client</h3>
          <select v-model="form.client_id" class="input">
            <option disabled value="">Select Client</option>
            <option
              v-for="c in clients"
              :key="c.id"
              :value="c.id"
            >
              {{ c.client_name }}
            </option>
          </select>
        </div>

        <!-- Type -->
        <div class="form-group">
          <h3 class="section-title">Type</h3>
          <select v-model="form.type" class="input">
            <option disabled value="">Select Type</option>
            <option v-for="t in types" :key="t.id" :value="t.name">
              {{ t.name }}
            </option>
          </select>
        </div>

        <!-- Way Entry -->
        <div class="form-group">
          <h3 class="section-title">Way Entry</h3>
          <select v-model="form.way_entry" class="input">
            <option disabled value="">Select</option>
            <option v-for="w in ways" :key="w.id" :value="w.name">
              {{ w.name }}
            </option>
          </select>
        </div>

        <!-- Priority -->
        <div class="form-group">
          <h3 class="section-title">Priority</h3>
          <select v-model="form.priority" class="input">
            <option disabled value="">Select Priority</option>
            <option v-for="p in priorities" :key="p.id" :value="p.name">
              {{ p.name }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div class="form-group">
          <h3 class="section-title">Status</h3>
          <select v-model="form.status" class="input">
            <option disabled value="">Select Status</option>
            <option v-for="s in statuses" :key="s.id" :value="s.name">
              {{ s.name }}
            </option>
          </select>
        </div>

        <!-- Employees -->
        <div class="form-group full">
          <h3 class="section-title">Assigned Employees</h3>
          <select v-model="form.employee_ids" class="input" multiple>
            <option
              v-for="e in employees"
              :key="e.id"
              :value="e.id"
            >
              {{ e.first_name }} {{ e.last_name }}
            </option>
          </select>
        </div>

        <!-- Attachment -->
        <div class="form-group full">
          <h3 class="section-title">Attachment</h3>
          <input type="file" @change="handleFile" class="input" />
        </div>

      </div>

      <!-- ================= BUTTONS ================= -->
      <div class="btn-row full">
        <button class="btn-secondary" @click="close">Cancel</button>
        <button class="btn-primary" @click="createCase">Create Case</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  clients: Array,
  employees: Array,
  types: Array,
  ways: Array,
  priorities: Array,   // priority from DB
  statuses: Array,     // statuses from DB
});

const emit = defineEmits(["close", "created"]);

function close() {
  emit("close");
}

const form = ref({
  title: "",
  description: "",
  client_id: "",
  type: "",
  way_entry: "",
  priority: "",
  status: "",
  employee_ids: [],
  attachment: null,
});

function handleFile(e) {
  form.value.attachment = e.target.files[0];
}

async function createCase() {
  const token = useAuthStore().token;

  const fd = new FormData();
  for (const key in form.value) {
    if (key === "employee_ids") {
      form.value[key].forEach((id) => fd.append("employee_ids[]", id));
    } else {
      fd.append(key, form.value[key]);
    }
  }

  const res = await axios.post("http://localhost:8000/api/cases", fd, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  emit("created", res.data);
  close();
}
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
  width: 750px;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 42px rgba(0,0,0,0.15);
  animation: popIn 0.25s ease;
  max-height: 90vh;
  overflow-y: auto;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
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

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.full {
  grid-column: span 2;
}

.section-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 6px;
  font-size: 15px;
}

.input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--table-border);
  width: 100%;
  font-size: 14px;
}

.textarea {
  min-height: 90px;
}

/* Buttons */
.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
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

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
