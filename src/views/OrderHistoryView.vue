<template>
  <div class="orders-view">
    <header class="orders-header">
      <h1>Mis Pedidos</h1>
      <p class="orders-subtitle">Historial de tus compras</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando pedidos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadOrders">Reintentar</button>
    </div>

    <div v-else-if="orders.length === 0" class="empty-orders">
      <p>📦 No tienes pedidos aún</p>
      <router-link to="/catalogo" class="btn btn-primary">Ir al Catálogo</router-link>
    </div>

    <div v-else class="orders-list">
      <div class="order-card" v-for="order in orders" :key="order.id">
        <div class="order-header">
          <div class="order-info">
            <h3>Pedido #{{ order.id }}</h3>
            <span class="order-date">{{ formatDate(order.fecha_pedido) }}</span>
          </div>
          <span class="order-status" :class="statusClass(order.estado)">
            {{ statusLabel(order.estado) }}
          </span>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>Total:</span>
            <span class="total-amount">{{ formatPrice(order.monto_total) }}</span>
          </div>
          <router-link :to="`/mis-pedidos/${order.id}`" class="btn btn-outline btn-sm">Ver Detalle</router-link>
          <a v-if="order.url_guia" :href="order.url_guia" target="_blank" class="btn btn-sm btn-outline" style="margin-left: 0.25rem;">Ver Guía</a>
        </div>
      </div>

      <div v-if="pagination.pages > 1" class="pagination">
        <button class="btn btn-outline" @click="prevPage" :disabled="pagination.page <= 1">Anterior</button>
        <span class="page-info">Página {{ pagination.page }} de {{ pagination.pages }}</span>
        <button class="btn btn-outline" @click="nextPage" :disabled="pagination.page >= pagination.pages">Siguiente</button>
      </div>
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
.orders-view {
  max-width: 800px;
  margin: 0 auto;
}

.orders-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.orders-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.orders-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.order-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.order-info h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.order-date {
  font-size: 0.85rem;
  color: #666;
}

.order-status {
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pendiente {
  background: #fff3e0;
  color: #e65100;
}

.status-confirmado {
  background: #e3f2fd;
  color: #1565c0;
}

.status-enviado {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-entregado {
  background: #e8f5e9;
  color: #1b5e20;
}

.status-cancelado {
  background: #fce4ec;
  color: #c62828;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-total span:first-child {
  color: #666;
  font-size: 0.95rem;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-sm {
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
}

.btn-outline {
  background: transparent;
  color: #e91e63;
  border: 1px solid #e91e63;
}

.btn-outline:hover {
  background: #e91e63;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.loading-state,
.error-state,
.empty-orders {
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

@keyframes spin {
  to { transform: rotate(360deg); }
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

.empty-orders {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 3rem 2rem;
}

.empty-orders p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 1.5rem;
}
</style>