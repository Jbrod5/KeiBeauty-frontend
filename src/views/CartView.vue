<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Carrito de Compras</h1>
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
        <div class="alert alert-danger d-flex flex-column align-items-center text-center" role="alert">
          <i class="bi bi-exclamation-triangle fs-4 mb-2"></i>
          <p class="mb-3">{{ cartStore.error }}</p>
          <button class="btn btn-primary" @click="cartStore.fetchCart">Reintentar</button>
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
      <!-- Items -->
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="d-flex align-items-center gap-3 p-3 border-bottom flex-wrap flex-md-nowrap"
              style="border-color: var(--kei-gris-claro) !important;"
            >
              <!-- Imagen clickeable -->
              <router-link :to="`/producto/${item.producto_id}`" class="text-decoration-none flex-shrink-0">
                <div
                  class="d-flex align-items-center justify-content-center rounded overflow-hidden"
                  style="width: 64px; height: 64px; background-color: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);"
                >
                  <img
                    v-if="item.imagen_url"
                    :src="item.imagen_url"
                    :alt="item.nombre"
                    class="w-100 h-100"
                    style="object-fit: cover;"
                  />
                  <span
                    v-else
                    class="fw-semibold fs-5"
                    style="color: var(--kei-beige);"
                  >{{ item.nombre ? item.nombre.charAt(0) : '?' }}</span>
                </div>
              </router-link>

              <!-- Info clickeable -->
              <div class="flex-grow-1 min-w-0">
                <router-link :to="`/producto/${item.producto_id}`" class="text-decoration-none">
                  <h6 class="mb-1 fw-semibold" style="color: var(--kei-casi-negro);">{{ item.nombre }}</h6>
                </router-link>
                <small style="color: var(--kei-beige);">{{ item.marca_nombre }}</small>
                <div class="d-md-none mt-1">
                  <span class="fw-semibold small" style="color: var(--kei-casi-negro);">{{ formatPrice(item.precio) }}</span>
                </div>
              </div>

              <!-- Precio desktop -->
              <div class="d-none d-md-block fw-semibold text-nowrap" style="color: var(--kei-casi-negro);">
                {{ formatPrice(item.precio) }}
              </div>

              <!-- Cantidad -->
              <div class="d-flex align-items-center gap-2">
                <button
                  @click="cartStore.updateQuantity(item.id, item.cantidad - 1)"
                  class="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                  style="width: 32px; height: 32px;"
                  :disabled="item.cantidad <= 1"
                  aria-label="Disminuir"
                >
                  <i class="bi bi-dash-lg"></i>
                </button>
                <span class="fw-medium text-center" style="min-width: 2rem; color: var(--kei-casi-negro);">{{ item.cantidad }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.cantidad + 1)"
                  class="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                  style="width: 32px; height: 32px;"
                  aria-label="Aumentar"
                >
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>

              <!-- Subtotal -->
              <div class="fw-semibold text-end text-nowrap d-none d-sm-block" style="min-width: 90px; color: var(--kei-casi-negro);">
                {{ formatPrice(item.subtotal ?? (item.precio * item.cantidad)) }}
              </div>

              <!-- Eliminar -->
              <button
                @click="cartStore.removeItem(item.id)"
                class="btn btn-link p-1 flex-shrink-0"
                style="color: var(--kei-beige-medio);"
                aria-label="Eliminar"
              >
                <i class="bi bi-x-lg fs-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="col-12 col-lg-4">
        <div class="card shadow-sm position-sticky" style="top: 100px;">
          <div class="card-body p-4">
            <h5 class="card-title pb-3 mb-3 border-bottom fw-semibold" style="color: var(--kei-casi-negro); border-color: var(--kei-gris-claro) !important;">Resumen</h5>
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
            <button class="btn btn-primary w-100 mt-3" @click="goToCheckout">
              Proceder al Pago
            </button>
            <router-link to="/catalogo" class="btn btn-outline-secondary w-100 mt-2">Seguir Comprando</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price || 0)
}

onMounted(() => {
  cartStore.fetchCart()
})

function goToCheckout() {
  router.push('/checkout')
}
</script>

<style scoped>
.card {
  border-color: var(--kei-gris-claro) !important;
}
.btn-link:hover {
  color: var(--kei-gris-oscuro) !important;
}
</style>
