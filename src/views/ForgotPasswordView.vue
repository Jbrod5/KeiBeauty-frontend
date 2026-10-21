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
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Restablecer contraseña</h1>
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">
                <template v-if="paso === 1">Te enviaremos un código de 6 dígitos</template>
                <template v-else-if="paso === 2">Ingresa el código que te enviamos</template>
                <template v-else>Define tu nueva contraseña</template>
              </p>
            </div>

            <!-- Indicador de pasos -->
            <div class="d-flex align-items-center justify-content-center gap-2 mb-4" aria-label="Progreso">
              <span v-for="n in 3" :key="n" class="rounded-circle" :style="{
                width: '10px', height: '10px',
                background: n <= paso ? 'var(--kei-oliva)' : 'var(--kei-gris-claro)'
              }"></span>
            </div>

            <!-- PASO 1: email -->
            <form v-if="paso === 1" @submit.prevent="enviarCodigo" novalidate>
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
                  placeholder="tu@correo.com"
                />
                <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Enviando...' : 'Enviar código' }}
              </button>
            </form>

            <!-- PASO 2: código -->
            <form v-else-if="paso === 2" @submit.prevent="verificarCodigo" novalidate>
              <div class="mb-3">
                <label for="codigo" class="form-label">Código de 6 dígitos</label>
                <input
                  id="codigo"
                  type="text"
                  v-model="form.codigo"
                  required
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  maxlength="6"
                  pattern="[0-9]*"
                  class="form-control text-center fs-4"
                  :class="errors.codigo ? 'is-invalid' : ''"
                  :aria-invalid="errors.codigo ? 'true' : 'false'"
                  style="letter-spacing: 0.6rem; font-weight: 700;"
                  placeholder="000000"
                />
                <div v-if="errors.codigo" class="invalid-feedback d-block">{{ errors.codigo }}</div>
                <small class="form-text" style="color: var(--kei-gris-medio);">
                  Enviado a <strong>{{ form.email }}</strong>. El código expira en 15 minutos.
                </small>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Verificando...' : 'Verificar código' }}
              </button>

              <div class="text-center mt-3">
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0"
                  style="color: var(--kei-gris-oscuro);"
                  :disabled="segundosReenvio > 0 || reenviando"
                  @click="reenviarCodigo"
                >
                  <span v-if="reenviando">Reenviando...</span>
                  <span v-else-if="segundosReenvio > 0">Reenviar código ({{ segundosReenvio }}s)</span>
                  <span v-else>¿No recibiste el código? Reenviar</span>
                </button>
              </div>
            </form>

            <!-- PASO 3: nueva contraseña -->
            <form v-else @submit.prevent="definirPassword" novalidate>
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
                <button
                  v-if="paso > 1"
                  type="button"
                  class="btn btn-link btn-sm p-0 me-2"
                  style="color: var(--kei-gris-oscuro);"
                  @click="volverAtras"
                >
                  <i class="bi bi-arrow-left me-1"></i>Atrás
                </button>
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
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const paso = ref(1)
const token = ref('')
const loading = ref(false)
const reenviando = ref(false)
const segundosReenvio = ref(0)
const authError = ref('')
const errors = ref({})
const form = ref({
  email: '',
  codigo: '',
  password: '',
  confirmPassword: ''
})

let temporizadorReenvio = null

function iniciarContadorReenvio() {
  segundosReenvio.value = 60
  if (temporizadorReenvio) clearInterval(temporizadorReenvio)
  temporizadorReenvio = setInterval(() => {
    segundosReenvio.value--
    if (segundosReenvio.value <= 0) clearInterval(temporizadorReenvio)
  }, 1000)
}

onUnmounted(() => {
  if (temporizadorReenvio) clearInterval(temporizadorReenvio)
})

async function enviarCodigo() {
  authError.value = ''
  errors.value = {}
  if (!form.value.email) {
    errors.value.email = 'El email es obligatorio'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Formato de email inválido'
    return
  }

  loading.value = true
  const result = await authStore.forgotPassword(form.value.email)
  loading.value = false

  if (result.success) {
    paso.value = 2
    iniciarContadorReenvio()
  } else {
    authError.value = result.error
  }
}

async function verificarCodigo() {
  authError.value = ''
  errors.value = {}
  const codigo = form.value.codigo.trim()
  if (!codigo) {
    errors.value.codigo = 'El código es obligatorio'
    return
  }
  if (!/^\d{6}$/.test(codigo)) {
    errors.value.codigo = 'El código debe tener 6 dígitos'
    return
  }

  loading.value = true
  const result = await authStore.verificarCodigoRecuperacion(form.value.email, codigo)
  loading.value = false

  if (result.success) {
    token.value = result.token
    paso.value = 3
  } else {
    authError.value = result.error
  }
}

async function reenviarCodigo() {
  authError.value = ''
  reenviando.value = true
  const result = await authStore.reenviarCodigoRecuperacion(form.value.email)
  reenviando.value = false

  if (result.success) {
    iniciarContadorReenvio()
  } else {
    authError.value = result.error
  }
}

async function definirPassword() {
  authError.value = ''
  errors.value = {}
  if (!form.value.password) {
    errors.value.password = 'La contraseña es obligatoria'
    return
  }
  if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  const result = await authStore.resetPassword(
    token.value,
    form.value.password,
    form.value.confirmPassword
  )
  loading.value = false

  if (result.success) {
    router.push({ name: 'login', query: { passwordReset: 'success' } })
  } else {
    authError.value = result.error
    // Si el token expiro o ya se uso, hay que empezar de nuevo
    if (/expirad|inválid|invalid/i.test(result.error || '')) {
      paso.value = 1
      token.value = ''
    }
  }
}

function volverAtras() {
  authError.value = ''
  errors.value = {}
  if (paso.value === 3) {
    paso.value = 2
  } else {
    paso.value = 1
  }
}
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
</style>
