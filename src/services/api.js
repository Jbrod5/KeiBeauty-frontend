import axios from 'axios'

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

export async function getProductById(id) {
  const response = await api.get(`/products/${id}`)
  return response.data.data
}

export async function createOrder(orderData) {
  const response = await api.post('/orders', orderData)
  return response.data
}

export async function forgotPassword(email) {
  const response = await api.post('/auth/olvide-contrasena', { email })
  return response.data
}

export async function resetPassword(token, password, confirmPassword) {
  const response = await api.post('/auth/reestablecer-contrasena', { token, password, confirm_password: confirmPassword })
  return response.data
}

export default api