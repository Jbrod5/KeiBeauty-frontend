<template>
  <div class="container py-4">
    <!-- Estado carga -->
    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5" style="min-height: 400px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3" style="color: var(--kei-gris-medio);">Cargando producto...</p>
    </div>

    <!-- Error -->
    <div v-else-if="!product" class="d-flex flex-column align-items-center justify-content-center py-5 text-center" style="min-height: 400px;">
      <h2 class="fw-bold" style="color: var(--kei-casi-negro);">Producto no encontrado</h2>
      <p class="mb-3" style="color: var(--kei-gris-medio); max-width: 400px;">{{ errorMessage || 'El producto que buscas no existe o ha sido eliminado.' }}</p>
      <router-link to="/catalogo" class="btn btn-primary rounded-pill">Volver al catálogo</router-link>
    </div>

    <!-- Detalle -->
    <div v-else>
      <!-- Breadcrumb Bootstrap -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Inicio</router-link></li>
          <li class="breadcrumb-item"><router-link to="/catalogo">Catálogo</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ product.nombre }}</li>
        </ol>
      </nav>

      <div class="card shadow-sm overflow-hidden">
        <div class="card-body p-4">
          <div class="row g-4 g-lg-5">
            <!-- Galería -->
            <div class="col-12 col-md-6">
              <div class="ratio ratio-1x1 rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style="background-color: var(--kei-fondo);">
                <img
                  v-if="product.imagen_url"
                  :src="product.imagen_url"
                  :alt="product.nombre"
                  class="w-100 h-100 object-fit-cover"
                />
                <div v-else class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold display-1" style="color: var(--kei-beige);">
                  {{ product.nombre.charAt(0) }}
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="col-12 col-md-6 d-flex flex-column gap-3">
              <div class="d-flex align-items-center gap-2">
                <img v-if="product.marca_logo_url" :src="product.marca_logo_url" :alt="product.marca_nombre" style="width:28px;height:28px;object-fit:contain;border-radius:50%;border:1px solid var(--kei-gris-claro);background:#fff;" />
                <span v-else class="d-inline-flex align-items-center justify-content-center rounded-circle" style="width:28px;height:28px;background:var(--kei-fondo);border:1px solid var(--kei-gris-claro);"><i class="bi bi-award" style="color:var(--kei-beige);font-size:14px;"></i></span>
                <p class="small fw-medium text-uppercase mb-0" style="color: var(--kei-beige); letter-spacing: 0.05em;">{{ product.marca_nombre }}</p>
              </div>
              <h1 class="h2 fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);">{{ product.nombre }}</h1>

              <div class="fs-2 fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(product.precio) }}</div>

              <!-- Stock con badges + bi-circle-fill paleta -->
              <div>
                <span v-if="product.stock > 10" class="badge rounded-pill fs-6 fw-medium d-inline-flex align-items-center gap-2" style="background-color: var(--kei-fondo); color: var(--kei-gris-oscuro); border: 1px solid var(--kei-gris-claro);">
                  <i class="bi bi-circle-fill" style="color: var(--kei-beige);"></i> En stock ({{ product.stock }} unidades)
                </span>
                <span v-else-if="product.stock > 0" class="badge rounded-pill fs-6 fw-medium d-inline-flex align-items-center gap-2" style="background-color: var(--kei-fondo); color: var(--kei-casi-negro); border: 1px solid var(--kei-beige-claro);">
                  <i class="bi bi-circle-fill" style="color: var(--kei-beige-medio);"></i> Pocas unidades ({{ product.stock }} restantes)
                </span>
                <span v-else class="badge rounded-pill fs-6 fw-medium d-inline-flex align-items-center gap-2" style="background-color: var(--kei-gris-claro); color: var(--kei-casi-negro);">
                  <i class="bi bi-circle-fill" style="color: var(--kei-gris-oscuro);"></i> Agotado
                </span>
              </div>

              <!-- Alert error reseña si existe -->
              <div v-if="errorMessage && product" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div>{{ errorMessage }}</div>
              </div>

              <div class="border-top pt-3" style="border-color: var(--kei-gris-claro) !important;">
                <h3 class="h6 fw-bold" style="color: var(--kei-casi-negro);">Descripción</h3>
                <p class="mb-0" style="color: var(--kei-gris-medio); line-height: 1.7;">{{ product.descripcion }}</p>
              </div>

              <div v-if="product.ingredientes_clave || product.tipo_piel" class="row g-3 py-3 border-top border-bottom" style="border-color: var(--kei-gris-claro) !important;">
                <div class="col-6 d-flex flex-column gap-1" v-if="product.ingredientes_clave">
                  <strong class="small text-uppercase" style="color: var(--kei-beige-medio);">Ingredientes clave:</strong>
                  <span style="color: var(--kei-casi-negro);">{{ product.ingredientes_clave }}</span>
                </div>
                <div class="col-6 d-flex flex-column gap-1" v-if="product.tipo_piel">
                  <strong class="small text-uppercase" style="color: var(--kei-beige-medio);">Tipo de piel:</strong>
                  <span style="color: var(--kei-casi-negro);">{{ product.tipo_piel }}</span>
                </div>
                <div class="col-6 d-flex flex-column gap-1" v-if="product.tamano">
                  <strong class="small text-uppercase" style="color: var(--kei-beige-medio);">Tamaño:</strong>
                  <span style="color: var(--kei-casi-negro);">{{ product.tamano }}</span>
                </div>
                <div class="col-6 d-flex flex-column gap-1">
                  <strong class="small text-uppercase" style="color: var(--kei-beige-medio);">Categoría:</strong>
                  <span style="color: var(--kei-casi-negro);">{{ product.categoria_nombre }}</span>
                </div>
                <div class="col-6 d-flex flex-column gap-1">
                  <strong class="small text-uppercase" style="color: var(--kei-beige-medio);">Marca:</strong>
                  <span style="color: var(--kei-casi-negro);">{{ product.marca_nombre }}</span>
                </div>
              </div>

              <!-- Acciones -->
              <div class="d-flex flex-wrap gap-2">
                <button
                  class="btn btn-primary flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2"
                  @click="addToCart"
                  :disabled="product.stock === 0 || addingToCart"
                >
                  <span v-if="!addingToCart">Añadir al carrito</span>
                  <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <i v-if="!addingToCart" class="bi bi-bag"></i>
                </button>
                <button
                  class="btn btn-outline-primary d-inline-flex align-items-center justify-content-center"
                  @click="toggleWishlist"
                  :class="{ 'active': product.es_favorito }"
                  :aria-label="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                  :title="product.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                  style="width: 56px;"
                >
                  <i v-if="product.es_favorito" class="bi bi-heart-fill"></i>
                  <i v-else class="bi bi-heart"></i>
                </button>
                <button
                  class="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                  @click="mostrarResena"
                  :title="authStore.isAuthenticated ? 'Dejar reseña' : 'Inicia sesión para reseñar'"
                >
                  <i class="bi bi-star"></i> Dejar reseña
                </button>
              </div>

              <!-- Form reseña con card + alert -->
              <div v-if="mostrarFormResena" class="card mt-2" style="background-color: var(--kei-fondo);">
                <div class="card-body">
                  <h3 class="h6 fw-bold" style="color: var(--kei-casi-negro);">Dejar una reseña</h3>
                  <label class="form-label">Calificación:</label>
                  <select v-model="calificacionResena" class="form-select form-select-sm d-inline-block w-auto ms-2">
                    <option value="5">5 <i class="bi bi-star-fill"></i></option>
                    <option value="4">4 <i class="bi bi-star-fill"></i></option>
                    <option value="3">3 <i class="bi bi-star-fill"></i></option>
                    <option value="2">2 <i class="bi bi-star-fill"></i></option>
                    <option value="1">1 <i class="bi bi-star-fill"></i></option>
                  </select>
                  <div class="d-flex gap-1 mt-2 mb-2">
                    <i v-for="n in 5" :key="n" :class="n <= calificacionResena ? 'bi bi-star-fill' : 'bi bi-star'" style="color: var(--kei-beige);"></i>
                  </div>
                  <textarea v-model="comentarioResena" placeholder="Comentario (opcional)" class="form-control" rows="3"></textarea>
                  <div class="d-flex gap-2 mt-3">
                    <button @click="enviarResena" class="btn btn-primary btn-sm">Enviar reseña</button>
                    <button @click="cancelarResena" class="btn btn-outline-secondary btn-sm">Cancelar</button>
                  </div>
                </div>
              </div>

              <!-- Selector cantidad -->
              <div v-if="product.stock > 0" class="d-flex align-items-center gap-3 pt-3 border-top" style="border-color: var(--kei-gris-claro) !important;">
                <label for="quantity" class="form-label mb-0 fw-medium" style="color: var(--kei-casi-negro);">Cantidad:</label>
                <div class="input-group" style="max-width: 160px;">
                  <button class="btn btn-outline-secondary" @click="decreaseQty" :disabled="quantity === 1" aria-label="Disminuir">−</button>
                  <input
                    id="quantity"
                    type="number"
                    v-model.number="quantity"
                    :min="1"
                    :max="product.stock"
                    @change="clampQuantity"
                    class="form-control text-center"
                  />
                  <button class="btn btn-outline-secondary" @click="increaseQty" :disabled="quantity >= product.stock" aria-label="Aumentar">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reseñas: promedio + listado -->
      <div class="card shadow-sm mt-4">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="h5 fw-bold mb-0 font-display" style="color: var(--kei-casi-negro);"><i class="bi bi-star me-2" style="color: var(--kei-beige);"></i>Opiniones de clientes</h3>
            <span v-if="resenasTotal > 0" class="badge rounded-pill" style="background: var(--kei-gris-oscuro);">{{ resenasTotal }} {{ resenasTotal === 1 ? 'opinión' : 'opiniones' }}</span>
          </div>

          <div v-if="resenasCargando" class="text-center py-3">
            <div class="spinner-border spinner-border-sm" role="status"></div>
            <p class="small mt-2" style="color: var(--kei-gris-medio);">Cargando opiniones...</p>
          </div>

          <div v-else-if="resenasTotal > 0" class="mb-4 p-3 rounded" style="background: var(--kei-fondo); border: 1px solid var(--kei-gris-claro);">
            <div class="d-flex align-items-center gap-3">
              <div class="display-6 fw-bold" style="color: var(--kei-casi-negro);">{{ resenaPromedio }}</div>
              <div>
                <div class="d-flex gap-1">
                  <i v-for="n in 5" :key="n" :class="n <= Math.round(resenaPromedio) ? 'bi bi-star-fill' : 'bi bi-star'" style="color: var(--kei-beige);"></i>
                </div>
                <small style="color: var(--kei-gris-medio);">Promedio de {{ resenasTotal }} calificaciones</small>
              </div>
            </div>
          </div>

          <div v-if="!resenasCargando && resenas.length === 0" class="text-center py-4">
            <i class="bi bi-chat-square-text fs-2 d-block mb-2" style="color: var(--kei-beige-medio);"></i>
            <p class="mb-0" style="color: var(--kei-gris-medio);">Aún no hay opiniones. ¡Sé el primero en opinar!</p>
          </div>

          <div v-for="r in resenas" :key="r.id" class="border-bottom py-3" style="border-color: var(--kei-gris-claro) !important;">
            <div class="d-flex justify-content-between align-items-start">
              <strong style="color: var(--kei-casi-negro);">{{ r.usuario_nombre || 'Cliente' }}</strong>
              <small style="color: var(--kei-beige-medio);">{{ formatFecha(r.fecha) }}</small>
            </div>
            <div class="d-flex gap-1 my-1">
              <i v-for="n in 5" :key="n" :class="n <= r.calificacion ? 'bi bi-star-fill' : 'bi bi-star'" style="color: var(--kei-beige); font-size: 0.9rem;"></i>
            </div>
            <p v-if="r.comentario" class="mb-0" style="color: var(--kei-gris-medio);">{{ r.comentario }}</p>
            <p v-else class="mb-0 small fst-italic" style="color: var(--kei-beige-medio);">Sin comentario</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useFavoritosStore } from '../stores/favoritosStore'
