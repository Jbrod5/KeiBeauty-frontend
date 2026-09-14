<template>
  <div class="product-detail-view" v-if="product">
    <nav class="breadcrumb" aria-label="Navegación">
      <router-link to="/">Inicio</router-link>
      <span class="separator">/</span>
      <router-link to="/catalogo">Catálogo</router-link>
      <span class="separator">/</span>
      <span>{{ product.nombre }}</span>
    </nav>

    <div class="product-detail">
      <div class="product-gallery">
        <div class="main-image">
          <img 
            v-if="product.imagen_url" 
            :src="product.imagen_url" 
            :alt="product.nombre"
            class="detail-img"
          />
          <div v-else class="detail-placeholder">{{ product.nombre.charAt(0) }}</div>
        </div>
      </div>

      <div class="product-info-detail">
        <p class="product-brand-detail">{{ product.marca_nombre }}</p>
        <h1 class="product-name-detail">{{ product.nombre }}</h1>
        
        <div class="product-price-detail">{{ formatPrice(product.precio) }}</div>
        
        <div class="product-stock" :class="stockClass">
          <span v-if="product.stock > 10">🟢 En stock ({{ product.stock }} unidades)</span>
          <span v-else-if="product.stock > 0">🟡 Pocas unidades ({{ product.stock }} restantes)</span>
          <span v-else class="out-of-stock">🔴 Agotado</span>
        </div>

        <div class="product-description-detail">
          <h3>Descripción</h3>
          <p>{{ product.descripcion }}</p>
        </div>

        <div class="product-details-grid" v-if="product.ingredientes_clave || product.tipo_piel">
          <div class="detail-item" v-if="product.ingredientes_clave">
            <strong>Ingredientes clave:</strong>
            <span>{{ product.ingredientes_clave }}</span>
          </div>
          <div class="detail-item" v-if="product.tipo_piel">
            <strong>Tipo de piel:</strong>
            <span>{{ product.tipo_piel }}</span>
          </div>
          <div class="detail-item">
            <strong>Categoría:</strong>
            <span>{{ product.categoria_nombre }}</span>
          </div>
          <div class="detail-item">
            <strong>Marca:</strong>
            <span>{{ product.marca_nombre }}</span>
          </div>
        </div>

        <div class="product-actions">
          <button 
            class="btn btn-primary btn-add-cart"
            @click="addToCart"
            :disabled="product.stock === 0 || addingToCart"
          >
            <span v-if="!addingToCart">Añadir al carrito</span>
            <span v-else class="loading">⟳</span>
          </button>
          <button class="btn btn-outline btn-wishlist" @click="toggleWishlist">
            ♡
          </button>
        </div>

        <div class="quantity-selector" v-if="product.stock > 0">
          <label for="quantity">Cantidad:</label>
          <div class="quantity-controls">
            <button @click="decreaseQty" :disabled="quantity === 1" aria-label="Disminuir">−</button>
            <input 
              id="quantity" 
              type="number" 
              v-model.number="quantity" 
              :min="1" 
              :max="product.stock"
              @change="clampQuantity"
            />
            <button @click="increaseQty" :disabled="quantity >= product.stock" aria-label="Aumentar">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="loading-state" v-else-if="loading">
    <div class="spinner"></div>
    <p>Cargando producto...</p>
  </div>

  <div class="error-state" v-else>
    <h2>Producto no encontrado</h2>
    <p>{{ errorMessage || 'El producto que buscas no existe o ha sido eliminado.' }}</p>
    <router-link to="/catalogo" class="btn btn-primary">Volver al catálogo</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { getProductById } from '../services/api'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const addingToCart = ref(false)
const quantity = ref(1)

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

const stockClass = computed(() => {
  if (!product.value) return ''
  if (product.value.stock === 0) return 'out-of-stock'
  if (product.value.stock <= 10) return 'low-stock'
  return 'in-stock'
})

async function loadProduct() {
  try {
    loading.value = true
    errorMessage.value = ''
    product.value = await getProductById(route.params.id)
    quantity.value = 1
  } catch (error) {
    console.error('Error loading product:', error)
    if (error.response?.status === 404) {
      errorMessage.value = 'Producto no encontrado.'
    } else {
      errorMessage.value = 'Error al cargar el producto. Intenta de nuevo.'
    }
    product.value = null
  } finally {
    loading.value = false
  }
}

function addToCart() {
  if (!product.value || product.value.stock === 0) return
  
  addingToCart.value = true
  try {
    const productToAdd = { ...product.value }
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(productToAdd)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    addingToCart.value = false
  }
}

function increaseQty() {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function clampQuantity() {
  if (quantity.value < 1) quantity.value = 1
  if (quantity.value > product.value.stock) quantity.value = product.value.stock
}

function toggleWishlist() {
  // TODO: Implementar wishlist
}

watch(() => route.params.id, () => {
  loadProduct()
})

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #e91e63;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: #999;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 2rem;
}

.product-gallery {
  position: relative;
}

.main-image {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-placeholder {
  font-size: 6rem;
  font-weight: 600;
  color: #e91e63;
}

.product-info-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-brand-detail {
  font-size: 0.9rem;
  color: #e91e63;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name-detail {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.product-price-detail {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.product-stock {
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  display: inline-block;
}

.product-stock.in-stock {
  background: #e8f5e9;
  color: #2e7d32;
}

.product-stock.low-stock {
  background: #fff8e1;
  color: #f57f17;
}

.product-stock.out-of-stock {
  background: #fdeaea;
  color: #c62828;
}

.product-description-detail {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.product-description-detail h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.product-description-detail p {
  color: #555;
  line-height: 1.7;
}

.product-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 1rem 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item strong {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  color: #333;
  font-size: 0.95rem;
}

.product-actions {
  display: flex;
  gap: 1rem;
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
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: #c2185b;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #e91e63;
  border: 1px solid #e91e63;
  width: 56px;
}

.btn-outline:hover {
  background: #e91e63;
  color: white;
}

.btn-add-cart .loading {
  animation: spin 1s linear infinite;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.quantity-selector label {
  font-weight: 500;
  color: #333;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #e91e63;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 70px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 1rem;
}

.quantity-controls input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state h2 {
  color: #2c3e50;
}

.error-state p {
  color: #666;
  max-width: 400px;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  
  .product-name-detail {
    font-size: 1.5rem;
  }
  
  .product-price-detail {
    font-size: 2rem;
  }
  
  .product-details-grid {
    grid-template-columns: 1fr;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .btn-outline {
    width: 100%;
  }
}
</style>