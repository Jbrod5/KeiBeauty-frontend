import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getCart as apiGetCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem, 
  removeCartItem as apiRemoveCartItem, 
  clearCart as apiClearCart 
} from '../services/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.cantidad, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  )

  function setItemsFromBackend(cartData) {
    if (cartData && cartData.detalles) {
      items.value = cartData.detalles.map(d => ({
        id: d.id,
        producto_id: d.producto_id,
        nombre: d.producto.nombre,
        marca_nombre: d.producto.marca_nombre,
        precio: d.producto.precio,
        imagen_url: d.producto.imagen_url,
        cantidad: d.cantidad,
        subtotal: d.subtotal
      }))
    } else {
      items.value = []
    }
  }

  function addLocalItem(product) {
    const existingItem = items.value.find(item => item.producto_id === product.id)
    if (existingItem) {
      existingItem.cantidad++
      existingItem.subtotal = existingItem.precio * existingItem.cantidad
    } else {
      items.value.push({
        id: Date.now(), // temp id until backend responds
        producto_id: product.id,
        nombre: product.nombre,
        marca_nombre: product.marca_nombre,
        precio: product.precio,
        imagen_url: product.imagen_url,
        cantidad: 1,
        subtotal: product.precio
      })
    }
  }

  async function syncWithBackend() {
    if (!loading.value) {
      await fetchCart()
    }
  }

  async function fetchCart() {
    loading.value = true
    error.value = null
    try {
      const cartData = await apiGetCart()
      setItemsFromBackend(cartData)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar carrito'
      console.error('Error fetching cart:', err)
    } finally {
      loading.value = false
    }
  }

  async function addItem(product) {
    // Optimistic update for immediate UI feedback
    addLocalItem(product)
    
    try {
      const cartData = await apiAddToCart(product.id, 1)
      // Replace with backend response
      setItemsFromBackend(cartData)
    } catch (err) {
      // Rollback on error
      error.value = err.response?.data?.message || 'Error al añadir al carrito'
      // Remove the optimistic item
      const tempItem = items.value.find(i => i.producto_id === product.id && i.id > 1000000000000)
      if (tempItem) {
        items.value = items.value.filter(i => i !== tempItem)
      }
      throw err
    }
  }

  async function updateQuantity(itemId, cantidad) {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return
    
    const oldCantidad = item.cantidad
    item.cantidad = cantidad
    item.subtotal = item.precio * cantidad
    
    try {
      const cartData = await apiUpdateCartItem(itemId, cantidad)
      setItemsFromBackend(cartData)
    } catch (err) {
      // Rollback
      item.cantidad = oldCantidad
      item.subtotal = item.precio * oldCantidad
      error.value = err.response?.data?.message || 'Error al actualizar cantidad'
      throw err
    }
  }

  async function removeItem(itemId) {
    const itemIndex = items.value.findIndex(i => i.id === itemId)
    if (itemIndex === -1) return
    
    const removedItem = items.value.splice(itemIndex, 1)[0]
    
    try {
      const cartData = await apiRemoveCartItem(itemId)
      setItemsFromBackend(cartData)
    } catch (err) {
      // Rollback
      items.value.splice(itemIndex, 0, removedItem)
      error.value = err.response?.data?.message || 'Error al eliminar item'
      throw err
    }
  }

  async function clearCartItems() {
    const oldItems = [...items.value]
    items.value = []
    
    try {
      const cartData = await apiClearCart()
      setItemsFromBackend(cartData)
    } catch (err) {
      // Rollback
      items.value = oldItems
      error.value = err.response?.data?.message || 'Error al vaciar carrito'
      throw err
    }
  }

  function setItems(newItems) {
    items.value = newItems
  }

  return {
    items,
    loading,
    error,
    totalItems,
    totalPrice,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: clearCartItems,
    setItems,
    syncWithBackend
  }
})