<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Finalizar Compra</h1>
        <p class="mb-0" style="color: var(--kei-gris-medio);">Revisa tu pedido y completa la compra</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cartStore.loading" class="d-flex flex-column align-items-center justify-content-center py-5">
      <div class="spinner-border mb-3" role="status" style="color: var(--kei-gris-oscuro);">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mb-0" style="color: var(--kei-gris-medio);">Cargando carrito...</p>
    </div>

    <!-- Error -->
    <div v-else-if="cartStore.error" class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="alert alert-danger text-center" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ cartStore.error }}
          <div class="mt-3">
            <button class="btn btn-primary btn-sm" @click="loadCart">Reintentar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="cartStore.items.length === 0" class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card text-center py-5 px-4 shadow-sm">
          <div class="card-body">
            <i class="bi bi-cart3 d-block mb-3" style="font-size: 3rem; color: var(--kei-beige-medio);"></i>
            <p class="fs-5 mb-4" style="color: var(--kei-gris-medio);">Tu carrito está vacío</p>
            <router-link to="/catalogo" class="btn btn-primary">Ir al Catálogo</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="row g-4">
      <!-- Form -->
      <div class="col-12 col-lg-7">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h5 class="card-title pb-3 mb-4 border-bottom fw-semibold" style="color: var(--kei-casi-negro); border-color: var(--kei-gris-claro) !important;">Dirección de Envío</h5>

            <form @submit.prevent="handleSubmit" novalidate :class="{ 'was-validated': wasValidated }" class="needs-validation">
              <!-- Guest fields -->
              <div v-if="!isAuthenticated" class="card mb-4" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">
                <div class="card-body">
                  <h6 class="fw-semibold mb-3" style="color: var(--kei-casi-negro);">Información de Contacto</h6>

                  <div class="mb-3">
                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
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

                  <div class="mb-0">
                    <label for="telefono-guest" class="form-label">Teléfono <span class="text-danger">*</span></label>
                    <input
                      id="telefono-guest"
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
                </div>
              </div>

              <!-- Auth fields -->
              <div v-else>
                <div class="form-check mb-3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="usarOtrosDatos"
                    v-model="form.usar_otros_datos"
                    @change="toggleUsarOtrosDatos"
                  />
                  <label class="form-check-label" for="usarOtrosDatos" style="color: var(--kei-gris-medio);">
                    Usar otros datos para este pedido
                  </label>
                </div>

                <div class="mb-3">
                  <label for="direccion" class="form-label">Dirección completa <span class="text-danger">*</span></label>
                  <textarea
                    id="direccion"
                    v-model="form.direccion_envio"
                    required
                    rows="3"
                    autocomplete="street-address"
                    :class="['form-control', errors.direccion_envio ? 'is-invalid' : '']"
                    :aria-invalid="errors.direccion_envio ? 'true' : 'false'"
                    :disabled="!form.usar_otros_datos && isAuthenticated"
                  ></textarea>
                  <div v-if="errors.direccion_envio" class="invalid-feedback d-block">{{ errors.direccion_envio }}</div>
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
                    :disabled="!form.usar_otros_datos && isAuthenticated"
                  />
                  <div v-if="errors.telefono" class="invalid-feedback d-block">{{ errors.telefono }}</div>
                </div>

                <div v-if="form.usar_otros_datos" class="form-check mb-3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="guardarDatos"
                    v-model="form.guardar_datos"
                  />
                  <label class="form-check-label" for="guardarDatos" style="color: var(--kei-gris-medio);">
                    Actualizar mis datos de perfil con esta información
                  </label>
                </div>
              </div>

              <!-- Guest also needs direccion -->
              <div v-if="!isAuthenticated" class="mb-3">
                <label for="direccion-guest" class="form-label">Dirección completa <span class="text-danger">*</span></label>
                <textarea
                  id="direccion-guest"
                  v-model="form.direccion_envio"
                  required
                  rows="3"
                  autocomplete="street-address"
                  :class="['form-control', errors.direccion_envio ? 'is-invalid' : '']"
                  :aria-invalid="errors.direccion_envio ? 'true' : 'false'"
                ></textarea>
                <div v-if="errors.direccion_envio" class="invalid-feedback d-block">{{ errors.direccion_envio }}</div>
              </div>

              <div v-if="submitError" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ submitError }}
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ submitting ? 'Procesando...' : 'Confirmar Pedido' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="col-12 col-lg-5">
        <div class="card shadow-sm position-sticky" style="top: 100px;">
          <div class="card-body p-4">
            <h5 class="card-title pb-3 mb-3 border-bottom fw-semibold" style="color: var(--kei-casi-negro); border-color: var(--kei-gris-claro) !important;">Resumen del Pedido</h5>

            <div class="mb-3">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="d-flex align-items-center gap-3 py-3 border-bottom"
                style="border-color: var(--kei-gris-claro) !important;"
              >
                <div
                  class="d-flex align-items-center justify-content-center rounded overflow-hidden flex-shrink-0"
                  style="width: 50px; height: 50px; background-color: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);"
                >
                  <img
                    v-if="item.imagen_url"
                    :src="item.imagen_url"
                    :alt="item.nombre"
                    class="w-100 h-100"
                    style="object-fit: cover;"
                  />
                  <span v-else class="fw-semibold" style="color: var(--kei-beige);">{{ item.nombre.charAt(0) }}</span>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-medium small" style="color: var(--kei-casi-negro);">{{ item.nombre }}</div>
                  <small style="color: var(--kei-beige);">{{ item.marca_nombre }}</small>
                </div>
                <div class="text-end">
                  <div class="small" style="color: var(--kei-gris-medio);">{{ item.cantidad }} × {{ formatPrice(item.precio) }}</div>
                  <div class="fw-semibold small" style="color: var(--kei-casi-negro);">{{ formatPrice(item.subtotal) }}</div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between py-2" style="color: var(--kei-gris-medio);">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="fw-medium" style="color: var(--kei-casi-negro);">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="d-flex justify-content-between py-2" style="color: var(--kei-gris-medio);">
              <span>Envío</span>
              <span class="badge bg-secondary">Gratis</span>
            </div>
            <div class="d-flex justify-content-between py-3 mt-2 border-top fw-bold fs-5" style="border-color: var(--kei-gris-claro) !important; color: var(--kei-casi-negro);">
              <span>Total</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="text-center mt-3 pt-3 border-top" style="border-color: var(--kei-gris-claro) !important;">
              <small style="color: var(--kei-gris-medio);">
                <i class="bi bi-lock me-1"></i>Pago contra entrega - Pagas al recibir
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { createOrder } from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const form = ref({
  direccion_envio: '',
  email: '',
  telefono: '',
  guardar_datos: false,
  usar_otros_datos: false
})

