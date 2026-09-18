import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFavoritos, agregarFavorito, quitarFavorito } from '../services/api'

export const useFavoritosStore = defineStore('favoritos', () => {
  const favoritos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const favoritosIds = computed(() => new Set(favoritos.value.map(f => f.producto_id)))

  function esFavorito(productoId) {
    return favoritosIds.value.has(productoId)
  }

  async function fetchFavoritos() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      // getFavoritos devuelve el cuerpo {data: [...], message}: extraer el arreglo
      const cuerpo = await getFavoritos()
      favoritos.value = cuerpo?.data || []
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar favoritos'
      error.value = message
      console.error('Error fetching favoritos:', err)
    } finally {
      loading.value = false
    }
  }

  async function agregar(productoId) {
    try {
      // agregarFavorito devuelve el response axios completo ({data: {data, message}, ...})
      const respuesta = await agregarFavorito(productoId)
      const nuevo = respuesta.data?.data || {}
      if (!esFavorito(productoId)) {
        // Forzar producto_id para que el Set de ids quede consistente
        favoritos.value.unshift({ ...nuevo, producto_id: productoId })
      }
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al agregar a favoritos'
      error.value = message
      return { success: false, error: message }
    }
  }

  async function quitar(productoId) {
    try {
      await quitarFavorito(productoId)
      favoritos.value = favoritos.value.filter(f => f.producto_id !== productoId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al quitar de favoritos'
      error.value = message
      return { success: false, error: message }
    }
  }

  async function toggle(productoId) {
    if (esFavorito(productoId)) {
      return await quitar(productoId)
    } else {
      return await agregar(productoId)
    }
  }

  function clearFavoritos() {
    favoritos.value = []
  }

  return {
    favoritos,
    loading,
    error,
    favoritosIds,
    esFavorito,
    fetchFavoritos,
    agregar,
    quitar,
    toggle,
    clearFavoritos
  }
})