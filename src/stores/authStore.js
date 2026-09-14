import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getProfile, refreshToken } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshTokenValue = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.rol === 'admin')
  const userName = computed(() => user.value?.nombre || '')

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshTokenValue.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  function clearTokens() {
    accessToken.value = null
    refreshTokenValue.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await apiLogin(credentials)
      const { access_token, refresh_token, usuario } = response.data
      setTokens(access_token, refresh_token)
      setUser(usuario)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al iniciar sesión'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await apiRegister(userData)
      const { access_token, refresh_token, usuario } = response.data
      setTokens(access_token, refresh_token)
      setUser(usuario)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al registrarse'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!accessToken.value) return { success: false }
    try {
      const response = await getProfile()
      setUser(response.data.usuario)
      return { success: true }
    } catch (err) {
      if (err.response?.status === 401) {
        await tryRefreshToken()
      }
      return { success: false }
    }
  }

  async function tryRefreshToken() {
    if (!refreshTokenValue.value) return false
    try {
      const response = await refreshToken(refreshTokenValue.value)
      const { access_token } = response.data
      accessToken.value = access_token
      localStorage.setItem('access_token', access_token)
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    clearTokens()
    clearUser()
  }

  async function initAuth() {
    if (accessToken.value && !user.value) {
      await fetchProfile()
    }
  }

  return {
    user,
    accessToken,
    refreshToken: refreshTokenValue,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    userName,
    login,
    register,
    fetchProfile,
    logout,
    initAuth
  }
})