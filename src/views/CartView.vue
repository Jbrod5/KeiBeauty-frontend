<template>
  <div class="cart-view">
    <header class="cart-header">
      <h1>Carrito de Compras</h1>
    </header>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>🛒 Tu carrito está vacío</p>
      <router-link to="/catalogo" class="btn btn-primary">Ir al Catálogo</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
          <div class="item-info">
<<<<<<< HEAD
            <div class="item-image">
              <img 
                v-if="item.imagen_url" 
                :src="item.imagen_url" 
                :alt="item.nombre" 
                class="cart-item-img"
              />
              <span v-else class="item-placeholder">{{ item.nombre.charAt(0) }}</span>
            </div>
            <div class="item-details">
              <h3>{{ item.nombre }}</h3>
              <p class="item-brand">{{ item.marca_nombre }}</p>
            </div>
          </div>
          <div class="item-price">{{ formatPrice(item.precio) }}</div>
          <div class="item-quantity">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="qty-btn" :disabled="item.quantity <= 1" aria-label="Disminuir">−</button>
            <span class="qty">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="qty-btn" aria-label="Aumentar">+</button>
          </div>
          <div class="item-subtotal">{{ formatPrice(item.precio * item.quantity) }}</div>
=======
            <span class="item-emoji">{{ item.emoji }}</span>
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-brand">{{ item.brand }}</p>
            </div>
          </div>
          <div class="item-price">{{ item.price.toFixed(2) }}€</div>
          <div class="item-quantity">
            <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="qty-btn">−</button>
            <span class="qty">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="qty-btn">+</button>
          </div>
          <div class="item-subtotal">{{ (item.price * item.quantity).toFixed(2) }}€</div>
>>>>>>> feat/auth
          <button @click="cartStore.removeItem(item.id)" class="remove-btn" aria-label="Eliminar">✕</button>
        </div>
      </div>

      <aside class="cart-summary">
        <h2>Resumen</h2>
        <div class="summary-row">
          <span>Subtotal ({{ cartStore.totalItems }} items)</span>
<<<<<<< HEAD
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
=======
          <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
>>>>>>> feat/auth
        </div>
        <div class="summary-row">
          <span>Envío</span>
          <span>Gratis</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
<<<<<<< HEAD
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
=======
          <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
>>>>>>> feat/auth
        </div>
        <button class="btn btn-primary btn-block checkout-btn" @click="goToCheckout">
          Proceder al Pago
        </button>
        <router-link to="/catalogo" class="btn btn-outline btn-block">Seguir Comprando</router-link>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()

<<<<<<< HEAD
const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function goToCheckout() {
  // TODO: Implementar checkout (Paso 3B)
  alert('Checkout pendiente de implementar (Paso 3B)')
=======
function goToCheckout() {
  // TODO: Implementar checkout
  alert('Checkout pendiente de implementar')
>>>>>>> feat/auth
}
</script>

<style scoped>
.cart-view {
  max-width: 1000px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 2rem;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-cart p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

<<<<<<< HEAD
.item-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-placeholder {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e91e63;
=======
.item-emoji {
  font-size: 2rem;
>>>>>>> feat/auth
}

.item-details h3 {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.item-brand {
  font-size: 0.85rem;
  color: #e91e63;
  font-weight: 500;
}

.item-price {
  font-weight: 600;
  color: #333;
<<<<<<< HEAD
  white-space: nowrap;
=======
>>>>>>> feat/auth
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

<<<<<<< HEAD
.qty-btn:hover:not(:disabled) {
=======
.qty-btn:hover {
>>>>>>> feat/auth
  background: #f5f5f5;
  border-color: #e91e63;
}

<<<<<<< HEAD
.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

=======
>>>>>>> feat/auth
.qty {
  min-width: 2rem;
  text-align: center;
  font-weight: 500;
}

.item-subtotal {
  font-weight: 600;
  color: #2c3e50;
<<<<<<< HEAD
  min-width: 90px;
  text-align: right;
  white-space: nowrap;
=======
  min-width: 70px;
  text-align: right;
>>>>>>> feat/auth
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #e53935;
}

.cart-summary {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary h2 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
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

.checkout-btn {
  margin-top: 1rem;
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
<<<<<<< HEAD
  cursor: pointer
=======
  cursor: pointer;
>>>>>>> feat/auth
}

.btn-primary {
  background: #e91e63;
  color: white;
}

.btn-primary:hover {
  background: #c2185b;
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

.btn-block {
  width: 100%;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .item-info {
    grid-column: 1 / 3;
  }
  
  .item-price {
    grid-column: 2;
    text-align: right;
  }
  
  .item-quantity {
    grid-column: 1 / 3;
    justify-content: flex-start;
  }
  
  .item-subtotal {
    grid-column: 2;
    text-align: right;
  }
  
  .remove-btn {
    grid-column: 2;
    justify-self: end;
  }
}
</style>