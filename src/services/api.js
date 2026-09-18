import axios from 'axios';

// URL base del backend: override manual (localStorage) > variable de entorno > defecto.
// El override permite apuntar a un backend con URL cambiante (ej. túnel ngrok)
// sin recompilar, desde la vista /config-api o con ?api=<url>.
const CLAVE_URL_BASE_API = 'api_base_url'
const URL_BASE_API_DEFECTO = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function obtenerUrlBaseApi() {
  return localStorage.getItem(CLAVE_URL_BASE_API) || URL_BASE_API_DEFECTO
}

export function guardarUrlBaseApi(url) {
  localStorage.setItem(CLAVE_URL_BASE_API, url)
}

export function restablecerUrlBaseApi() {
  localStorage.removeItem(CLAVE_URL_BASE_API)
}

export function hayOverrideUrlBaseApi() {
  return !!localStorage.getItem(CLAVE_URL_BASE_API)
}

const api = axios.create({
  baseURL: obtenerUrlBaseApi(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

api.interceptors.request.use(
  (config) => {
    // Resolver la URL base en cada petición (puede cambiar en caliente desde /config-api)
    config.baseURL = obtenerUrlBaseApi()
    // ngrok gratuito intercepta navegaciones: este header evita la página de aviso
    if (config.baseURL && config.baseURL.includes('ngrok')) {
      config.headers['ngrok-skip-browser-warning'] = '1'
    }
    // Solo usar token temporal para endpoints de 2FA; para el resto usar solo access_token
    const tempToken = localStorage.getItem('temp_token')
    const accessToken = localStorage.getItem('access_token')
    
    const esEndpoint2FA = config.url && (
      config.url.includes('/auth/verificar-2fa') ||
      config.url.includes('/auth/reenviar-codigo-2fa') ||
      config.url.includes('/auth/cancelar-login')
    )
    
    if (esEndpoint2FA && tempToken) {
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
  const isFormData = data instanceof FormData
  const response = await api.put(`/products/${id}`, data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
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

export async function ajustarInventario(productId, tipo, cantidad, costo_unitario = null) {
  const payload = { tipo, cantidad }
  if (costo_unitario !== null && costo_unitario !== '' && tipo === 'entrada') {
    payload.costo_unitario = parseFloat(costo_unitario)
  }
  const response = await api.post(`/products/${productId}/inventario`, payload)
  return response.data
}

export async function getReportesVentasTotales(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/ventas-totales?${qs}`)
  return response.data
}
export async function getReportesVentasPorMes(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/ventas-por-mes?${qs}`)
  return response.data
}
export async function getReportesVentasPorPeriodo(params) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/ventas-por-periodo?${qs}`)
  return response.data
}
export async function getReportesGanancias(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/ganancias?${qs}`)
  return response.data
}
export async function getReportesProductosMasVendidos(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/productos-mas-vendidos?${qs}`)
  return response.data
}
export async function getReportesClientesTop(params = {}) {
  const qs = new URLSearchParams(params).toString()
  const response = await api.get(`/reportes/clientes-top?${qs}`)
  return response.data
}
export async function descargarExcel(url, params = {}) {
  const qs = new URLSearchParams({ ...params, excel: '1' }).toString()
  const response = await api.get(`${url}?${qs}`, { responseType: 'blob' })
  return response
}

export async function getProductoImagenes(productId) {
  const response = await api.get(`/products/${productId}/imagenes`)
  return response.data
}

export async function subirImagenesGaleria(productId, archivos) {
  const formData = new FormData()
  for (const f of archivos) {
    formData.append('archivos', f)
  }
  const response = await api.post(`/products/${productId}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function marcarImagenPrincipal(productId, imagenId) {
  const response = await api.put(`/products/${productId}/imagenes/${imagenId}/principal`)
  return response.data
}

export async function eliminarImagenGaleria(productId, imagenId) {
  const response = await api.delete(`/products/${productId}/imagenes/${imagenId}`)
  return response.data
}

export async function createMarca(data) {
  const response = await api.post('/marcas', data)
  return response.data
}

export async function updateMarca(id, data) {
  const isFormData = data instanceof FormData
  const response = await api.put(`/marcas/${id}`, data, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {})
  return response.data
}

export async function deleteMarca(id) {
  const response = await api.delete(`/marcas/${id}`)
  return response.data
}

export async function getResenas(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await api.get(`/resenas?${queryString}`)
  return response.data
}

export async function createResena(data) {
  const response = await api.post('/resenas', data)
  return response.data
}

export async function updateResena(id, data) {
  const response = await api.put(`/resenas/${id}`, data)
  return response.data
}

export async function deleteResena(id) {
  const response = await api.delete(`/resenas/${id}`)
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

export async function getAlertaProducto(productoId) {
  const response = await api.get(`/notificaciones/producto/${productoId}/alerta`)
  return response.data
}
export async function crearAlertaProducto(productoId) {
  const response = await api.post(`/notificaciones/producto/${productoId}/alerta`)
  return response.data
}
export async function eliminarAlertaProducto(productoId) {
  const response = await api.delete(`/notificaciones/producto/${productoId}/alerta`)
  return response.data
}

export default api