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
    response.value = res        
     token.value = auth.token  

 
    console.log("Token:", token.value)
   router.push('/app/dashboard')

  } catch (err) {
    if (err.message == "Invalid credentials")
    error.value = "Invalid credentials"  

    else 
    error.value = "login Failed. Try again."
    response.value = err.raw    
  } finally {
    loading.value = false
  }
}
</script>






<template>
  <div class="login-wrapper">
   
    <div class="login-container">
      
     
      <div class="login-card">
         
          <img 
            src="@/assets/temmamLogo.png" 
            alt="logo"
            class="logo"
          >
         
    
        <form @submit.prevent="handleLogin" class="form">

         
          <div class="form-group">
            <label>Username</label>
            <input 
              v-model="username" 
              type="text" 
              required
            >
          </div>

       
          <div class="form-group">
            <label>Password</label>
            <input 
              v-model="password" 
              type="password" 
              required
            >
          </div>

         
          <button :disabled="loading" class="submit-btn">
            {{ loading ? "Processing..." : "Sign in" }}
          </button>

          
          <p v-if="error" class="error">{{ error }}</p>

         
        
          <div v-if="token" class="token-box">
            <strong>Token:</strong> {{ token }}
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>

:global(body) {
  background: #f4f6fa !important; 
  margin: 0;
  padding: 0;
}


.login-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}




.login-card {
  width: 450px;
  background: #ffffff;
  padding: 35px 32px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.05);
  text-align: center;
}





.logo {
  width: 300px;
}




.form {
  width: 100%;
}

.form-group {
  text-align: left;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  background-color: #f4f6fa;
  border-radius: 7.22px;
  border-color: transparent;
  font-size: 13px;
  transition: 0.2s;
}

.form-group input:focus {
  border-color: #2b3a67;
  outline: none;
}


.submit-btn {
  width: 100%;
  background: #1f1c47; 
  color: white;
  padding: 10px 0;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:hover {
  background: #151433;
}

.submit-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}


.error {
  color: #d9534f;
  margin-top: 12px;
  font-size: 14px;
}

.success-box,
.token-box {
  background: #e6f7e9;
  color: #176c29;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  font-size: 13px;
  word-break: break-all;
}


</style>


