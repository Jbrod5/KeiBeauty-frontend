<template>
  <div class="favoritos-view">
    <header class="favoritos-header">
      <h1>Mis Favoritos</h1>
      <p class="favoritos-subtitle">Productos que guardaste para después</p>
    </header>

    <div v-if="favoritosStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando favoritos...</p>
    </div>

    <div v-else-if="favoritosStore.favoritos.length === 0" class="empty-favoritos">
      <div class="empty-icon">♡</div>
      <h2>Todavía no tenés favoritos</h2>
      <p>Explorá el catálogo y guardá productos que te gusten haciendo click en el corazón</p>
      <router-link to="/catalogo" class="btn btn-primary">Ir al Catálogo</router-link>
    </div>

    <main v-else class="favoritos-grid">
      <router-link 
        v-for="fav in favoritosStore.favoritos" 
        :key="fav.id" 
        :to="`/producto/${fav.producto.id}`"
        class="favorito-card-link"
      >
        <div class="favorito-card">
          <div class="favorito-image">
            <img 
              v-show="fav.producto.imagen_url" 
              :src="fav.producto.imagen_url" 
              :alt="fav.producto.nombre" 
              class="favorito-img"
            />
            <span v-show="!fav.producto.imagen_url" class="favorito-placeholder">{{ fav.producto.nombre.charAt(0) }}</span>
            <button
              class="favorite-btn active"
              @click.stop.prevent="quitarFavorito(fav.producto.id, $event)"
              aria-label="Quitar de favoritos"
              title="Quitar de favoritos"
            >
              <span class="heart-icon">♥</span>
            </button>
          </div>
          <div class="favorito-info">
            <h3 class="favorito-name">{{ fav.producto.nombre }}</h3>
            <p class="favorito-brand">{{ fav.producto.marca_nombre }}</p>
            <div class="favorito-footer">
              <span class="favorito-price">{{ formatPrice(fav.producto.precio) }}</span>
              <span class="favorito-stock" :class="{ 'out-of-stock': fav.producto.stock === 0, 'low-stock': fav.producto.stock > 0 && fav.producto.stock <= 10, 'in-stock': fav.producto.stock > 10 }">
                {{ fav.producto.stock === 0 ? 'Agotado' : fav.producto.stock <= 10 ? `Pocas unidades (${fav.producto.stock})` : 'Disponible' }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </main>
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
.favoritos-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.favoritos-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
}

.favoritos-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.favoritos-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.favoritos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.favorito-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.favorito-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.favorito-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.favorito-image {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  position: relative;
  overflow: hidden;
}

.favorito-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.favorito-card:hover .favorito-img {
  transform: scale(1.05);
}

.favorito-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 600;
  color: #e91e63;
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
  color: #e91e63;
  transition: color 0.2s, transform 0.2s;
}

.favorite-btn.active:hover .heart-icon {
  transform: scale(1.2);
}

.favorito-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.favorito-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorito-brand {
  font-size: 0.8rem;
  color: #e91e63;
  font-weight: 500;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.favorito-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.favorito-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.favorito-stock {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
}

.favorito-stock.in-stock {
  background: #e8f5e9;
  color: #2e7d32;
}

.favorito-stock.low-stock {
  background: #fff8e1;
  color: #f57f17;
}

.favorito-stock.out-of-stock {
  background: #fdeaea;
  color: #c62828;
}

.empty-favoritos {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #e91e63;
}

.empty-favoritos h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-favoritos p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.loading-state {
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .favoritos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .favoritos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .favoritos-header h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .favoritos-grid {
    grid-template-columns: 1fr;
  }
  
  .favoritos-header h1 {
    font-size: 1.75rem;
  }
}
</style>