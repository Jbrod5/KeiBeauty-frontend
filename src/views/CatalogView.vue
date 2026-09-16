<template>
  <div class="catalog-view">
    <header class="catalog-header">
      <h1>Catálogo de Productos</h1>
      <p class="catalog-subtitle">Descubre nuestra selección de K-Beauty auténtico</p>
    </header>

    <div class="catalog-toolbar">
      <div class="search-box">
        <label for="search" class="sr-only">Buscar productos</label>
        <input
          id="search"
          type="search"
          v-model="searchQuery"
          placeholder="Buscar productos..."
          class="search-input"
        />
        <div class="search-icon">🔍</div>
      </div>

      <div class="filter-dropdown">
        <select
          v-model="selectedCategory"
          class="category-select"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
    </div>

    <div class="active-filters" v-if="selectedCategory || searchQuery">
      <span class="filter-chip" v-if="selectedCategory">
        Categoría: {{ getCategoryName(selectedCategory) }}
        <button @click="selectedCategory = ''" aria-label="Eliminar filtro">×</button>
      </span>
      <span class="filter-chip" v-if="searchQuery">
        Búsqueda: "{{ searchQuery }}"
        <button @click="searchQuery = ''" aria-label="Eliminar filtro">×</button>
      </span>
      <button class="btn btn-link clear-all" @click="clearFilters">Limpiar todo</button>
    </div>

<main class="products-grid">
        <router-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/producto/${product.id}`"
          :class="['product-card-link', { 'out-of-stock': product.stock === 0 }]"
        >
          <div class="product-card">
            <div class="product-image">
              <img 
                v-show="product.imagen_url" 
                :src="product.imagen_url" 
                :alt="product.nombre" 
                class="product-img"
                @error="handleImageError($event, product)"
              />
              <span v-show="!product.imagen_url || product.imageError" class="product-placeholder">{{ product.nombre.charAt(0) }}</span>
              <span class="stock-badge" :class="{ 'in-stock': product.stock > 0, 'out-of-stock-badge': product.stock === 0 }">
                {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
              </span>
              <button
                class="favorite-btn"
                :class="{ 'active': product.es_favorito }"
                @click.stop.prevent="toggleFavorito(product, $event)"
                :aria-label="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                :title="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
              >
                <span class="heart-icon" v-if="product.es_favorito">♥</span>
                <span class="heart-icon" v-else>♡</span>
              </button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.nombre }}</h3>
              <p class="product-brand">{{ product.marca_nombre }}</p>
              <p class="product-description">{{ product.descripcion }}</p>
              <p class="product-size" v-if="product.tamano">Tamaño: {{ product.tamano }}</p>
              <div class="product-footer">
                <span class="product-price">{{ formatPrice(product.precio) }}</span>
                <button 
                  class="add-to-cart-btn" 
                  @click.stop.prevent="addToCart(product)"
                  :disabled="addingToCart === product.id || product.stock === 0"
                >
                  <span v-if="addingToCart !== product.id && product.stock > 0">Añadir</span>
                  <span v-else-if="addingToCart === product.id" class="loading">⟳</span>
                  <span v-else>Sin stock</span>
                </button>
              </div>
            </div>
          </div>
        </router-link>
      </main>

    <div class="empty-state" v-if="products.length === 0 && !loading">
      <div class="empty-icon">🔍</div>
      <p>No encontramos productos con esos filtros</p>
      <button class="btn btn-outline" @click="clearFilters">Limpiar filtros</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { useFavoritosStore } from '../stores/favoritosStore'
import { useAuthStore } from '../stores/authStore'
import { getProducts, getCategories } from '../services/api'

const toast = useToast()

const products = ref([])
const loading = ref(true)
const addingToCart = ref(null)
const cartStore = useCartStore()
const favoritosStore = useFavoritosStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ref([])
const debounceTimer = ref(null)

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function handleImageError(event, product) {
  if (!event?.target) return
  product.imageError = true
}

function getCategoryName(catId) {
  const cat = categories.value.find(c => c.id === Number(catId))
  return cat ? cat.nombre : ''
}

async function loadProducts() {
  try {
    loading.value = true
    const params = {}
    if (selectedCategory.value) params.categoria = selectedCategory.value
    if (searchQuery.value) params.buscar = searchQuery.value
    if (authStore.isAuthenticated) params.con_favorito = 1
    
    const data = await getProducts(params)
    products.value = data.map(p => ({ ...p, imageError: false }))
  } catch (error) {
    console.error('Error loading products:', error)
    toast.error('Error al cargar productos')
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const result = await getCategories()
    categories.value = result.data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

async function loadFavoritos() {
  if (authStore.isAuthenticated) {
    await favoritosStore.fetchFavoritos()
  }
}

async function addToCart(product) {
  addingToCart.value = product.id
  try {
    await cartStore.addItem(product)
    toast.success('Producto añadido al carrito')
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('Error al añadir al carrito')
  } finally {
    addingToCart.value = null
  }
}

async function toggleFavorito(product, event) {
  event.stopPropagation()
  event.preventDefault()
  
  if (!authStore.isAuthenticated) {
    toast.info('Iniciá sesión para guardar favoritos')
    return
  }
  
  await favoritosStore.toggle(product.id)
  // Actualizar el estado local del producto
  const prod = products.value.find(p => p.id === product.id)
  if (prod) {
    prod.es_favorito = favoritosStore.esFavorito(product.id)
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
}

watch(searchQuery, () => {
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    loadProducts()
  }, 300)
})

watch(selectedCategory, () => {
  loadProducts()
})

onMounted(async () => {
  await loadCategories()
  await loadProducts()
  await loadFavoritos()
})
</script>

<style scoped>
.catalog-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.catalog-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
}

.catalog-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.catalog-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.catalog-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  max-width: 500px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  pointer-events: none;
}

.filter-dropdown {
  min-width: 200px;
}

.category-select {
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.category-select:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: #fef8fa;
  border-radius: 0.5rem;
  border: 1px solid #f5d0da;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e91e63;
  border-radius: 50px;
  font-size: 0.85rem;
  color: #e91e63;
  font-weight: 500;
}

.filter-chip button {
  background: none;
  border: none;
  color: #e91e63;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.filter-chip button:hover {
  background: rgba(233, 30, 99, 0.1);
}

.clear-all {
  color: #e91e63;
  font-size: 0.85rem;
  font-weight: 500;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.product-image {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  position: relative;
  overflow: hidden;
}

.favorite-btn {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  z-index: 3;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.heart-icon {
  font-size: 1.25rem;
  line-height: 1;
  color: #999;
  transition: color 0.2s, transform 0.2s;
}

.favorite-btn.active .heart-icon {
  color: #e91e63;
}

.favorite-btn.active:hover .heart-icon {
  transform: scale(1.2);
}

.stock-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.stock-badge.in-stock {
  background: #2e7d32;
  color: white;
}

.stock-badge.out-of-stock-badge {
  background: #c62828;
  color: white;
}

.product-card.out-of-stock {
  opacity: 0.6;
  border: 2px solid #f5c6cb;
}

.product-card.out-of-stock:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.product-card.out-of-stock .product-img {
  transform: none;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
  color: #e91e63;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-brand {
  font-size: 0.8rem;
  color: #e91e63;
  font-weight: 500;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-description {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.add-to-cart-btn {
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #c2185b;
}

.add-to-cart-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-to-cart-btn .loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .catalog-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-dropdown {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .catalog-header h1 {
    font-size: 2rem;
  }
}
</style>