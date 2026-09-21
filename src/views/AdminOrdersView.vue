<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Gestión de Pedidos</h1>
      <p style="color: var(--kei-gris-medio);">Administra todos los pedidos de la tienda</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando pedidos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex flex-column align-items-center text-center gap-3" role="alert">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ error }}</span>
      </div>
      <button class="btn btn-primary btn-sm rounded-pill" @click="loadOrders">Reintentar</button>
    </div>

    <div v-else>
      <!-- Filtro -->
      <div class="card shadow-sm mb-4">
        <div class="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
          <label for="filtro-estado" class="form-label mb-0 fw-medium d-inline-flex align-items-center gap-2" style="color: var(--kei-casi-negro);">
            <i class="bi bi-funnel" style="color: var(--kei-beige);"></i>Filtrar por estado:
          </label>
          <select id="filtro-estado" v-model="filtroEstado" @change="loadOrders" class="form-select w-auto" style="min-width: 200px;">
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-3">ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th class="pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ order.id }}</span></td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="fw-medium" style="color: var(--kei-casi-negro);">{{ order.usuario?.nombre || 'Usuario #' + order.usuario_id }}</span>
                    <span class="small" style="color: var(--kei-beige-medio);">{{ order.usuario?.email }}</span>
                  </div>
                </td>
                <td class="small" style="color: var(--kei-gris-medio);">{{ formatDate(order.fecha_pedido) }}</td>
                <td class="fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(order.monto_total) }}</td>
                <td>
                  <span class="badge rounded-pill text-uppercase px-3 py-2" :style="statusBadgeStyle(order.estado)">
                    <i :class="statusIcon(order.estado)" class="me-1"></i>{{ statusLabel(order.estado) }}
                  </span>
                </td>
                <td class="pe-3">
                  <div class="d-flex flex-wrap align-items-center gap-2">
                    <select
                      v-model="order.estado"
                      @change="updateOrderStatus(order.id, order.estado)"
                      :disabled="updatingStatus === order.id"
                      class="form-select form-select-sm w-auto"
                      style="min-width: 140px;"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    <router-link :to="`/admin/pedidos/${order.id}`" class="btn btn-outline-primary btn-sm rounded-pill">
                      <i class="bi bi-eye me-1"></i>Ver
                    </router-link>
                    <label :for="`guia-${order.id}`" class="btn btn-outline-secondary btn-sm rounded-pill mb-0" style="cursor: pointer;">
                      <i class="bi bi-cloud-arrow-up me-1"></i>Guía
                    </label>
                    <input :id="`guia-${order.id}`" type="file" accept="image/*" class="d-none" @change="handleGuiaUpload(order.id, $event)">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <nav v-if="pagination.pages > 1" class="d-flex justify-content-center align-items-center gap-3 mt-4 pt-4 border-top" style="border-color: var(--kei-gris-claro) !important;" aria-label="Paginación">
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
import { getOrders as apiGetOrders, updateOrderStatus as apiUpdateOrderStatus, uploadGuia } from '../services/api'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const updatingStatus = ref(null)
const uploadingGuia = ref(null)
const filtroEstado = ref('pendiente')
const pagination = ref({
  page: 1,
  per_page: 15,
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
    month: 'short',
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
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.per_page
    }
    if (filtroEstado.value) {
      params.estado = filtroEstado.value
    }
    const result = await apiGetOrders(params)
    orders.value = result.data
    pagination.value = result.pagination
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cargar pedidos'
  } finally {
    loading.value = false
  }
}

async function updateOrderStatus(orderId, estado) {
  updatingStatus.value = orderId
  try {
    await apiUpdateOrderStatus(orderId, estado)
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al actualizar estado'
    loadOrders()
  } finally {
    updatingStatus.value = null
  }
}

function handleGuiaUpload(orderId, event) {
  const archivo = event.target.files[0]
  if (!archivo) return
  uploadingGuia.value = orderId
  uploadGuia(orderId, archivo)
    .then((res) => {
      const pedido = orders.value.find(o => o.id === orderId)
      if (pedido && res && res.data) {
        pedido.url_guia = res.data.url_guia
      }
    })
    .catch((err) => {
      error.value = err.response?.data?.message || 'Error al subir imagen de guía'
    })
    .finally(() => {
      uploadingGuia.value = null
      event.target.value = ''
    })
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
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  loadOrders()
})
</script>

<style scoped>
</style>
