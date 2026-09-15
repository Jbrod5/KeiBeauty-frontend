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
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'

    }
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

export async function getProducts() {
  const response = await api.get('/products')
  return response.data.data
}

export async function getCategories() {
  const response = await api.get('/categorias')
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

export async function getOrderById(id) {
  const response = await api.get(`/pedidos/${id}`)
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

export async function verify2FA(email, codigo) {
  const response = await api.post('/auth/verificar-2fa', { email, codigo })
  return response
}

export async function resend2FA(email) {
  const response = await api.post('/auth/reenviar-codigo-2fa', { email })
  return response.data
}

export async function activar2FA() {
  const response = await api.post('/auth/activar-2fa')
  return response.data
}

export async function desactivar2FA() {
  const response = await api.post('/auth/desactivar-2fa')
  return response.data
}

export default api