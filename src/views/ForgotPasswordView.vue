<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <header class="auth-header">
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Te enviaremos un enlace para restablecerla</p>
        </header>

        <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              autocomplete="email"
              :aria-invalid="errors.email ? 'true' : 'false'"
            />
            <span v-if="errors.email" class="error-message" role="alert">{{ errors.email }}</span>
          </div>

          <div v-if="authError" class="auth-error" role="alert">{{ authError }}</div>
          <div v-if="successMessage" class="success-message" role="alert">{{ successMessage }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Enviar enlace</span>
          </button>
        </form>

        <footer class="auth-footer">
          <p>¿Recordaste tu contraseña? <router-link to="/login">Inicia sesión</router-link></p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: ''
})

const errors = ref({})
const authError = ref('')
const successMessage = ref('')
const loading = ref(false)

function validateForm() {
  errors.value = {}
  let isValid = true

  if (!form.value.email) {
    errors.value.email = 'El email es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Formato de email inválido'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  authError.value = ''
  successMessage.value = ''
  if (!validateForm()) return

  loading.value = true
  try {
    const result = await authStore.forgotPassword(form.value.email)
    if (result.success) {
      successMessage.value = result.message
      form.value.email = ''
    } else {
      authError.value = result.error
    }
  } catch (err) {
    authError.value = err.response?.data?.message || 'Error al enviar solicitud'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

.form-group input[aria-invalid="true"] {
  border-color: #e53935;
}

.error-message {
  font-size: 0.8rem;
  color: #e53935;
}

.auth-error {
  padding: 0.75rem 1rem;
  background: #fdeaea;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
  color: #c62828;
  font-size: 0.9rem;
  text-align: center;
}

.success-message {
  padding: 0.75rem 1rem;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 0.5rem;
  color: #2e7d32;
  font-size: 0.9rem;
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #e91e63;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #c2185b;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #e91e63;
  font-weight: 500;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>