<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- Header -->
      <div class="modal-header">
        <h3>Create User</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Fill the information below to create a new system user.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">

        <!-- Username -->
        <div class="form-group full">
          <label>Username</label>
          <input v-model="form.username" required />
          <p v-if="errors.username" class="error-text">{{ errors.username[0] }}</p>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" required />
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            v-model="form.password_confirmation"
            required
          />
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

        <!-- Employee (optional linking) -->
        <div class="form-group full">
          <label>Assign Employee (Optional)</label>
          <select v-model="form.employee_id">
            <option value="">No Employee</option>
            <option v-for="e in employees" :key="e.id" :value="e.id">
              {{ e.first_name }} {{ e.last_name }}
            </option>
          </select>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? "Creating…" : "Create User" }}
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
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";

const emit = defineEmits(["close", "created"]);
const auth = useAuthStore();

const loading = ref(false);

// Data Lists
const roles = ref([]);
const employees = ref([]);

// Error container
const errors = reactive({});

// Form
const form = reactive({
  username: "",
  password: "",
  password_confirmation: "",
  role_id: "",
  employee_id: "",
});

// Load roles
async function loadRoles() {
  const res = await axios.get("http://localhost:8000/api/roles", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  roles.value = res.data.roles;
}

// Load employees (optional linking user → employee)
async function loadEmployees() {
  const res = await axios.get("http://localhost:8000/api/employees", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  employees.value = res.data.data; // paginated
}

function close() {
  emit("close");
}

async function submit() {
  Object.keys(errors).forEach((k) => (errors[k] = null));

  try {
    loading.value = true;

    await axios.post(
      "http://localhost:8000/api/users",
      form,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    toast.success("User created successfully!");
    emit("created");
    close();

  } catch (err) {
    console.error(err.response?.data);

    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors);
      toast.error("Validation error, please check the fields.");
    } else {
      toast.error("Failed to create user.");
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRoles();
  loadEmployees();
});
</script>

<style scoped>
/* SAME DESIGN AS OTHER MODALS */
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
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-size: 22px;
  color: var(--primary-color);
  font-weight: 700;
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
.error-text {
  color: red;
  font-size: 13px;
  margin-top: 4px;
}
@keyframes popIn {
  from { opacity:0; transform:scale(.92); }
  to { opacity:1; transform:scale(1); }
}
</style>
