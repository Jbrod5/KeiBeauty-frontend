<template>
  <div class="order-detail-view" v-if="order">
    <header class="order-detail-header">
      <router-link to="/mis-pedidos" class="back-link">
        ← Volver a Mis Pedidos
      </router-link>
      <h1>Detalle del Pedido #{{ order.id }}</h1>
      <div class="order-meta">
        <span class="order-date">{{ formatDate(order.fecha_pedido) }}</span>
        <span class="order-status" :class="statusClass(order.estado)">{{ statusLabel(order.estado) }}</span>
      </div>
    </header>

    <div class="order-detail-content">
      <section class="shipping-info">
        <h2>Información de Envío</h2>
        <dl class="shipping-details">
          <div>
            <dt>Dirección</dt>
            <dd>{{ order.direccion_envio }}</dd>
          </div>
          <div v-if="order.email_contacto">
            <dt>Email de contacto</dt>
            <dd>{{ order.email_contacto }}</dd>
          </div>
          <div v-if="order.telefono_contacto">
            <dt>Teléfono</dt>
            <dd>{{ order.telefono_contacto }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="order.url_guia" class="guide-image">
        <h2>Imagen de Guía</h2>
        <img :src="order.url_guia" alt="Guía del pedido" class="guide-img" />
      </section>

      <section class="order-items">
        <h2>Productos</h2>
        <div class="items-table-container">
          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-right">Precio unit.</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle in order.detalles" :key="detalle.id">
                <td>
                  <div class="product-cell">
                    <div class="product-image">
                      <img 
                        v-if="detalle.producto?.imagen_url" 
                        :src="detalle.producto.imagen_url" 
                        :alt="detalle.producto.nombre"
                      />
                      <span v-else class="product-placeholder">{{ (detalle.nombre_producto || detalle.producto?.nombre || '?').charAt(0) }}</span>
                    </div>
                    <div class="product-info">
                      <span class="product-name">{{ detalle.nombre_producto || detalle.producto?.nombre }}</span>
                      <span class="product-brand" v-if="detalle.producto?.marca_nombre">{{ detalle.producto.marca_nombre }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center">{{ detalle.cantidad }}</td>
                <td class="text-right">{{ formatPrice(detalle.precio_unitario) }}</td>
                <td class="text-right">{{ formatPrice(detalle.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="order-total">
        <div class="total-row">
          <span>Total</span>
          <span class="total-amount">{{ formatPrice(order.monto_total) }}</span>
        </div>
      </section>

      <div class="order-actions">
        <router-link to="/mis-pedidos" class="btn btn-outline">Volver a Mis Pedidos</router-link>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando pedido...</p>
  </div>

  <div v-else class="error-state">
    <h2>Pedido no encontrado</h2>
    <p>{{ errorMessage || 'El pedido que buscas no existe o ha sido eliminado.' }}</p>
    <router-link to="/mis-pedidos" class="btn btn-primary">Volver a Mis Pedidos</router-link>
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
.order-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.order-detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #e91e63;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.order-detail-header h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.order-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.order-date {
  color: #666;
  font-size: 0.9rem;
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
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-entregado {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-cancelado {
  background: #fce4ec;
  color: #c62828;
}

.order-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.shipping-info,
.order-items,
.order-total {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.5rem;
}

.shipping-info h2,
.order-items h2 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.shipping-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.shipping-details div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.shipping-details dt {
  font-size: 0.8rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shipping-details dd {
  font-size: 0.95rem;
  color: #333;
  margin: 0;
}

.items-table-container {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.items-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.items-table td {
  color: #333;
}

.items-table tbody tr:hover td {
  background: #fafafa;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-image {
  width: 50px;
  height: 50px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e91e63;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.product-name {
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-brand {
  font-size: 0.75rem;
  color: #e91e63;
  font-weight: 500;
}

.order-total {
  text-align: right;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row span:first-child {
  color: #666;
  font-size: 1rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.order-actions {
  text-align: right;
  padding-top: 1rem;
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
  .order-detail-header h1 {
    font-size: 1.5rem;
  }
  
  .order-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .order-items-preview .item-details {
    flex-direction: column;
  }
  
  .order-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>