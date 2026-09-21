<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width: 56px; height: 56px; background-color: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);">
                <i class="bi bi-shield-lock fs-4" style="color: var(--kei-gris-oscuro);"></i>
              </div>
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Restablecer Contraseña</h1>
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">Ingresa tu nueva contraseña</p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label for="password" class="form-label">Nueva contraseña</label>
                <input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  autocomplete="new-password"
                  :class="['form-control', errors.password ? 'is-invalid' : '']"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                />
                <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  v-model="form.confirmPassword"
                  required
                  autocomplete="new-password"
                  :class="['form-control', errors.confirmPassword ? 'is-invalid' : '']"
                  :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback d-block">{{ errors.confirmPassword }}</div>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Restableciendo...' : 'Restablecer contraseña' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">
                ¿Recordaste tu contraseña?
                <router-link to="/login" class="text-decoration-none fw-medium" style="color: var(--kei-gris-oscuro);">Inicia sesión</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  password: '',
  confirmPassword: ''
})

const errors = ref({})
const authError = ref('')
const loading = ref(false)
const tokenValid = ref(true)

function validateForm() {
  errors.value = {}
  let isValid = true

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

async function handleSubmit() {
  authError.value = ''
  if (!validateForm()) return
  if (!tokenValid.value) return

  loading.value = true
  try {
    const token = route.query.token || route.params.token
    const result = await authStore.resetPassword(token, form.value.password, form.value.confirmPassword)
    if (result.success) {
      router.push({ name: 'login', query: { passwordReset: 'success' } })
    } else {
      authError.value = result.error
      if (result.error?.includes('expirado') || result.error?.includes('inválido')) {
        tokenValid.value = false
      }
    }
  } catch (err) {
    authError.value = err.response?.data?.message || 'Error al restablecer contraseña'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = route.query.token || route.params.token
  if (!token) {
    tokenValid.value = false
    authError.value = 'Token no proporcionado. Solicita un nuevo enlace de recuperación.'
  }
})
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
</style>
