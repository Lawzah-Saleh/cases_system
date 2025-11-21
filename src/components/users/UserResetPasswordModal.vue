<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content modal-small">

      <!-- HEADER -->
      <div class="modal-header">
        <h3>Reset Password</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <p class="modal-subtitle">
        Reset password for user <strong>{{ user.username }}</strong>.
      </p>

      <!-- FORM -->
      <form @submit.prevent="submit" class="form-grid">

        <!-- New Password -->
        <div class="form-group full">
          <label>New Password</label>
          <input type="password" v-model="form.password" required />
          <p v-if="errors.password" class="error-text">{{ errors.password[0] }}</p>
        </div>

        <!-- Confirm -->
        <div class="form-group full">
          <label>Confirm Password</label>
          <input
            type="password"
            v-model="form.password_confirmation"
            required
          />
          <p
            v-if="errors.password_confirmation"
            class="error-text"
          >
            {{ errors.password_confirmation[0] }}
          </p>
        </div>

        <!-- BUTTONS -->
        <div class="btn-row full">
          <button class="btn-primary" type="submit" :disabled="loading">
            {{ loading ? "Resetting…" : "Reset Password" }}
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
import { reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue3-toastify";

const props = defineProps({
  user: { type: Object, required: true }
});

const emit = defineEmits(["close"]);
const auth = useAuthStore();

const loading = ref(false);
const errors = reactive({});

const form = reactive({
  password: "",
  password_confirmation: "",
});

function close() {
  emit("close");
}

async function submit() {
  Object.keys(errors).forEach((key) => (errors[key] = null));

  try {
    loading.value = true;

    await axios.post(
      `http://localhost:8000/api/users/${props.user.id}/reset-password`,
      form,
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );

    toast.success("Password reset successfully!");
    close();

  } catch (err) {
    console.error(err.response?.data);

    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors);
      toast.error("Validation error!");
    } else {
      toast.error("Failed to reset password.");
    }

  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Same style as other modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-small {
  width: 420px;
}

.modal-content {
  background: white;
  padding: 28px;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: popIn .25s ease;
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
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
}

input {
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

.error-text {
  color: red;
  font-size: 13px;
  margin-top: 4px;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
