<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Iniciar Sesión</h1>
              <p class="mb-0" style="color: var(--kei-gris-medio);">Accede a tu cuenta KeiBeauty</p>
            </div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model="form.email"
                  required
                  autocomplete="email"
                  :class="['form-control', errors.email ? 'is-invalid' : '']"
                  :aria-invalid="errors.email ? 'true' : 'false'"
                />
                <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  autocomplete="current-password"
                  :class="['form-control', errors.password ? 'is-invalid' : '']"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                />
                <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-2 small" style="color: var(--kei-gris-medio);">
                ¿No tienes cuenta?
                <router-link to="/registro" class="text-decoration-none fw-medium" style="color: var(--kei-gris-oscuro);">Regístrate</router-link>
              </p>
              <p class="mb-0 small">
                <router-link to="/olvide-contrasena" class="text-decoration-none" style="color: var(--kei-beige);">
                  <i class="bi bi-key me-1"></i>¿Olvidaste tu contraseña?
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const authError = ref('')
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

  if (!form.value.password) {
    errors.value.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  authError.value = ''
  
  if (!validateForm()) return
  
  loading.value = true
  const result = await authStore.login(form.value)

  if (result.success) {
    if (result.requiere2fa) {
      router.push('/verificar-2fa')
    } else {
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
  } else {
    authError.value = result.error
  }
  loading.value = false
}
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
</style>
