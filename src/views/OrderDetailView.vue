<template>
  <div class="container py-4" style="max-width: 880px;">
    <div v-if="order">
      <header class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
        <router-link to="/mis-pedidos" class="btn btn-link text-decoration-none p-0 mb-3 d-inline-flex align-items-center gap-2" style="color: var(--kei-gris-oscuro);">
          <i class="bi bi-arrow-left"></i> Volver a Mis Pedidos
        </router-link>
        <h1 class="h3 fw-bold mb-2" style="color: var(--kei-casi-negro);">Detalle del Pedido #{{ order.id }}</h1>
        <div class="d-flex flex-wrap align-items-center gap-3">
          <span class="small d-inline-flex align-items-center gap-2" style="color: var(--kei-gris-medio);">
            <i class="bi bi-calendar3"></i>{{ formatDate(order.fecha_pedido) }}
          </span>
          <span class="badge rounded-pill text-uppercase px-3 py-2" :style="statusBadgeStyle(order.estado)">
            <i :class="statusIcon(order.estado)" class="me-1"></i>{{ statusLabel(order.estado) }}
          </span>
        </div>
      </header>

      <div class="d-flex flex-column gap-4">
        <section class="card shadow-sm">
          <div class="card-header d-flex align-items-center gap-2">
            <i class="bi bi-geo-alt" style="color: var(--kei-beige);"></i>
            <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">Información de Envío</h2>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Dirección</div>
                <div style="color: var(--kei-casi-negro);">{{ order.direccion_envio }}</div>
              </div>
              <div v-if="order.email_contacto" class="col-12 col-md-6">
                <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Email de contacto</div>
                <div style="color: var(--kei-casi-negro);">{{ order.email_contacto }}</div>
              </div>
              <div v-if="order.telefono_contacto" class="col-12 col-md-6">
                <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Teléfono</div>
                <div style="color: var(--kei-casi-negro);">{{ order.telefono_contacto }}</div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="order.url_guia" class="card shadow-sm">
          <div class="card-header d-flex align-items-center gap-2">
            <i class="bi bi-file-earmark-image" style="color: var(--kei-beige);"></i>
            <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">Imagen de Guía</h2>
          </div>
          <div class="card-body text-center">
            <img :src="order.url_guia" alt="Guía del pedido" class="img-fluid rounded-3 border" style="max-height: 480px; border-color: var(--kei-gris-claro) !important;" />
          </div>
        </section>

        <section class="card shadow-sm">
          <div class="card-header d-flex align-items-center gap-2">
            <i class="bi bi-bag" style="color: var(--kei-beige);"></i>
            <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">Productos</h2>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th class="ps-3 ps-md-4">Producto</th>
                    <th class="text-center">Cant.</th>
                    <th class="text-end">Precio unit.</th>
                    <th class="text-end pe-3 pe-md-4">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in order.detalles" :key="detalle.id">
                    <td class="ps-3 ps-md-4">
                      <div class="d-flex align-items-center gap-3">
                        <div class="rounded-2 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px; background-color: var(--kei-fondo);">
                          <img
                            v-if="detalle.producto?.imagen_url"
                            :src="detalle.producto.imagen_url"
                            :alt="detalle.producto.nombre"
                            class="w-100 h-100 object-fit-cover"
                          />
                          <span v-else class="fw-bold" style="color: var(--kei-beige);">{{ (detalle.nombre_producto || detalle.producto?.nombre || '?').charAt(0) }}</span>
                        </div>
                        <div class="d-flex flex-column">
                          <span class="fw-medium small" style="color: var(--kei-casi-negro);">{{ detalle.nombre_producto || detalle.producto?.nombre }}</span>
                          <span class="small text-uppercase" v-if="detalle.producto?.marca_nombre" style="color: var(--kei-beige); letter-spacing: 0.03em; font-size: 0.75rem;">{{ detalle.producto.marca_nombre }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="badge rounded-pill" style="background-color: var(--kei-fondo); color: var(--kei-casi-negro); border: 1px solid var(--kei-gris-claro);">{{ detalle.cantidad }}</span>
                    </td>
                    <td class="text-end" style="color: var(--kei-gris-medio);">{{ formatPrice(detalle.precio_unitario) }}</td>
                    <td class="text-end pe-3 pe-md-4 fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(detalle.subtotal) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="card shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-center">
            <span class="fw-medium" style="color: var(--kei-gris-medio);">Total</span>
            <span class="fs-4 fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(order.monto_total) }}</span>
          </div>
        </section>

        <div class="d-flex justify-content-end gap-2">
          <router-link to="/mis-pedidos" class="btn btn-outline-primary rounded-pill">
            <i class="bi bi-arrow-left me-2"></i>Volver a Pedidos
          </router-link>
          <router-link to="/catalogo" class="btn btn-primary rounded-pill">
            <i class="bi bi-bag me-2"></i>Seguir Comprando
          </router-link>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando pedido...</p>
    </div>

    <div v-else class="card shadow-sm text-center p-5">
      <div class="card-body">
        <i class="bi bi-exclamation-circle fs-1 mb-3 d-block" style="color: var(--kei-beige-medio);"></i>
        <h2 class="h5 fw-bold mb-2" style="color: var(--kei-casi-negro);">Pedido no encontrado</h2>
        <p class="mb-3" style="color: var(--kei-gris-medio);">{{ errorMessage || 'El pedido que buscas no existe o ha sido eliminado.' }}</p>
        <router-link to="/mis-pedidos" class="btn btn-primary rounded-pill">Volver a Mis Pedidos</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getOrderById } from '../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const order = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const statusLabels = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
}

function statusLabel(status) {
  return statusLabels[status] || status
}

function statusClass(status) {
  return `status-${status}`
}

function statusIcon(status) {
  const map = {
    pendiente: 'bi bi-clock',
    confirmado: 'bi bi-check-circle',
    enviado: 'bi bi-truck',
    entregado: 'bi bi-box-seam',
    cancelado: 'bi bi-x-circle'
  }
  return map[status] || 'bi bi-circle'
}

function statusBadgeStyle(status) {
  const styles = {
    pendiente: 'background-color: var(--kei-beige-claro); color: var(--kei-casi-negro); border: 1px solid var(--kei-beige-medio);',
    confirmado: 'background-color: var(--kei-fondo); color: var(--kei-gris-oscuro); border: 1px solid var(--kei-gris-claro);',
    enviado: 'background-color: var(--kei-beige); color: #fff;',
    entregado: 'background-color: var(--kei-gris-oscuro); color: #fff;',
    cancelado: 'background-color: #f8e8e8; color: #7a3a3a; border: 1px solid #e0c0c0;'
  }
  return styles[status] || 'background-color: var(--kei-fondo); color: var(--kei-casi-negro); border: 1px solid var(--kei-gris-claro);'
}

async function loadOrder() {
  loading.value = true
  errorMessage.value = ''
  try {
    const orderId = route.params.id
    const guestToken = route.query.guest_token || localStorage.getItem('guest_token')
    const emailContacto = route.query.email_contacto
    const result = await getOrderById(orderId, guestToken, emailContacto)
    order.value = result
  } catch (err) {
    console.error('Error loading order:', err)
    errorMessage.value = err.response?.data?.message || 'Error al cargar el pedido'
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
.object-fit-cover { object-fit: cover; }
</style>
