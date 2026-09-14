<template>
  <div class="catalog-view">
    <header class="catalog-header">
      <h1>Catálogo de Productos</h1>
      <p class="catalog-subtitle">Descubre nuestra selección de K-Beauty auténtico</p>
    </header>

    <div class="catalog-content">
      <aside class="filters" v-if="false">
        <h3>Filtros</h3>
        <div class="filter-group">
          <label>
            <input type="checkbox" v-model="filters.category" value="limpieza" /> Limpieza
          </label>
          <label>
            <input type="checkbox" v-model="filters.category" value="tonico" /> Tónico
          </label>
          <label>
            <input type="checkbox" v-model="filters.category" value="serum" /> Sérum
          </label>
          <label>
            <input type="checkbox" v-model="filters.category" value="crema" /> Crema
          </label>
          <label>
            <input type="checkbox" v-model="filters.category" value="protector" /> Protector Solar
          </label>
        </div>
      </aside>

      <main class="products-grid">
        <router-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/producto/${product.id}`"
          class="product-card-link"
        >
          <div class="product-card">
          <div class="product-image">
            <img 
              v-if="product.imagen_url" 
              :src="product.imagen_url" 
              :alt="product.nombre" 
              class="product-img"
              @error="handleImageError($event)"
            />
            <span v-else class="product-placeholder">{{ product.nombre.charAt(0) }}</span>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.nombre }}</h3>
            <p class="product-brand">{{ product.marca_nombre }}</p>
            <p class="product-description">{{ product.descripcion }}</p>
            <div class="product-footer">
              <span class="product-price">{{ formatPrice(product.precio) }}</span>
              <button 
                class="add-to-cart-btn" 
                @click.stop="addToCart(product)"
                :disabled="addingToCart === product.id"
              >
                <span v-if="addingToCart !== product.id">Añadir</span>
                <span v-else class="loading">⟳</span>
              </button>
            </div>
          </div>
        </div>
        </router-link>
      </main>
    </div>

    <div class="empty-state" v-if="products.length === 0">
      <p>No hay productos disponibles en este momento.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { getProducts } from '../services/api'

const products = ref([])
const loading = ref(true)
const addingToCart = ref(null)
const cartStore = useCartStore()

const filters = ref({
  category: []
})

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function handleImageError(event) {
  event.target.style.display = 'none'
  event.target.nextElementSibling.style.display = 'flex'
}

async function loadProducts() {
  try {
    loading.value = true
    products.value = await getProducts()
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

async function addToCart(product) {
  addingToCart.value = product.id
  try {
    cartStore.addItem(product)
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    addingToCart.value = null
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.catalog-view {
  max-width: 1200px;
  margin: 0 auto;
}

.catalog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.catalog-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.catalog-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.catalog-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: fit-content;
}

.filters h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: #555;
}

.filter-group input {
  margin-right: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-image {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  display: none;
  font-size: 3rem;
  font-weight: 600;
  color: #e91e63;
  background: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-brand {
  font-size: 0.85rem;
  color: #e91e63;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.add-to-cart-btn {
  padding: 0.5rem 1.25rem;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card-link:hover .product-card {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #c2185b;
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-to-cart-btn .loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

@media (max-width: 768px) {
  .catalog-content {
    grid-template-columns: 1fr;
  }
  
  .filters {
    display: none;
  }
}
</style>