import { useAuthStore } from '../stores/authStore'
import { getProductById, createResena, getResenas } from '../services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoritosStore = useFavoritosStore()
const authStore = useAuthStore()

const product = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const addingToCart = ref(false)
const quantity = ref(1)
const mostrarFormResena = ref(false)
const calificacionResena = ref(5)
const comentarioResena = ref('')
const resenas = ref([])
const resenaPromedio = ref(null)
const resenasTotal = ref(0)
const resenasCargando = ref(false)

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
    // Sincronizar estado de favorito
    if (product.value && authStore.isAuthenticated) {
      await favoritosStore.fetchFavoritos()
    }
    await loadResenas()
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

async function loadResenas() {
  if (!product.value) return
  resenasCargando.value = true
  try {
    const data = await getResenas({ producto: product.value.id })
    resenas.value = data.data || []
    resenaPromedio.value = data.promedio
    resenasTotal.value = data.total || 0
  } catch (e) {
    console.error('Error cargando reseñas', e)
  } finally {
    resenasCargando.value = false
  }
}

function formatFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })
}

function addToCart() {
  if (!product.value || product.value.stock === 0) return
  addingToCart.value = true
  try {
    const productToAdd = { ...product.value }
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(productToAdd)
    }
    toast.success('Producto añadido al carrito')
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('Error al añadir al carrito')
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

function mostrarResena() {
  if (!authStore.isAuthenticated) {
    toast.info('Iniciá sesión para dejar una reseña')
    return
  }
  mostrarFormResena.value = true
  calificacionResena.value = 5
  comentarioResena.value = ''
}

function cancelarResena() {
  mostrarFormResena.value = false
  calificacionResena.value = 5
  comentarioResena.value = ''
}

async function enviarResena() {
  if (calificacionResena.value < 1 || calificacionResena.value > 5) {
    toast.error('Calificación debe ser entre 1 y 5')
    return
  }
  try {
    await createResena({
      producto_id: product.value.id,
      calificacion: calificacionResena.value,
      comentario: comentarioResena.value || null
    })
    toast.success('Reseña enviada exitosamente')
    cancelarResena()
    await loadResenas()
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Error al enviar reseña'
    toast.error(errorMessage.value)
  }
}

function clampQuantity() {
  if (quantity.value < 1) quantity.value = 1
  if (quantity.value > product.value.stock) quantity.value = product.value.stock
}

async function toggleWishlist() {
  if (!product.value) return
  if (!authStore.isAuthenticated) {
    toast.info('Iniciá sesión para guardar favoritos')
    return
  }
  await favoritosStore.toggle(product.value.id)
  // Forzar actualización reactiva
  if (product.value) {
    product.value.es_favorito = favoritosStore.esFavorito(product.value.id)
  }
}

watch(() => route.params.id, () => {
  loadProduct()
})

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
.breadcrumb a {
  color: var(--kei-gris-oscuro);
  text-decoration: none;
}
.breadcrumb a:hover {
  color: var(--kei-casi-negro);
  text-decoration: underline;
}
</style>
