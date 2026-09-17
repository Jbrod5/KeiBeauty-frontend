<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width: 56px; height: 56px; background-color: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);">
                <i class="bi bi-key fs-4" style="color: var(--kei-gris-oscuro);"></i>
              </div>
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">¿Olvidaste tu contraseña?</h1>
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">Te enviaremos un enlace para restablecerla</p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
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

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>
              <div v-if="successMessage" class="alert alert-success d-flex align-items-center" role="alert" style="background-color: var(--kei-fondo); border-color: var(--kei-beige-claro); color: var(--kei-casi-negro);">
                <i class="bi bi-check-circle me-2 flex-shrink-0"></i>
                <div>{{ successMessage }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Enviando...' : 'Enviar enlace' }}
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
.card {
  border-color: var(--kei-gris-claro) !important;
}
</style>
