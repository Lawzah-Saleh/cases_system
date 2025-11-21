<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <!-- Header -->
      <div class="modal-header">
        <h3>Create Employee</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Fill the information below to register a new employee.</p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">
        <!-- Username -->
<div class="form-group">
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
<div class="form-group full">
  <label>Confirm Password</label>
  <input type="password" v-model="form.password_confirmation" required />
</div>

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
            {{ loading ? "Creating…" : "Create Employee" }}
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
toast.success("Employee created successfully!", {
  autoClose: 2000,
});
toast.error("Error creating employee", {
  autoClose: 2500,
});

const errors = reactive({});

const emit = defineEmits(["close", "created"]);
const auth = useAuthStore();

const loading = ref(false);
const roles = ref([]);

const form = reactive({
  username: "",
  password: "",
  password_confirmation: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  gender: "",
  phone: "",
  role_id: "",
});

async function loadRoles() {
  const res = await axios.get("http://localhost:8000/api/roles", {
    headers: { Authorization: `Bearer ${auth.token}` },
  });
roles.value = res.data.roles;
}

function close() {
  emit("close");
}

async function submit() {
  errors.username = null;
  errors.email = null;
  errors.phone = null;
  errors.role_id = null;
  errors.password = null;

  try {
    loading.value = true;

    await axios.post(
      "http://localhost:8000/api/employees",
      form,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    toast.success("Employee created successfully!", {
      autoClose: 2000,
    });

    emit("created");
    close();

  } catch (err) {

    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors);

      const firstError = Object.values(err.response.data.errors)[0][0];

      toast.error(firstError, {
        autoClose: 2500,
      });
    } else {
      toast.error("Server error. Try again later.", {
        autoClose: 2500,
      });
    }

  } finally {
    loading.value = false;
  }
}


onMounted(loadRoles);
</script>

<style scoped>
/* SAME DESIGN AS EDIT MODAL */
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
  margin-top: 4px;
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
  font-size: 14px;
  margin-bottom: 6px;
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
  justify-content: flex-start;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-secondary {
  background: #e4e4e4;
  border: none;
  padding: 10px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--primary-hover);
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
