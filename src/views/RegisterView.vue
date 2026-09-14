<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <header class="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a KeiBeauty y descubre el K-Beauty</p>
        </header>

        <form @submit.prevent="handleRegister" class="auth-form" novalidate>
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              v-model="form.nombre"
              required
              autocomplete="name"
              :aria-invalid="errors.nombre ? 'true' : 'false'"
            />
            <span v-if="errors.nombre" class="error-message" role="alert">{{ errors.nombre }}</span>
          </div>

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
              autocomplete="new-password"
              :aria-invalid="errors.password ? 'true' : 'false'"
            />
            <span v-if="errors.password" class="error-message" role="alert">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              v-model="form.confirmPassword"
              required
              autocomplete="new-password"
              :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
            />
            <span v-if="errors.confirmPassword" class="error-message" role="alert">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono (opcional)</label>
            <input
              id="telefono"
              type="tel"
              v-model="form.telefono"
              autocomplete="tel"
            />
          </div>

          <div class="form-group">
            <label for="direccion_envio">Dirección de envío (opcional)</label>
            <textarea
              id="direccion_envio"
              v-model="form.direccion_envio"
              rows="2"
              autocomplete="street-address"
            ></textarea>
          </div>

          <div v-if="authError" class="auth-error" role="alert">{{ authError }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Registrarse</span>
          </button>
        </form>

        <footer class="auth-footer">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
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
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: '',
  direccion_envio: ''
})

const errors = ref({})
const authError = ref('')
const loading = ref(false)

function validateForm() {
  errors.value = {}
  let isValid = true

  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es obligatorio'
    isValid = false
  } else if (form.value.nombre.trim().length < 2) {
    errors.value.nombre = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

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

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  return isValid
}

async function handleRegister() {
  authError.value = ''
  if (!validateForm()) return

  loading.value = true
  const { confirmPassword, ...userData } = form.value
  const result = await authStore.register(userData)

  if (result.success) {
    router.push('/')
  } else {
    authError.value = result.error
  }
  loading.value = false
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

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

.form-group input[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
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