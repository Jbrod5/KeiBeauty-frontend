import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

api.interceptors.request.use(
  (config) => {
    // Usar token temporal de 2FA si existe y no hay access_token normal
    const tempToken = localStorage.getItem('temp_token')
    const accessToken = localStorage.getItem('access_token')
    
    if (tempToken && !accessToken) {
      config.headers.Authorization = `Bearer ${tempToken}`
    } else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    // Add guest token for cart operations
    const guestToken = localStorage.getItem('guest_token')
    if (guestToken && !accessToken && !tempToken) {
      config.headers['X-Guest-Token'] = guestToken
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No redirigir automáticamente en 401 - dejar que el router guard maneje el estado de auth
    // Esto evita redirecciones inesperadas durante initAuth() o peticiones opcionales
    return Promise.reject(error)
  }
)

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response
}

export async function register(userData) {
  const response = await api.post('/auth/registro', userData)
  return response
}

export async function getProfile() {
  const response = await api.get('/auth/perfil')
  return response
}

export async function refreshToken(refreshTokenValue) {
  const response = await api.post('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${refreshTokenValue}`
    }
  })
  return response
}

export async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/products?${queryString}`)
  return response.data.data
}

export async function getMarcas() {
  const response = await api.get('/products/marcas')
  return response.data
}

export async function getCategories() {
  const response = await api.get('/products/categorias')
  return response.data
}

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data
}

export async function createOrder(orderData) {
  const response = await api.post('/pedidos', orderData)
  return response.data.data
}

export async function getOrders(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/pedidos?${queryString}`)
  return response.data
}

export async function getOrderById(id, guestToken, emailContacto) {
  const params = new URLSearchParams()
  if (guestToken) params.append('guest_token', guestToken)
  if (emailContacto) params.append('email_contacto', emailContacto)
  const queryString = params.toString()
  const url = `/pedidos/${id}${queryString ? '?' + queryString : ''}`
  const response = await api.get(url)
  return response.data.data
}

export async function updateOrderStatus(id, estado) {
  const response = await api.patch(`/pedidos/${id}/estado`, { estado })
  return response.data.data
}


export async function getCart() {
  const response = await api.get('/carrito')
  return response.data.data
}

export async function addToCart(productoId, cantidad = 1) {
  const response = await api.post('/carrito/items', { producto_id: productoId, cantidad })
  return response.data.data
}

export async function updateCartItem(itemId, cantidad) {
  const response = await api.put(`/carrito/items/${itemId}`, { cantidad })
  return response.data.data
}

export async function removeCartItem(itemId) {
  const response = await api.delete(`/carrito/items/${itemId}`)
  return response.data.data
}

export async function clearCart() {
  const response = await api.delete('/carrito')
  return response.data.data
}

export async function forgotPassword(email) {
  const response = await api.post('/auth/olvide-contrasena', { email })
  return response.data
}

export async function resetPassword(token, password, confirmPassword) {
  const response = await api.post('/auth/reestablecer-contrasena', { token, password, confirm_password: confirmPassword })
  return response.data
}

export async function verify2FA(email, codigo, tempToken) {
  const response = await api.post('/auth/verificar-2fa', { codigo }, {
    headers: tempToken ? { Authorization: `Bearer ${tempToken}` } : {}
  })
  return response
}

export async function resend2FA(email, tempToken) {
  const response = await api.post('/auth/reenviar-codigo-2fa', {}, {
    headers: tempToken ? { Authorization: `Bearer ${tempToken}` } : {}
  })
  return response.data
}

export async function activar2FA() {
  const response = await api.post('/auth/activar-2fa')
  return response.data
}

export async function cancelarLogin(tempToken) {
  const response = await api.post('/auth/cancelar-login', {}, {
    headers: tempToken ? { Authorization: `Bearer ${tempToken}` } : {}
  })
  return response.data
}

export async function desactivar2FA() {
  const response = await api.post('/auth/desactivar-2fa')
  return response.data
}

export async function getFavoritos() {
  const response = await api.get('/favoritos')
  return response.data
}

export async function agregarFavorito(productoId) {
  const response = await api.post(`/favoritos/${productoId}`)
  return response
}

export async function quitarFavorito(productoId) {
  const response = await api.delete(`/favoritos/${productoId}`)
  return response.data
}

export async function createCategory(categoryData) {
  const response = await api.post('/categorias', categoryData)
  return response.data
}

export async function updateCategory(id, categoryData) {
  const response = await api.put(`/categorias/${id}`, categoryData)
  return response.data
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categorias/${id}`)
  return response.data
}

export async function createProduct(formData) {
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function updateProduct(id, data) {
  const response = await api.put(`/products/${id}`, data)
  return response.data
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export async function uploadProductImage(productId, archivo) {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const response = await api.post(`/products/${productId}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function ajustarInventario(productId, tipo, cantidad) {
  const response = await api.post(`/products/${productId}/inventario`, { tipo, cantidad })
  return response.data
}

export async function uploadGuia(pedidoId, archivo) {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const response = await api.post(`/pedidos/${pedidoId}/guia`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export default api