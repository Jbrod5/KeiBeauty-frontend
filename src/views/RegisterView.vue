<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-11 col-md-9 col-lg-6 col-xl-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Crear Cuenta</h1>
              <p class="mb-0" style="color: var(--kei-gris-medio);">Únete a KeiBeauty y descubre el K-Beauty</p>
            </div>

            <form @submit.prevent="handleRegister" novalidate>
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  v-model="form.nombre"
                  required
                  autocomplete="name"
                  :class="['form-control', errors.nombre ? 'is-invalid' : '']"
                  :aria-invalid="errors.nombre ? 'true' : 'false'"
                />
                <div v-if="errors.nombre" class="invalid-feedback d-block">{{ errors.nombre }}</div>
              </div>

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

              <div class="mb-3">
                <label for="telefono" class="form-label">Teléfono <span class="text-danger">*</span></label>
                <input
                  id="telefono"
                  type="tel"
                  v-model="form.telefono"
                  required
                  autocomplete="tel"
                  placeholder="12345678"
                  :class="['form-control', errors.telefono ? 'is-invalid' : '']"
                  :aria-invalid="errors.telefono ? 'true' : 'false'"
                />
                <div v-if="errors.telefono" class="invalid-feedback d-block">{{ errors.telefono }}</div>
              </div>

              <div class="mb-3">
                <label for="direccion_envio" class="form-label">Dirección de envío <span class="text-danger">*</span></label>
                <textarea
                  id="direccion_envio"
                  v-model="form.direccion_envio"
                  required
                  rows="2"
                  autocomplete="street-address"
                  :class="['form-control', errors.direccion_envio ? 'is-invalid' : '']"
                  :aria-invalid="errors.direccion_envio ? 'true' : 'false'"
                ></textarea>
                <div v-if="errors.direccion_envio" class="invalid-feedback d-block">{{ errors.direccion_envio }}</div>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Registrando...' : 'Registrarse' }}
              </button>
            </form>

            <div class="text-center mt-4">
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">
                ¿Ya tienes cuenta?
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

  if (!form.value.telefono.trim()) {
    errors.value.telefono = 'El teléfono es obligatorio'
    isValid = false
  } else if (form.value.telefono.replace(/\D/g, '').length < 8) {
    errors.value.telefono = 'El teléfono debe tener al menos 8 dígitos'
    isValid = false
  }

  if (!form.value.direccion_envio.trim()) {
    errors.value.direccion_envio = 'La dirección de envío es obligatoria'
    isValid = false
  } else if (form.value.direccion_envio.trim().length < 10) {
    errors.value.direccion_envio = 'La dirección debe tener al menos 10 caracteres'
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
.card {
  border-color: var(--kei-gris-claro) !important;
}
</style>
