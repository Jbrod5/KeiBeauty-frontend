<template>
  <div class="checkout-view">
    <header class="checkout-header">
      <h1>Finalizar Compra</h1>
      <p class="checkout-subtitle">Revisa tu pedido y completa la compra</p>
    </header>

    <div v-if="cartStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando carrito...</p>
    </div>

    <div v-else-if="cartStore.error" class="error-state">
      <p>{{ cartStore.error }}</p>
      <button class="btn btn-primary" @click="loadCart">Reintentar</button>
    </div>

    <div v-else-if="cartStore.items.length === 0" class="empty-checkout">
      <p>🛒 Tu carrito está vacío</p>
      <router-link to="/catalogo" class="btn btn-primary">Ir al Catálogo</router-link>
    </div>

    <div v-else class="checkout-content">
      <section class="checkout-form-section">
        <h2>Dirección de Envío</h2>
        <form @submit.prevent="handleSubmit" class="address-form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="direccion">Dirección completa *</label>
              <textarea
                id="direccion"
                v-model="form.direccion_envio"
                required
                rows="3"
                autocomplete="street-address"
                :aria-invalid="errors.direccion_envio ? 'true' : 'false'"
              ></textarea>
              <span v-if="errors.direccion_envio" class="error-message" role="alert">{{ errors.direccion_envio }}</span>
            </div>
          </div>

          <div v-if="submitError" class="submit-error" role="alert">{{ submitError }}</div>

          <button type="submit" class="btn btn-primary btn-block checkout-submit-btn" :disabled="submitting">
            <span v-if="!submitting">Confirmar Pedido</span>
            <span v-else class="spinner"></span>
          </button>
        </form>
      </section>

      <aside class="checkout-summary">
        <h2>Resumen del Pedido</h2>
        
        <div class="order-items">
          <div class="order-item" v-for="item in cartStore.items" :key="item.id">
            <div class="item-info">
              <div class="item-image">
                <img 
                  v-if="item.imagen_url" 
                  :src="item.imagen_url" 
                  :alt="item.nombre" 
                  class="order-item-img"
                />
                <span v-else class="item-placeholder">{{ item.nombre.charAt(0) }}</span>
              </div>
              <div class="item-details">
                <h4>{{ item.nombre }}</h4>
                <p class="item-brand">{{ item.marca_nombre }}</p>
              </div>
            </div>
            <div class="item-qty-price">
              <span class="item-qty">{{ item.cantidad }} × {{ formatPrice(item.precio) }}</span>
              <span class="item-subtotal">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-row">
          <span>Subtotal ({{ cartStore.totalItems }} items)</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="summary-row">
          <span>Envío</span>
          <span class="free-shipping">Gratis</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>

        <p class="secure-note">🔒 Pago contra entrega - Pagas al recibir</p>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { createOrder } from '../services/api'

const router = useRouter()
const cartStore = useCartStore()

const form = ref({
  direccion_envio: ''
})

const errors = ref({})
const submitError = ref('')
const submitting = ref(false)

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

  return isValid
}

async function loadCart() {
  await cartStore.fetchCart()
}

async function handleSubmit() {
  submitError.value = ''
  if (!validateForm()) return

  submitting.value = true
  try {
    await createOrder({ direccion_envio: form.value.direccion_envio })
    cartStore.clearCart()
    router.push('/mis-pedidos')
  } catch (err) {
    submitError.value = err.response?.data?.message || 'Error al crear el pedido. Intenta de nuevo.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCart()
  // Pre-fill address from user profile if available
  import('../stores/authStore').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    if (authStore.user?.direccion_envio) {
      form.value.direccion_envio = authStore.user.direccion_envio
    }
  })
})
</script>

<style scoped>
.checkout-view {
  max-width: 1000px;
  margin: 0 auto;
}

.checkout-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.checkout-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.checkout-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

.checkout-form-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 2rem;
}

.checkout-form-section h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
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

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
  border-color: #e53935;
}

.error-message {
  font-size: 0.8rem;
  color: #e53935;
}

.submit-error {
  padding: 0.75rem 1rem;
  background: #fdeaea;
  border: 1px solid #f5c6cb;
  border-radius: 0.5rem;
  color: #c62828;
  font-size: 0.9rem;
  text-align: center;
}

.checkout-submit-btn {
  margin-top: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #e91e63;
  color: white;
  width: 100%;
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

.checkout-summary {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.checkout-summary h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-placeholder {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e91e63;
}

.item-details h4 {
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 0.125rem;
}

.item-brand {
  font-size: 0.75rem;
  color: #e91e63;
  font-weight: 500;
}

.item-qty-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.item-qty {
  font-size: 0.8rem;
  color: #666;
}

.item-subtotal {
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
}

.summary-divider {
  border-top: 1px solid #eee;
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #555;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.free-shipping {
  color: #2e7d32;
  font-weight: 500;
}

.secure-note {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 0.85rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  gap: 1rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state {
  color: #c62828;
  background: #fdeaea;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.error-state .btn {
  margin-top: 0.5rem;
}

.empty-checkout {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-checkout p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .checkout-summary {
    position: static;
  }
  
  .order-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }
  
  .item-info {
    grid-column: 1 / 3;
  }
  
  .item-qty-price {
    grid-column: 2;
    align-items: flex-end;
  }
}
</style>