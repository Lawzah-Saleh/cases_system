<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block font-medium mb-1">Username</label>
          <input v-model="username" type="text" required
                 class="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300">
        </div>

        <div>
          <label class="block font-medium mb-1">Password</label>
          <input v-model="password" type="password" required
                 class="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300">
        </div>
        <button :disabled="loading"
                class="btn w-full bg-blue-600 btn-danger text-white py-2 rounded hover:bg-blue-700 transition">
          {{ loading ? "Processing..." : "Login" }}
        </button>

        <p v-if="error" class="text-red-500 text-center mt-3">{{ error }}</p>
        <!-- Success response -->
<div v-if="response" class="mt-4 p-3 rounded bg-green-100 text-green-800 text-sm">
  <pre>{{ response }}</pre>
</div>

<!-- Error message already exists -->
<p v-if="error" class="text-red-500 text-center mt-3">{{ error }}</p>
<div v-if="token" class="mt-4 p-2 rounded bg-green-100 text-green-700 text-sm break-all">
  <strong>Token:</strong> {{ token }}
</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const response = ref(null)
const token = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  response.value = null

  try {
    const res = await auth.login(username.value, password.value)
    response.value = res        // <- store success data
     token.value = auth.token  // 🔥 assign token to local variable

    // You can also console.log it for debugging
    console.log("Token:", token.value)
  } catch (err) {
    error.value = err.message   // show error message
    response.value = err.raw    // optional: show full response
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
