<template>
  <div class="container py-4">
    <!-- Header -->
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Catálogo de Productos</h1>
      <p style="color: var(--kei-gris-medio);">Descubre nuestra selección de K-Beauty auténtico</p>
    </header>

    <!-- Toolbar: búsqueda + filtros categoría y marca -->
    <div class="row g-3 mb-3 align-items-center">
      <div class="col-12 col-md-5 col-lg-4">
        <label for="search" class="visually-hidden">Buscar productos</label>
        <div class="input-group">
          <span class="input-group-text" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">
            <i class="bi bi-search" style="color: var(--kei-beige-medio);"></i>
          </span>
          <input
            id="search"
            type="search"
            v-model="searchQuery"
            placeholder="Buscar por nombre..."
            class="form-control rounded-end-pill"
          />
        </div>
      </div>
      <div class="col-6 col-md-3 col-lg-4">
        <select v-model="selectedCategory" class="form-select rounded-pill">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
      <div class="col-6 col-md-4 col-lg-4">
        <select v-model="selectedMarca" class="form-select rounded-pill">
          <option value="">Todas las marcas</option>
          <option v-for="m in marcas" :key="m.id" :value="m.id">
            {{ m.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Filtros activos -->
    <div v-if="selectedCategory || selectedMarca || searchQuery" class="d-flex flex-wrap gap-2 align-items-center mb-4 p-3 rounded" style="background-color: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);">
      <span v-if="selectedCategory" class="badge rounded-pill d-inline-flex align-items-center gap-2 p-2" style="background-color: var(--kei-gris-oscuro); color: var(--kei-fondo);">
        <i class="bi bi-tags"></i> {{ getCategoryName(selectedCategory) }}
        <button @click="selectedCategory = ''" class="btn-close btn-close-white" style="font-size: 0.6rem;" aria-label="Eliminar filtro categoría"></button>
      </span>
      <span v-if="selectedMarca" class="badge rounded-pill d-inline-flex align-items-center gap-2 p-2" style="background-color: var(--kei-beige); color: #fff;">
        <i class="bi bi-award"></i> {{ getMarcaName(selectedMarca) }}
        <button @click="selectedMarca = ''" class="btn-close btn-close-white" style="font-size: 0.6rem;" aria-label="Eliminar filtro marca"></button>
      </span>
      <span v-if="searchQuery" class="badge rounded-pill d-inline-flex align-items-center gap-2 p-2" style="background-color: var(--kei-gris-oscuro); color: var(--kei-fondo);">
        <i class="bi bi-search"></i> "{{ searchQuery }}"
        <button @click="searchQuery = ''" class="btn-close btn-close-white" style="font-size: 0.6rem;" aria-label="Eliminar filtro búsqueda"></button>
      </span>
      <button class="btn btn-link btn-sm text-decoration-none p-0 ms-2" style="color: var(--kei-beige);" @click="clearFilters">Limpiar todo</button>
    </div>

    <!-- Spinner loading Bootstrap -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2" style="color: var(--kei-gris-medio);">Cargando productos...</p>
    </div>

    <!-- Grid productos -->
    <div v-else class="row g-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <router-link
          :to="`/producto/${product.id}`"
          class="text-decoration-none h-100 d-block"
          :class="{ 'opacity-50': product.stock === 0 }"
        >
          <div class="card h-100 shadow-sm overflow-hidden">
            <!-- Imagen -->
            <div class="position-relative" style="aspect-ratio: 1; background-color: var(--kei-fondo); overflow: hidden;">
              <img
                v-show="product.imagen_url && !product.imageError"
                :src="product.imagen_url"
                :alt="product.nombre"
                class="w-100 h-100 object-fit-cover"
                @error="handleImageError($event, product)"
              />
              <div v-show="!product.imagen_url || product.imageError" class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold fs-1" style="color: var(--kei-beige);">
                {{ product.nombre.charAt(0) }}
              </div>
              <!-- Badge stock -->
              <span class="badge position-absolute top-0 end-0 m-2" :class="product.stock > 0 ? 'bg-success' : 'bg-danger'">
                {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
              </span>
              <!-- Favorito -->
              <button
                class="btn btn-light rounded-circle position-absolute top-0 start-0 m-2 d-flex align-items-center justify-content-center shadow-sm favorite-btn"
                :class="{ 'active-fav': product.es_favorito }"
                @click.stop.prevent="toggleFavorito(product, $event)"
                :aria-label="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                :title="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                style="width: 36px; height: 36px;"
              >
                <i v-if="product.es_favorito" class="bi bi-heart-fill" style="color: var(--kei-beige);"></i>
                <i v-else class="bi bi-heart" style="color: var(--kei-beige-medio);"></i>
              </button>
            </div>
            <!-- Info -->
            <div class="card-body d-flex flex-column">
              <h3 class="h6 fw-semibold mb-1 text-truncate-2" style="color: var(--kei-casi-negro);">{{ product.nombre }}</h3>
              <p class="small fw-medium mb-2 text-uppercase" style="color: var(--kei-beige); letter-spacing: 0.05em;">{{ product.marca_nombre }}</p>
              <p class="small mb-2 text-truncate-2 flex-grow-1" style="color: var(--kei-gris-medio);">{{ product.descripcion }}</p>
              <p class="small mb-2" v-if="product.tamano" style="color: var(--kei-beige-medio);">Tamaño: {{ product.tamano }}</p>
              <div class="d-flex justify-content-between align-items-center pt-2 mt-auto border-top" style="border-color: var(--kei-gris-claro) !important;">
                <span class="fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(product.precio) }}</span>
                <button
                  v-if="!authStore.isAdmin"
                  class="btn btn-primary btn-sm rounded-pill px-3"
                  @click.stop.prevent="addToCart(product)"
                  :disabled="addingToCart === product.id || product.stock === 0"
                >
                  <span v-if="addingToCart !== product.id && product.stock > 0">Añadir</span>
                  <span v-else-if="addingToCart === product.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-else>Sin stock</span>
                </button>
                <span v-else class="small" style="color: var(--kei-beige-medio);"><i class="bi bi-eye me-1"></i>Solo vista</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="products.length === 0 && !loading" class="text-center p-5 mt-4 card shadow-sm">
      <div class="card-body">
        <i class="bi bi-search fs-1 mb-3 d-block" style="color: var(--kei-beige-medio);"></i>
        <p class="fs-5 mb-3" style="color: var(--kei-gris-medio);">No encontramos productos con esos filtros</p>
        <button class="btn btn-outline-primary rounded-pill" @click="clearFilters">Limpiar filtros</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { useFavoritosStore } from '../stores/favoritosStore'
import { useAuthStore } from '../stores/authStore'
import { getProducts, getCategories, getMarcas } from '../services/api'

const toast = useToast()

const products = ref([])
const loading = ref(true)
const addingToCart = ref(null)
const cartStore = useCartStore()
const favoritosStore = useFavoritosStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedMarca = ref('')
const categories = ref([])
const marcas = ref([])
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

function getMarcaName(marcaId) {
  const m = marcas.value.find(x => x.id === Number(marcaId))
  return m ? m.nombre : ''
}

async function loadProducts() {
  try {
    loading.value = true
    const params = {}
    if (selectedCategory.value) params.categoria = selectedCategory.value
    if (selectedMarca.value) params.marca = selectedMarca.value
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

async function loadMarcas() {
  try {
    const result = await getMarcas()
    marcas.value = result.data || []
  } catch (error) {
    console.error('Error loading marcas:', error)
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
  selectedMarca.value = ''
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

watch(selectedMarca, () => {
  loadProducts()
})

onMounted(async () => {
  await loadCategories()
  await loadMarcas()
  await loadProducts()
  await loadFavoritos()
})
</script>

<style scoped>
/* Truncado a 2 líneas */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.favorite-btn.active-fav {
  background-color: var(--kei-fondo) !important;
}
.object-fit-cover {
  object-fit: cover;
}
</style>
