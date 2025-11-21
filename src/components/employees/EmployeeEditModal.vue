<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- Header -->
      <div class="modal-header">
        <h3>Edit Employee</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Modify the employee information below.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">

        <!-- First Name -->
        <div class="form-group">
          <label>First Name</label>
          <input v-model="form.first_name" required />
          <p v-if="errors.first_name" class="error-text">{{ errors.first_name[0] }}</p>
        </div>

        <!-- Middle Name -->
        <div class="form-group">
          <label>Middle Name</label>
          <input v-model="form.middle_name" />
          <p v-if="errors.middle_name" class="error-text">{{ errors.middle_name[0] }}</p>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label>Last Name</label>
          <input v-model="form.last_name" required />
          <p v-if="errors.last_name" class="error-text">{{ errors.last_name[0] }}</p>
        </div>

        <!-- Email -->
        <div class="form-group full">
          <label>Email</label>
          <input type="email" v-model="form.email" required />
          <p v-if="errors.email" class="error-text">{{ errors.email[0] }}</p>
        </div>

        <!-- Gender -->
        <div class="form-group">
          <label>Gender</label>
          <select v-model="form.gender" required>
            <option value="">Choose…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <p v-if="errors.gender" class="error-text">{{ errors.gender[0] }}</p>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label>Phone</label>
          <input v-model="form.phone" required />
          <p v-if="errors.phone" class="error-text">{{ errors.phone[0] }}</p>
        </div>

        <!-- Role -->
        <div class="form-group full">
          <label>Role</label>
          <select v-model="form.role_id" required>
            <option value="">Select Role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
              {{ r.role_name }}
            </option>
          </select>
          <p v-if="errors.role_id" class="error-text">{{ errors.role_id[0] }}</p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? "Updating…" : "Update Employee" }}
          </button>

          <button type="button" class="btn-secondary" @click="close">
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  employee: { type: Object, required: true }
});

const emit = defineEmits(["close", "updated"]);
const auth = useAuthStore();

const loading = ref(false);
const roles = ref([]);
const errors = reactive({});

// form data
const form = reactive({
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  gender: "",
  phone: "",
  role_id: "",
});

// Sync employee data
watch(
  () => props.employee,
  (emp) => {
    if (!emp) return;
    form.first_name = emp.first_name;
    form.middle_name = emp.middle_name;
    form.last_name = emp.last_name;
    form.email = emp.email;
    form.gender = emp.gender;
    form.phone = emp.phone;
    form.role_id = emp.user?.role_id ?? "";
  },
  { immediate: true }
);

// Load roles
async function loadRoles() {
  const res = await axios.get("http://localhost:8000/api/roles", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });
  roles.value = res.data.roles;
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null));

  try {
    loading.value = true;

    await axios.put(
      `http://localhost:8000/api/employees/${props.employee.id}`,
      form,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    toast.success("Employee updated successfully!");

    emit("updated");
    close();

  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors);
      toast.error("Validation error.");
    } else {
      toast.error("Error updating employee.");
    }
  } finally {
    loading.value = false;
  }
}

function close() {
  emit("close");
}

onMounted(loadRoles);
</script>


<style scoped>
/* SAME STYLE AS CREATE */
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
  width: 550px;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: popIn 0.25s ease;
  position: relative;
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
}

.modal-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
}

input,
select {
  padding: 10px;
  border: 1px solid var(--table-border);
  border-radius: var(--radius-md);
  font-size: 14px;
}

.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
}

.btn-secondary {
  background: #e4e4e4;
  padding: 10px 22px;
  border: none;
  border-radius: var(--radius-md);
}

.btn-primary:hover {
  background: var(--primary-hover);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
