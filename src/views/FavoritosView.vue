<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Mis Favoritos</h1>
      <p style="color: var(--kei-gris-medio);">Productos que guardaste para después</p>
    </header>

    <div v-if="favoritosStore.loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando favoritos...</p>
    </div>

    <div v-else-if="favoritosStore.favoritos.length === 0" class="card shadow-sm text-center p-5">
      <div class="card-body">
        <i class="bi bi-heart fs-1 mb-3 d-block" style="color: var(--kei-beige-medio);"></i>
        <h2 class="h5 fw-bold mb-2" style="color: var(--kei-casi-negro);">Todavía no tenés favoritos</h2>
        <p class="mb-4 mx-auto" style="color: var(--kei-gris-medio); max-width: 420px;">Explorá el catálogo y guardá productos que te gusten haciendo click en el corazón</p>
        <router-link to="/catalogo" class="btn btn-primary rounded-pill px-4">
          <i class="bi bi-bag me-2"></i>Ir al Catálogo
        </router-link>
      </div>
    </div>

    <div v-else class="row g-4">
      <div
        v-for="fav in favoritosStore.favoritos"
        :key="fav.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <router-link
          :to="`/producto/${fav.producto.id}`"
          class="text-decoration-none h-100 d-block"
        >
          <div class="card h-100 shadow-sm overflow-hidden">
            <div class="position-relative" style="aspect-ratio: 1; background-color: var(--kei-fondo); overflow: hidden;">
              <img
                v-show="fav.producto.imagen_url"
                :src="fav.producto.imagen_url"
                :alt="fav.producto.nombre"
                class="w-100 h-100 object-fit-cover"
              />
              <div v-show="!fav.producto.imagen_url" class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold fs-1" style="color: var(--kei-beige);">
                {{ fav.producto.nombre.charAt(0) }}
              </div>
              <button
                class="btn btn-light rounded-circle position-absolute top-0 start-0 m-2 d-flex align-items-center justify-content-center shadow-sm"
                @click.stop.prevent="quitarFavorito(fav.producto.id, $event)"
                aria-label="Quitar de favoritos"
                title="Quitar de favoritos"
                style="width: 36px; height: 36px;"
              >
                <i class="bi bi-heart-fill" style="color: var(--kei-beige);"></i>
              </button>
            </div>
            <div class="card-body d-flex flex-column">
              <h3 class="h6 fw-semibold mb-1 text-truncate-2" style="color: var(--kei-casi-negro);">{{ fav.producto.nombre }}</h3>
              <p class="small fw-medium mb-2 text-uppercase" style="color: var(--kei-beige); letter-spacing: 0.05em;">{{ fav.producto.marca_nombre }}</p>
              <div class="d-flex justify-content-between align-items-center pt-2 mt-auto border-top" style="border-color: var(--kei-gris-claro) !important;">
                <span class="fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(fav.producto.precio) }}</span>
                <span class="badge rounded-pill text-uppercase" :style="stockBadgeStyle(fav.producto.stock)" style="font-size: 0.7rem;">
                  {{ fav.producto.stock === 0 ? 'Agotado' : fav.producto.stock <= 10 ? `Pocas (${fav.producto.stock})` : 'Disponible' }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFavoritosStore } from '../stores/favoritosStore'
import { useAuthStore } from '../stores/authStore'
import { useToast } from 'vue-toastification'

const favoritosStore = useFavoritosStore()
const authStore = useAuthStore()
const toast = useToast()

const priceFormatter = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
  minimumFractionDigits: 2
})

function formatPrice(price) {
  return priceFormatter.format(price)
}

function stockBadgeStyle(stock) {
  if (stock === 0) return 'background-color: #f8e8e8; color: #7a3a3a; border: 1px solid #e0c0c0;'
  if (stock <= 10) return 'background-color: var(--kei-beige-claro); color: var(--kei-casi-negro); border: 1px solid var(--kei-beige-medio);'
  return 'background-color: var(--kei-fondo); color: var(--kei-gris-oscuro); border: 1px solid var(--kei-gris-claro);'
}

async function quitarFavorito(productoId, event) {
  event.stopPropagation()
  event.preventDefault()
  
  const result = await favoritosStore.quitar(productoId)
  if (result.success) {
    toast.success('Producto quitado de favoritos')
  } else {
    toast.error(result.error)
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await favoritosStore.fetchFavoritos()
  }
})
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.object-fit-cover { object-fit: cover; }
</style>
