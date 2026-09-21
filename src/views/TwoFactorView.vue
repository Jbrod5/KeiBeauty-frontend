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
              <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Verificar Código</h1>
              <p class="mb-0 small" style="color: var(--kei-gris-medio);">
                Te enviamos un código de 6 dígitos a <strong style="color: var(--kei-casi-negro);">{{ email }}</strong>
              </p>
            </div>

            <form @submit.prevent="handleVerify" novalidate>
              <div class="mb-3">
                <label for="codigo" class="form-label">Código de 6 dígitos</label>
                <input
                  id="codigo"
                  type="text"
                  v-model="codigo"
                  required
                  maxlength="6"
                  autocomplete="one-time-code"
                  inputmode="numeric"
                  placeholder="000000"
                  :class="['form-control text-center fs-5 tracking-widest', errors.codigo ? 'is-invalid' : '']"
                  :aria-invalid="errors.codigo ? 'true' : 'false'"
                  @input="formatCodigo"
                />
                <div v-if="errors.codigo" class="invalid-feedback d-block">{{ errors.codigo }}</div>
              </div>

              <div v-if="authError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                <div>{{ authError }}</div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading || codigo.length < 6">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ loading ? 'Verificando...' : 'Verificar' }}
              </button>

              <div class="text-center mt-4 pt-3 border-top" style="border-color: var(--kei-gris-claro) !important;">
                <button
                  type="button"
                  class="btn btn-link btn-sm text-decoration-none"
                  style="color: var(--kei-gris-oscuro);"
                  @click="reenviarCodigo"
                  :disabled="resendDisabled || loading"
                >
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  <span v-if="resendDisabled">Reenviar en {{ resendCountdown }}s</span>
                  <span v-else>Reenviar código</span>
                </button>
                <p class="small mb-0 mt-2" style="color: var(--kei-beige-medio);">
                  <i class="bi bi-info-circle me-1"></i>No recibiste el código? Revisa tu carpeta de spam.
                </p>
              </div>

              <button type="button" class="btn btn-outline-secondary w-100 mt-3" @click="cancelarLogin" :disabled="loading">
                <i class="bi bi-x-lg me-1"></i>Cancelar inicio de sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const codigo = ref('')
const errors = ref({})
const authError = ref('')
const loading = ref(false)

const resendDisabled = ref(false)
const resendCountdown = ref(0)
const resendInterval = ref(null)

const email = ref('')

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
  codigo.value = codigo.value.replace(/\D/g, '').slice(0, 6)
}

async function handleVerify() {
  authError.value = ''
  
  if (!validateCodigo()) return
  
  loading.value = true
  try {
    const result = await authStore.verify2FA(codigo.value)
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
    const result = await authStore.resend2FA()
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

function cancelarLogin() {
  authStore.cancelLogin()
  router.push('/login')
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
  if (!authStore.isIn2FAFlow) {
    router.push('/login')
    return
  }
  email.value = authStore.tempEmail || ''
  startResendCountdown()
})

onUnmounted(() => {
  stopResendCountdown()
})
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
.tracking-widest {
  letter-spacing: 0.5em;
}
</style>
