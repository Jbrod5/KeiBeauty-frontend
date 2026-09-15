<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <header class="auth-header">
          <h1 v-if="paso === 'credenciales'">Iniciar Sesión</h1>
          <h1 v-else>Verificar Código</h1>
          <p v-if="paso === 'credenciales'">Accede a tu cuenta KeiBeauty</p>
          <p v-else>Te enviamos un código de 6 dígitos a <strong>{{ email }}</strong></p>
        </header>

        <form @submit.prevent="handleSubmit" class="auth-form" novalidate v-if="paso === 'credenciales'">
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

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              autocomplete="current-password"
              :aria-invalid="errors.password ? 'true' : 'false'"
            />
            <span v-if="errors.password" class="error-message" role="alert">{{ errors.password }}</span>
          </div>

          <div v-if="authError" class="auth-error" role="alert">{{ authError }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>

        <form @submit.prevent="handleVerify" class="auth-form" novalidate v-else>
          <div class="form-group">
            <label for="codigo">Código de 6 dígitos</label>
            <input
              id="codigo"
              type="text"
              v-model="codigo"
              required
              maxlength="6"
              autocomplete="one-time-code"
              inputmode="numeric"
              :aria-invalid="errors.codigo ? 'true' : 'false'"
              @input="formatCodigo"
              placeholder="000000"
            />
            <span v-if="errors.codigo" class="error-message" role="alert">{{ errors.codigo }}</span>
          </div>

          <div v-if="authError" class="auth-error" role="alert">{{ authError }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading || codigo.length < 6">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Verificar</span>
          </button>

          <div class="resend-section">
            <button 
              type="button" 
              class="btn btn-link" 
              @click="reenviarCodigo"
              :disabled="resendDisabled || loading"
            >
              <span v-if="resendDisabled">Reenviar en {{ resendCountdown }}s</span>
              <span v-else>Reenviar código</span>
            </button>
            <p class="resend-note">No recibiste el código? Revisa tu carpeta de spam.</p>
          </div>

          <button type="button" class="btn btn-outline btn-block back-btn" @click="volverACredenciales" :disabled="loading">
            Volver
          </button>
        </form>

        <footer class="auth-footer" v-if="paso === 'credenciales'">
          <p>¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
          <p class="forgot-password"><router-link to="/olvide-contrasena">¿Olvidaste tu contraseña?</router-link></p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const paso = ref('credenciales') // 'credenciales' | 'codigo'
const email = ref('')

const form = ref({
  email: '',
  password: ''
})

const codigo = ref('')

const errors = ref({})
const authError = ref('')
const loading = ref(false)

const resendDisabled = ref(false)
const resendCountdown = ref(0)

const resendInterval = ref(null)

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

  if (!form.value.password) {
    errors.value.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

function validateCodigo() {
  errors.value.codigo = ''
  if (!codigo.value) {
    errors.value.codigo = 'El código es obligatorio'
    return false
  }
  if (codigo.value.length !== 6 || !/^\d{6}$/.test(codigo.value)) {
    errors.value.codigo = 'El código debe tener 6 dígitos'
    return false
  }
  return true
}

function formatCodigo() {
  // Solo permitir dígitos
  codigo.value = codigo.value.replace(/\D/g, '').slice(0, 6)
}

async function handleSubmit() {
  authError.value = ''
  
  if (paso.value === 'credenciales') {
    if (!validateForm()) return
    await handleLogin()
  } else {
    if (!validateCodigo()) return
    await handleVerify()
  }
}

async function handleLogin() {
  loading.value = true
  const result = await authStore.login(form.value)

  if (result.success) {
    if (result.requiere2fa) {
      // Cambiar a paso de código 2FA
      paso.value = 'codigo'
      email.value = result.email
      authError.value = ''
      codigo.value = ''
      startResendCountdown()
    } else {
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
  } else {
    authError.value = result.error
  }
  loading.value = false
}

async function handleVerify() {
  loading.value = true
  try {
    const result = await authStore.verify2FA(email.value, codigo.value)
    if (result.success) {
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      authError.value = result.error
    }
  } catch (err) {
    authError.value = err.response?.data?.error || 'Error al verificar el código'
  } finally {
    loading.value = false
  }
}

async function reenviarCodigo() {
  if (resendDisabled.value) return
  
  loading.value = true
  try {
    const result = await authStore.resend2FA(email.value)
    if (result.success) {
      startResendCountdown()
    } else {
      authError.value = result.error
    }
  } catch (err) {
    authError.value = err.response?.data?.message || 'Error al reenviar código'
  } finally {
    loading.value = false
  }
}

function volverACredenciales() {
  paso.value = 'credenciales'
  authError.value = ''
  codigo.value = ''
  stopResendCountdown()
}

function startResendCountdown() {
  resendDisabled.value = true
  resendCountdown.value = 60
  stopResendCountdown()
  resendInterval.value = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      resendDisabled.value = false
      clearInterval(resendInterval.value)
    }
  }, 1000)
}

function stopResendCountdown() {
  if (resendInterval.value) {
    clearInterval(resendInterval.value)
    resendInterval.value = null
  }
}

onMounted(() => {
  // Si venimos de login con 2FA requerido
  if (route.query.requires2fa === 'true' && route.query.email) {
    paso.value = 'codigo'
    email.value = route.query.email
  }
})

onUnmounted(() => {
  stopResendCountdown()
})
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

.btn-link {
  background: none;
  border: none;
  color: #e91e63;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  text-decoration: none;
}

.btn-link:disabled {
  color: #999;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #e91e63;
  border: 1px solid #e91e63;
}

.btn-outline:hover:not(:disabled) {
  background: #e91e63;
  color: white;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resend-section {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.resend-note {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
}

.back-btn {
  margin-top: 0.5rem;
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

.forgot-password {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.forgot-password a {
  color: #e91e63;
  font-weight: 500;
}
</style>