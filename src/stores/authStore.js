import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getProfile, refreshToken, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, verify2FA as apiVerify2FA, resend2FA as apiResend2FA, cancelarLogin as apiCancelLogin, activar2FA as apiActivar2FA, desactivar2FA as apiDesactivar2FA, verificarCodigoRecuperacion as apiVerificarCodigoRecuperacion, reenviarCodigoRecuperacion as apiReenviarCodigoRecuperacion } from '../services/api'
import { useCartStore } from './cartStore'
import { useFavoritosStore } from './favoritosStore'

// Sin respuesta del servidor: fallo de red o timeout. No se puede saber si
// la peticion llego a aplicarse en el servidor, asi que el mensaje debe
// dejar claro que se puede reintentar.
const ERROR_RED = 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.'

/**
 * Traduce un error de axios a un mensaje util.
 * @returns {{mensaje: string, campo: string|null}}
 */
function analizarErrorAuth(err, porDefecto) {
  if (!err || !err.response) {
    return { mensaje: ERROR_RED, campo: null }
  }
  const data = err.response.data || {}
  // 409 / EMAIL_DUPLICADO: el campo a marcar es el email
  if (err.response.status === 409 || data.codigo === 'EMAIL_DUPLICADO') {
    return { mensaje: data.error || 'El email ya está registrado.', campo: 'email' }
  }
  return { mensaje: data.error || data.message || porDefecto, campo: null }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshTokenValue = ref(localStorage.getItem('refresh_token') || null)
  const tempToken = ref(localStorage.getItem('temp_token') || null)
  const tempEmail = ref(localStorage.getItem('temp_email') || null)
  const loading = ref(false)
  const error = ref(null)
  // Aviso de cierre de sesion. Es un objeto nuevo en cada cierre para que
  // el watcher de App.vue se dispare tambien en cierres consecutivos.
  const logoutNotice = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.rol === 'admin')
  const userName = computed(() => user.value?.nombre || '')
  const isIn2FAFlow = computed(() => !!tempToken.value && !!tempEmail.value)

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

  function setTempAuth(token, email) {
    tempToken.value = token
    tempEmail.value = email
    localStorage.setItem('temp_token', token)
    localStorage.setItem('temp_email', email)
  }

  function clearTempAuth() {
    tempToken.value = null
    tempEmail.value = null
    localStorage.removeItem('temp_token')
    localStorage.removeItem('temp_email')
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
      const data = response.data
      
      // Check if 2FA is required
      if (data.data?.requiere_2fa) {
        // Guardar token temporal y email para el flujo 2FA
        setTempAuth(data.data.token_temporal, data.data.email)
        return { 
          success: true, 
          requiere2fa: true, 
          email: data.data.email,
          message: data.message 
        }
      }
      
      // Normal login with tokens
      const { access_token, refresh_token, usuario } = data
      setTokens(access_token, refresh_token)
      setUser(usuario)
      // Cargar carrito del usuario desde backend
      const cartStore = useCartStore()
      try { await cartStore.fetchCart() } catch {}
      // Cargar favoritos del usuario
      const favoritosStore = useFavoritosStore()
      try { await favoritosStore.fetchFavoritos() } catch {}
      return { success: true }
    } catch (err) {
      const { mensaje } = analizarErrorAuth(err, 'Error al iniciar sesión')
      error.value = mensaje
      return { success: false, error: mensaje }
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

      // Cargar carrito y favoritos del usuario. Nunca deben romper el
      // registro: si fallan, la cuenta ya esta creada y el usuario esta
      // autenticado, asi que se ignoran los errores silenciosamente.
      const cartStore = useCartStore()
      try { await cartStore.fetchCart() } catch {}
      const favoritosStore = useFavoritosStore()
      try { await favoritosStore.fetchFavoritos() } catch {}
      return { success: true }
    } catch (err) {
      const { mensaje, campo } = analizarErrorAuth(err, 'Error al registrarse')
      error.value = mensaje
      return { success: false, error: mensaje, campo }
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email) {
    loading.value = true
    error.value = null
    try {
      const response = await apiForgotPassword(email)
      return { success: true, message: response.message }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al solicitar recuperación'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(token, password, confirmPassword) {
    loading.value = true
    error.value = null
    try {
      const response = await apiResetPassword(token, password, confirmPassword)
      return { success: true, message: response.message }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al restablecer contraseña'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // Paso 2 del flujo de recuperacion: valida el codigo de 6 digitos y
  // devuelve el token con el que se defines la nueva contrasena.
  async function verificarCodigoRecuperacion(email, codigo) {
    loading.value = true
    error.value = null
    try {
      const response = await apiVerificarCodigoRecuperacion(email, codigo)
      return { success: true, token: response.data?.token, data: response.data }
    } catch (err) {
      const { mensaje } = analizarErrorAuth(err, 'Error al verificar el código')
      error.value = mensaje
      return { success: false, error: mensaje }
    } finally {
      loading.value = false
    }
  }

  async function reenviarCodigoRecuperacion(email) {
    loading.value = true
    error.value = null
    try {
      const response = await apiReenviarCodigoRecuperacion(email)
      return { success: true, message: response.message }
    } catch (err) {
      const { mensaje } = analizarErrorAuth(err, 'Error al reenviar el código')
      error.value = mensaje
      return { success: false, error: mensaje }
    } finally {
      loading.value = false
    }
  }

  async function verify2FA(codigo) {
    loading.value = true
    error.value = null
    try {
      // Usar el token temporal en lugar del access_token normal
      const response = await apiVerify2FA(tempEmail.value, codigo, tempToken.value)
      const { access_token, refresh_token, usuario } = response.data
      setTokens(access_token, refresh_token)
      setUser(usuario)
      clearTempAuth()
      const cartStore = useCartStore()
      await cartStore.fetchCart()
      // Cargar favoritos del usuario
      const favoritosStore = useFavoritosStore()
      await favoritosStore.fetchFavoritos()
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al verificar código'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function resend2FA() {
    loading.value = true
    error.value = null
    try {
      const response = await apiResend2FA(tempEmail.value, tempToken.value)
      return { success: true, message: response.message }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al reenviar código'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function cancelLogin() {
    try {
      await apiCancelLogin(tempToken.value)
    } catch (e) {
      // Silenciar errores en cancelación
    }
    clearTempAuth()
  }

  async function activar2FA() {
    loading.value = true
    error.value = null
    try {
      const response = await apiActivar2FA()
      const usuario = response.data.data?.usuario || null
      if (usuario) {
        setUser({ ...user.value, ...usuario })
      } else {
        setUser({ ...user.value, two_factor_enabled: true })
      }
      return { success: true, message: response.message }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al activar 2FA'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function desactivar2FA() {
    loading.value = true
    error.value = null
    try {
      const response = await apiDesactivar2FA()
      const usuario = response.data.data?.usuario || null
      if (usuario) {
        setUser({ ...user.value, ...usuario })
      } else {
        setUser({ ...user.value, two_factor_enabled: false })
      }
      return { success: true, message: response.message }
    } catch (err) {
      const message = err.response?.data?.error || 'Error al desactivar 2FA'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!accessToken.value) return { success: false }
    if (isIn2FAFlow.value) return { success: false }
    try {
      const response = await getProfile()
      setUser(response.data.usuario)
      return { success: true }
    } catch (err) {
      const estado = err.response?.status
      // Token expirado: intentar renovar con refresh token
      if (estado === 401 && err.response?.data?.msg === 'Token has expired') {
        const refreshed = await tryRefreshToken()
        if (refreshed) {
          try {
            const retry = await getProfile()
            setUser(retry.data.usuario)
            return { success: true }
          } catch {}
        }
        return { success: false }
      }
      // Token inválido o corrupto (401/422, ej. firmado con otro secret):
      // limpiar sesión para no reintentar en loop con un token podrido
      if (estado === 401 || estado === 422) {
        clearTokens()
        clearUser()
      }
      return { success: false }
    }
  }

  async function tryRefreshToken() {
    if (!refreshTokenValue.value || isIn2FAFlow.value) return false
    try {
      const response = await refreshToken(refreshTokenValue.value)
      const { access_token } = response.data
      accessToken.value = access_token
      localStorage.setItem('access_token', access_token)
      return true
    } catch {
      // Solo hacer logout si el refresh falla por token inválido/expirado, no por estar en flujo 2FA
      if (!isIn2FAFlow.value) logout('Tu sesión expiró. Vuelve a iniciar sesión.')
      return false
    }
  }

  /**
   * Cierra la sesion.
   * @param {string|null} motivo Texto a mostrar en el aviso. Si es null se
   *   muestra el aviso de cierre normal.
   */
  function logout(motivo = null) {
    clearTokens()
    clearUser()
    clearTempAuth()

    // Limpiar carrito local al cerrar sesión

    const cartStore = useCartStore()
    cartStore.setItems([])
    // Limpiar favoritos
    const favoritosStore = useFavoritosStore()
    favoritosStore.clearFavoritos()

    logoutNotice.value = motivo
      ? { tipo: 'info', mensaje: motivo }
      : { tipo: 'success', mensaje: 'Sesión cerrada exitosamente' }
  }

  async function initAuth() {
    if (isIn2FAFlow.value) {
      // En flujo 2FA no intentar cargar perfil/cart/favoritos con token temporal
      return
    }
    if (accessToken.value && !user.value) {
      const ok = await fetchProfile()
      if (!ok.success) {
        // Si el perfil falló por token expirado y no se pudo refrescar, ya se hizo logout
        return
      }
      // Cargar carrito si hay usuario autenticado
      const cartStore = useCartStore()
      try { await cartStore.fetchCart() } catch {}
      // Cargar favoritos
      const favoritosStore = useFavoritosStore()
      try { await favoritosStore.fetchFavoritos() } catch {}
    }
  }

  return {
    user,
    accessToken,
    refreshToken: refreshTokenValue,
    tempToken,
    tempEmail,
    loading,
    error,
    logoutNotice,
    isAuthenticated,
    isAdmin,
    userName,
    isIn2FAFlow,
    setTokens,
    clearTokens,
    setUser,
    clearUser,
    setTempAuth,
    clearTempAuth,
    login,
    register,
    forgotPassword,
    resetPassword,
    verificarCodigoRecuperacion,
    reenviarCodigoRecuperacion,
    verify2FA,
    resend2FA,
    cancelLogin,
    activar2FA,
    desactivar2FA,
    fetchProfile,
    logout,
    initAuth
  }
})