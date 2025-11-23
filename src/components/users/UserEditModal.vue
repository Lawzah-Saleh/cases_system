<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-large">

      <div class="modal-header">
        <h3>Edit User</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">Modify the user’s information below.</p>

      <form @submit.prevent="submit" class="form-grid">

        <div class="form-group full">
          <label>Username</label>
          <input v-model="form.username" required />
          <p v-if="errors.username" class="error-text">{{ errors.username[0] }}</p>
        </div>

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

        <div class="form-group full">
          <label>Status</label>
          <select v-model="form.status" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p v-if="errors.status" class="error-text">{{ errors.status[0] }}</p>
        </div>

        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? "Saving…" : "Save Changes" }}
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
import { reactive, ref, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";

const props = defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(["close", "updated"]);
const auth = useAuthStore();

const loading = ref(false);
const roles = ref([]);
const errors = reactive({});

const form = reactive({
  username: "",
  role_id: "",
  status: "",
});

watch(
  () => props.user,
  (u) => {
    if (u) {
      form.username = u.username;
      form.role_id = u.role_id;
      form.status = u.status;
    }
  },
  { immediate: true }
);

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
  errors.role_id = null;
  errors.status = null;

  try {
    loading.value = true;

    await axios.put(
      `http://localhost:8000/api/users/${props.user.id}`,
      form,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    toast.success("User updated successfully!", { autoClose: 2000 });

    emit("updated");
    close();
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors);
      const firstError = Object.values(err.response.data.errors)[0][0];
      toast.error(firstError, { autoClose: 2500 });
    } else {
      toast.error("Server error. Try again later.", { autoClose: 2500 });
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadRoles);
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
  width: 520px;
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
  margin-top: 4px;
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.full {
  grid-column: span 1;
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
