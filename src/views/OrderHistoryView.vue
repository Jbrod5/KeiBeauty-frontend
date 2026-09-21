<template>
  <div class="container py-4" style="max-width: 880px;">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Mis Pedidos</h1>
      <p style="color: var(--kei-gris-medio);">Historial de tus compras</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando pedidos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex flex-column align-items-center text-center gap-3 py-4" role="alert">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill fs-5"></i>
        <span>{{ error }}</span>
      </div>
      <button class="btn btn-primary" @click="loadOrders">Reintentar</button>
    </div>

    <div v-else-if="orders.length === 0" class="card shadow-sm text-center p-5">
      <div class="card-body">
        <i class="bi bi-box-seam fs-1 mb-3 d-block" style="color: var(--kei-beige-medio);"></i>
        <p class="fs-5 mb-3" style="color: var(--kei-gris-medio);">No tienes pedidos aún</p>
        <router-link to="/catalogo" class="btn btn-primary rounded-pill px-4">
          <i class="bi bi-bag me-2"></i>Ir al Catálogo
        </router-link>
      </div>
    </div>

    <div v-else>
      <div class="d-flex flex-column gap-3">
        <div v-for="order in orders" :key="order.id" class="card shadow-sm">
          <div class="card-body p-3 p-md-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 pb-3 mb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
              <div>
                <h3 class="h6 fw-bold mb-1" style="color: var(--kei-casi-negro);">
                  <i class="bi bi-receipt me-2" style="color: var(--kei-beige);"></i>Pedido #{{ order.id }}
                </h3>
                <span class="small" style="color: var(--kei-gris-medio);">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(order.fecha_pedido) }}
                </span>
              </div>
              <span class="badge rounded-pill text-uppercase px-3 py-2" :style="statusBadgeStyle(order.estado)">
                <i :class="statusIcon(order.estado)" class="me-1"></i>{{ statusLabel(order.estado) }}
              </span>
            </div>

            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div class="d-flex align-items-center gap-2">
                <span style="color: var(--kei-gris-medio);">Total:</span>
                <span class="fs-5 fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(order.monto_total) }}</span>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <router-link :to="`/mis-pedidos/${order.id}`" class="btn btn-outline-primary btn-sm rounded-pill">
                  <i class="bi bi-eye me-1"></i>Ver Detalle
                </router-link>
                <a v-if="order.url_guia" :href="order.url_guia" target="_blank" class="btn btn-outline-secondary btn-sm rounded-pill">
                  <i class="bi bi-file-earmark-image me-1"></i>Ver Guía
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="pagination.pages > 1" class="d-flex justify-content-center align-items-center gap-3 mt-4 pt-4 border-top" style="border-color: var(--kei-gris-claro) !important;" aria-label="Paginación pedidos">
        <button class="btn btn-outline-primary btn-sm rounded-pill" @click="prevPage" :disabled="pagination.page <= 1">
          <i class="bi bi-chevron-left me-1"></i>Anterior
        </button>
        <span class="small fw-medium" style="color: var(--kei-gris-medio);">Página {{ pagination.page }} de {{ pagination.pages }}</span>
        <button class="btn btn-outline-primary btn-sm rounded-pill" @click="nextPage" :disabled="pagination.page >= pagination.pages">
          Siguiente<i class="bi bi-chevron-right ms-1"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '../services/api'

const router = useRouter()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const pagination = ref({
  page: 1,
  per_page: 10,
  total: 0,
  pages: 0
})

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

async function loadOrders() {
  loading.value = true
  error.value = ''
  try {
    const result = await getOrders({
      page: pagination.value.page,
      per_page: pagination.value.per_page
    })
    orders.value = result.data
    pagination.value = result.pagination
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar pedidos'
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (pagination.value.page < pagination.value.pages) {
    pagination.value.page++
    loadOrders()
  }
}

function prevPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    loadOrders()
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
</style>
