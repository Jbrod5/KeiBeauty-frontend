<template>
  <div class="admin-orders-view">
    <header class="admin-header">
      <h1>Gestión de Pedidos</h1>
      <p class="admin-subtitle">Administra todos los pedidos de la tienda</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando pedidos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="loadOrders">Reintentar</button>
    </div>

    <div v-else class="admin-orders">
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td><strong>#{{ order.id }}</strong></td>
              <td>
                <div class="customer-info">
                  <span class="customer-name">{{ order.usuario?.nombre || 'Usuario #' + order.usuario_id }}</span>
                  <span class="customer-email">{{ order.usuario?.email }}</span>
                </div>
              </td>
              <td>{{ formatDate(order.fecha_pedido) }}</td>
              <td>{{ formatPrice(order.monto_total) }}</td>
              <td>
                <span class="order-status" :class="statusClass(order.estado)">
                  {{ statusLabel(order.estado) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <select 
                    v-model="order.estado" 
                    @change="updateOrderStatus(order.id, order.estado)"
                    :disabled="updatingStatus === order.id"
                    class="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <router-link :to="`/admin/pedidos/${order.id}`" class="btn btn-outline btn-sm" style="margin-left: 0.5rem;">Ver</router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
import { getOrders as apiGetOrders, updateOrderStatus as apiUpdateOrderStatus } from '../services/api'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const orders = ref([])
const loading = ref(true)
const error = ref('')
const updatingStatus = ref(null)
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

async function loadOrders() {
  loading.value = true
  error.value = ''
  try {
    const result = await apiGetOrders({
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

async function updateOrderStatus(orderId, estado) {
  updatingStatus.value = orderId
  try {
    await apiUpdateOrderStatus(orderId, estado)
    // Order updated in place via v-model
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al actualizar estado'
    // Reload to revert the select
    loadOrders()
  } finally {
    updatingStatus.value = null
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
  // Check admin access
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  loadOrders()
})
</script>

<style scoped>
.admin-orders-view {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.admin-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orders-table td {
  color: #333;
}

.orders-table tr:hover td {
  background: #fafafa;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.customer-name {
  font-weight: 500;
  color: #333;
}

.customer-email {
  font-size: 0.8rem;
  color: #999;
}

.order-status {
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
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

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-select {
  padding: 0.375rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  background: white;
  cursor: pointer;
  min-width: 140px;
}

.status-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  border: none;
  cursor: pointer;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
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

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .orders-table {
    min-width: 800px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .status-select {
    width: 100%;
  }
}
</style>