const errors = ref({})
const submitError = ref('')
const submitting = ref(false)
const wasValidated = ref(false)

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function validateForm() {
  errors.value = {}
  let isValid = true

  if (!form.value.direccion_envio.trim()) {
    errors.value.direccion_envio = 'La dirección de envío es obligatoria'
    isValid = false
  } else if (form.value.direccion_envio.trim().length < 10) {
    errors.value.direccion_envio = 'La dirección debe tener al menos 10 caracteres'
    isValid = false
  }

  if (!isAuthenticated.value) {
    if (!form.value.email.trim()) {
      errors.value.email = 'El email es obligatorio'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Formato de email inválido'
      isValid = false
    }

    if (!form.value.telefono.trim()) {
      errors.value.telefono = 'El teléfono es obligatorio'
      isValid = false
    } else if (form.value.telefono.replace(/\D/g, '').length < 8) {
      errors.value.telefono = 'El teléfono debe tener al menos 8 dígitos'
      isValid = false
    }
  } else {
    if (!form.value.telefono.trim()) {
      errors.value.telefono = 'El teléfono es obligatorio'
      isValid = false
    } else if (form.value.telefono.replace(/\D/g, '').length < 8) {
      errors.value.telefono = 'El teléfono debe tener al menos 8 dígitos'
      isValid = false
    }
  }

  return isValid
}

function toggleUsarOtrosDatos() {
  if (form.value.usar_otros_datos) {
    form.value.direccion_envio = ''
    form.value.telefono = ''
  } else {
    if (authStore.user?.direccion_envio) {
      form.value.direccion_envio = authStore.user.direccion_envio
    }
    if (authStore.user?.telefono) {
      form.value.telefono = authStore.user.telefono
    }
  }
}

async function loadCart() {
  await cartStore.fetchCart()
}

async function handleSubmit() {
  submitError.value = ''
  wasValidated.value = true
  if (!validateForm()) return

  submitting.value = true
  try {
    const payload = {
      direccion_envio: form.value.direccion_envio
    }

    if (!isAuthenticated.value) {
      payload.email_contacto = form.value.email
      payload.telefono_contacto = form.value.telefono
    } else {
      payload.telefono = form.value.telefono
    }

    await createOrder(payload)

    if (isAuthenticated.value && form.value.guardar_datos) {
      // TODO: Actualizar perfil del usuario
    }

    cartStore.clearCart()
    if (!isAuthenticated.value) {
      cartStore.clearGuestToken()
    }
    router.push('/mis-pedidos')
  } catch (err) {
    submitError.value = err.response?.data?.message || 'Error al crear el pedido. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

async function loadData() {
  await loadCart()
  
  if (isAuthenticated.value) {
    form.value.usar_otros_datos = false
    if (authStore.user?.direccion_envio) {
      form.value.direccion_envio = authStore.user.direccion_envio
    }
    if (authStore.user?.telefono) {
      form.value.telefono = authStore.user.telefono
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
.form-check-input:checked {
  background-color: var(--kei-gris-oscuro);
  border-color: var(--kei-gris-oscuro);
}
</style>
