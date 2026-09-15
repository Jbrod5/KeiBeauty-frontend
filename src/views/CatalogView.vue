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
          @input="debouncedSearch"
        />
        <div class="search-icon">🔍</div>
      </div>

      <div class="filter-dropdown">
        <select
          v-model="selectedCategory"
          class="category-select"
          @change="loadProducts"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
    </div>

    <div class="catalog-content" :class="{ 'full-width': !showFilters }">
      <aside class="filters" v-if="showFilters">
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
          v-for="product in filteredProducts" 
          :key="product.id" 
          :to="`/producto/${product.id}`"
          class="product-card-link"
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
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.nombre }}</h3>
            <p class="product-brand">{{ product.marca_nombre }}</p>
            <p class="product-description">{{ product.descripcion }}</p>
            <div class="product-footer">
              <span class="product-price">{{ formatPrice(product.precio) }}</span>
              <button 
                class="add-to-cart-btn" 
                @click.stop.prevent="addToCart(product)"
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

    <div class="empty-state" v-if="filteredProducts.length === 0 && !loading">
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
import { getProducts, getCategories } from '../services/api'

const toast = useToast()

const products = ref([])
const loading = ref(true)
const addingToCart = ref(null)
const cartStore = useCartStore()

const searchQueryInput = ref('')
const selectedCategory = ref('')
const categories = ref([])
const debounceTimer = ref(null)

const filters = ref({
  category: []
})

const showFilters = ref(false)

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

const filteredProducts = computed(() => {
  let result = products.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query) ||
      p.marca_nombre.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    result = result.filter(p => p.categoria_id === Number(selectedCategory.value))
  }
  
  if (filters.value.category.length > 0) {
    // Mapear categorías del filtro a IDs
    const categoryMap = {
      'limpieza': 1,
      'tonico': 2,
      'serum': 3,
      'crema': 4,
      'protector': 5
    }
    const categoryIds = filters.value.category.map(c => categoryMap[c]).filter(Boolean)
    if (categoryIds.length > 0) {
      result = result.filter(p => categoryIds.includes(p.categoria_id))
    }
  }
  
  return result
});

const searchQuery = computed({
  get: () => searchQueryInput.value,
  set: (val) => {
    searchQueryInput.value = val
    clearTimeout(debounceTimer.value)
    debounceTimer.value = setTimeout(() => {
      loadProducts()
    }, 300)
  }
})

async function loadProducts() {
  try {
    loading.value = true
    let data = await getProducts()
    
    // Si hay categoría seleccionada, filtrar en el servidor
    if (selectedCategory.value) {
      data = data.filter(p => p.categoria_id === Number(selectedCategory.value))
    }
    
    products.value = data.map(p => ({ ...p, imageError: false }))
  } catch (error) {
    console.error('Error loading products:', error)
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

async function addToCart(product) {
  addingToCart.value = product.id
  try {
    cartStore.addItem(product)
    toast.success('Producto añadido al carrito')
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('Error al añadir al carrito')
  } finally {
    addingToCart.value = null
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  filters.value.category = []
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>