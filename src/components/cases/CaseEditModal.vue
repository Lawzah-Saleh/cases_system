<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h3>Edit Support Case</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <form @submit.prevent="updateCase">
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

          <!-- Note -->
          <div class="form-group full">
            <h3 class="section-title">Note</h3>
            <textarea
              v-model="form.note"
              class="input textarea"
              placeholder="Add internal note (optional)"
            ></textarea>
          </div>

          <!-- Client -->
          <div class="form-group">
            <h3 class="section-title">Client</h3>
            <select v-model="form.client_id" class="input">
              <option disabled value="">Select Client</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.client_name }}
              </option>
            </select>
          </div>

          <!-- Type -->
          <div class="form-group">
            <h3 class="section-title">Type</h3>
            <select v-model="form.type" class="input">
              <option disabled value="">Select Type</option>
              <option v-for="t in types" :key="t">{{ t }}</option>
            </select>
          </div>

          <!-- Priority -->
          <div class="form-group">
            <h3 class="section-title">Priority</h3>
            <select v-model="form.priority_id" class="input">
              <option disabled value="">Select Priority</option>
              <option v-for="p in priorities" :key="p.id" :value="p.id">
                {{ p.priority_name }}
              </option>
            </select>
          </div>



          <!-- Attachment -->
          <div class="form-group full">
            <h3 class="section-title">Replace Attachment (optional)</h3>
            <input type="file" @change="handleFile" class="input" />
          </div>
        </div>

        <div class="btn-row full">
          <button class="btn-secondary" type="button" @click="close">
            Cancel
          </button>
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? "Updating..." : "Update Case" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const props = defineProps({
  caseData: { type: Object, required: true },
});

const emit = defineEmits(["close", "updated"]);

const loading = ref(false);

const types = [
  "technical",
  "service_request",
  "delay",
  "miscommunication",
  "enquery",
  "others",
];

const clients = ref([]);
const employees = ref([]);
const priorities = ref([]);

const form = ref({
  title: "",
  description: "",
  note: "",
  client_id: "",
  type: "",
  priority_id: "",
  employee_ids: [],
  attachment: null,
});

onMounted(async () => {
  const token = useAuthStore().token;

  clients.value = (
    await axios.get("http://localhost:8000/api/clients", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data.data;

  employees.value = (
    await axios.get("http://localhost:8000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data.data;

  priorities.value = (
    await axios.get("http://localhost:8000/api/priorities", {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;

  // fill form
  form.value = {
    title: props.caseData.title,
    description: props.caseData.description,
    note: props.caseData.note ?? "",
    client_id: props.caseData.client_id,
    type: props.caseData.type,
    priority_id: props.caseData.priority_id,
    employee_ids: props.caseData.employees?.map((e) => e.id) ?? [],
    attachment: null,
  };
});

function close() {
  emit("close");
}

function handleFile(e) {
  form.value.attachment = e.target.files[0];
}

async function updateCase() {
  if (loading.value) return;
  loading.value = true;

  try {
    const fd = new FormData();
    fd.append("_method", "PUT");

    for (const key in form.value) {
      if (key === "employee_ids") {
        form.value.employee_ids.forEach((id) =>
          fd.append("employee_ids[]", id)
        );
      } else if (key === "attachment" && !form.value.attachment) {
        continue;
      } else {
        fd.append(key, form.value[key]);
      }
    }

    const token = useAuthStore().token;

    const res = await axios.post(
      `http://localhost:8000/api/cases/${props.caseData.id}`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Case updated!");

    emit("updated");
    close();
  } catch (err) {
    toast.error(err.response?.data?.message ?? "Update failed");
  } finally {
    loading.value = false;
  }
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
  z-index: 99999;
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

.btn-secondary {
  background: #efefef;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  font-weight: 600;
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
