<template>
  <nav class="navbar sticky-top shadow-sm">
    <div class="container">
      <div class="navbar-inner" :class="{ 'busqueda-abierta': busquedaAbierta }">
        <!-- Marca + enlace al catálogo -->
        <div class="navbar-izq">
          <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
            <img :src="logoKei" alt="Logo KeiBeauty" class="logo-navbar" />
            <span class="font-display d-none d-lg-inline">KeiBeauty</span>
            <span class="font-display d-lg-none marca-movil">Kei<br />Beauty</span>
          </router-link>
          <ul class="navbar-nav d-none d-lg-flex align-items-lg-center">
            <li class="nav-item"><router-link to="/catalogo" class="nav-link">Catálogo</router-link></li>
          </ul>
        </div>

        <!-- Buscador de productos: centrado en escritorio, desplegable en móvil -->
        <div class="buscador-navbar" :class="{ 'abierto': busquedaAbierta }">
          <div class="input-group">
            <span class="input-group-text" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">
              <i class="bi bi-search" style="color: var(--kei-beige-medio);"></i>
            </span>
            <input
              type="search"
              v-model="busqueda"
              @input="alEscribirBusqueda"
              @keyup.enter="aplicarBusqueda"
              @keyup.esc="cerrarBusqueda"
              placeholder="Buscar productos..."
              class="form-control"
              aria-label="Buscar productos"
            />
            <button v-if="busqueda" type="button" class="btn btn-light" @click="limpiarBusqueda" title="Limpiar búsqueda" aria-label="Limpiar búsqueda">
              <i class="bi bi-x-lg"></i>
            </button>
            <button v-if="busquedaAbierta" type="button" class="btn btn-light d-lg-none cerrar-busquedor" @click="cerrarBusqueda" title="Cerrar búsqueda" aria-label="Cerrar búsqueda">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Iconos: notificaciones (escritorio), buscar (móvil), carrito y perfil -->
        <div class="iconos-navbar">
          <!-- Botón de búsqueda (solo móvil): despliega la barra de búsqueda -->
          <button
            type="button"
            class="btn btn-light rounded-circle d-flex align-items-center justify-content-center icono-redondo d-lg-none boton-buscar"
            @click="alternarBusqueda"
            title="Buscar productos"
            aria-label="Buscar productos"
          >
            <i class="bi bi-search" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
          </button>
          <template v-if="!isAuthenticated">
            <!-- Carrito (el invitado también puede usar el carrito con token de invitado) -->
            <router-link
              v-if="!isAdmin"
              to="/carrito"
              class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center icono-redondo"
              title="Carrito"
              aria-label="Carrito"
            >
              <i class="bi bi-bag" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: var(--kei-oliva); font-size:0.6rem;">{{ cartCount }}</span>
            </router-link>
            <router-link to="/login" class="btn btn-outline-primary btn-sm rounded-pill px-3 boton-acceso text-nowrap">Iniciar sesión</router-link>
            <router-link to="/registro" class="btn btn-primary btn-sm rounded-pill px-3 boton-acceso text-nowrap">Registrarse</router-link>
          </template>

          <template v-else>
            <!-- Campana de notificaciones (solo escritorio; en móvil vive en el menú del perfil) -->
            <div class="dropdown d-none d-lg-block">
              <button class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center icono-redondo" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-bell" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
                <span v-if="notifStore.noLeidas > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:0.6rem;">{{ notifStore.noLeidas > 9 ? '9+' : notifStore.noLeidas }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow" style="width:360px; max-height:400px; overflow:auto;">
                <li class="dropdown-header d-flex justify-content-between align-items-center">
                  <span class="fw-bold">Notificaciones</span>
                  <button v-if="notifStore.noLeidas>0" @click="notifStore.marcarTodasLeidas()" class="btn btn-sm btn-link p-0" style="font-size:0.7rem; color: var(--kei-oliva);">Marcar todas leídas</button>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li><NotificacionesLista /></li>
              </ul>
            </div>
            <!-- Carrito -->
            <router-link
              v-if="!isAdmin"
              to="/carrito"
              class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center icono-redondo"
              title="Carrito"
              aria-label="Carrito"
            >
              <i class="bi bi-bag" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: var(--kei-oliva); font-size:0.6rem;">{{ cartCount }}</span>
            </router-link>
            <!-- Avatar -->
            <div class="dropdown">
              <button class="btn rounded-circle d-flex align-items-center justify-content-center avatar" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ userInitial }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li><span class="dropdown-item-text fw-semibold font-display">{{ userName }}</span></li>
                <li><span class="dropdown-item-text small text-muted">{{ userEmail }}</span></li>
                <li><span v-if="isAdmin" class="dropdown-item-text"><span class="badge" style="background: var(--kei-oliva);">Administrador</span></span></li>
                <li><hr class="dropdown-divider" /></li>
                <li><router-link to="/perfil" class="dropdown-item"><i class="bi bi-person me-2"></i>Mi perfil</router-link></li>
                <template v-if="!isAdmin">
                  <li><router-link to="/mis-pedidos" class="dropdown-item"><i class="bi bi-box-seam me-2"></i>Mis pedidos</router-link></li>
                  <li><router-link to="/perfil/favoritos" class="dropdown-item"><i class="bi bi-heart me-2"></i>Mis favoritos</router-link></li>
                </template>
                <template v-if="isAdmin">
                  <li><router-link to="/admin" class="dropdown-item"><i class="bi bi-speedometer2 me-2"></i>Panel de administración</router-link></li>
                </template>
                <!-- Notificaciones en móvil: viven dentro del menú del perfil -->
                <li class="d-lg-none">
                  <button class="dropdown-item d-flex justify-content-between align-items-center" @click="verNotificaciones = !verNotificaciones">
                    <span><i class="bi bi-bell me-2"></i>Notificaciones</span>
                    <span v-if="notifStore.noLeidas > 0" class="badge rounded-pill bg-danger">{{ notifStore.noLeidas }}</span>
                  </button>
                </li>
                <li v-if="verNotificaciones" class="d-lg-none">
                  <div class="px-2 py-2" style="max-height:300px; overflow:auto;">
                    <NotificacionesLista compacto />
                  </div>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li><button @click="logout" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
  <main class="container py-4" style="min-height: calc(100vh - 140px);">
    <router-view />
  </main>
  <footer class="footer-kei text-center py-4 mt-auto">
    <div class="container">
      <nav class="d-flex justify-content-center flex-wrap gap-3 mb-2">
        <router-link to="/catalogo" class="footer-enlace">Catálogo</router-link>
        <router-link to="/sobre-nosotros" class="footer-enlace">Sobre nosotros</router-link>
      </nav>
      <p class="mb-1 font-display"><i class="bi bi-stars me-1"></i> KeiBeauty — Tu ritual esencial</p>
      <small style="color: var(--kei-beige-claro)">Cuidado de la piel coreano · Xela, Guatemala · WhatsApp 3971 8418</small>
    </div>
  </footer>
  <!-- Botón WhatsApp flotante -->
  <a :href="whatsappUrl" target="_blank" rel="noopener" class="btn rounded-circle shadow d-flex align-items-center justify-content-center position-fixed" style="width:56px;height:56px; bottom:20px; right:20px; background:#25D366; color:#fff; z-index:1040; font-size:1.6rem;" title="Chatear por WhatsApp">
    <i class="bi bi-whatsapp"></i>
  </a>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from './stores/cartStore'
import { useAuthStore } from './stores/authStore'
import { useNotificacionStore } from './stores/notificacionStore'
import NotificacionesLista from './components/NotificacionesLista.vue'
import logoKei from './assets/kei-beauty.jpg'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notifStore = useNotificacionStore()
const toast = useToast()

const cartCount = computed(() => cartStore.totalItems)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U')
const whatsappUrl = computed(() => import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/50239718418')

// --- Buscador de la barra superior ---
// La búsqueda vive en la URL (/catalogo?buscar=...) para que el catálogo la
// aplique y se pueda compartir o recargar sin perder el filtro.
const busqueda = ref('')
const busquedaAbierta = ref(false)
const temporizadorBusqueda = ref(null)
// Panel de notificaciones del menú del perfil (solo móvil)
const verNotificaciones = ref(false)

// El input refleja lo que hay en la URL (por ejemplo al llegar desde otra página)
watch(() => route.query.buscar, (valor) => {
  const texto = valor || ''
  if (texto !== busqueda.value) busqueda.value = texto
})

// Al cambiar de página la búsqueda móvil se cierra
watch(() => route.path, () => {
  busquedaAbierta.value = false
})

function alEscribirBusqueda() {
  clearTimeout(temporizadorBusqueda.value)
  temporizadorBusqueda.value = setTimeout(() => aplicarBusqueda(), 350)
}

function aplicarBusqueda() {
  clearTimeout(temporizadorBusqueda.value)
  const texto = busqueda.value.trim()
  const query = { ...route.query }
  if (texto) {
    query.buscar = texto
  } else {
    delete query.buscar
  }
  // Si ya estamos en el catálogo con la misma búsqueda no hay nada que hacer
  if (route.path === '/catalogo' && JSON.stringify(query) === JSON.stringify(route.query)) return
  router.push({ path: '/catalogo', query })
}

function limpiarBusqueda() {
  busqueda.value = ''
  aplicarBusqueda()
}

function alternarBusqueda() {
  busquedaAbierta.value = !busquedaAbierta.value
  if (busquedaAbierta.value) {
    nextTick(() => document.querySelector('.buscador-navbar input')?.focus())
  }
}

function cerrarBusqueda() {
  busquedaAbierta.value = false
}

function logout() {
  authStore.logout()
  router.push('/')
}

// Aviso visual del cierre de sesion (manual o por token expirado).
watch(() => authStore.logoutNotice, (aviso) => {
  if (!aviso) return
  if (aviso.tipo === 'success') {
    toast.success(aviso.mensaje)
  } else {
    toast.info(aviso.mensaje)
  }
})

let pollInterval = null
onMounted(() => {
  if (isAuthenticated.value) notifStore.fetchNotificaciones()
  pollInterval = setInterval(() => {
    if (isAuthenticated.value) notifStore.fetchNotificaciones()
  }, 30000)
})
watch(isAuthenticated, (val) => {
  if (val) notifStore.fetchNotificaciones()
  else {
    if(pollInterval) clearInterval(pollInterval)
  }
})
</script>

<style scoped>
.navbar { background: #fff !important; border-bottom: 2px solid var(--kei-oliva-claro); }
.nav-link.router-link-active { color: var(--kei-oliva) !important; font-weight: 600; }

/* Logo de la empresa en el navbar */
.logo-navbar {
  width: 34px;
  height: 34px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--kei-gris-claro);
}

/* Tres columnas: marca | buscador (centrado) | iconos */
.navbar-inner {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}
.navbar-izq { justify-self: start; display: flex; align-items: center; gap: 1.25rem; min-width: 0; }
.buscador-navbar { justify-self: center; }
.buscador-navbar .input-group { width: 460px; max-width: 100%; }
.iconos-navbar { justify-self: end; display: flex; align-items: center; gap: 0.5rem; }
.icono-redondo { width: 38px; height: 38px; border: 1px solid var(--kei-gris-claro); }
.avatar { width: 40px; height: 40px; background: var(--kei-oliva); color: #fff; border: none; }

/* En móvil la barra se compacta: marca en dos líneas y la búsqueda se despliega */
@media (max-width: 991.98px) {
  .navbar-inner { grid-template-columns: auto minmax(0, 1fr) auto; gap: 0.5rem; }
  .navbar-izq { gap: 0.5rem; }
  .logo-navbar { width: 28px; height: 28px; }
  .marca-movil { font-size: 0.82rem; line-height: 1.05; }
  /* Los botones de acceso se compactan para que quepan con la marca y los iconos */
  .boton-acceso { padding-left: 0.5rem !important; padding-right: 0.5rem !important; font-size: 0.78rem; }
  /* El buscador se colapsa (no se quita) para que siga ocupando su columna
     en la cuadrícula y la marca no se aplaste. */
  .buscador-navbar { visibility: hidden; width: 0; overflow: hidden; padding: 0; }
  .buscador-navbar.abierto { visibility: visible; width: auto; overflow: visible; }
  .buscador-navbar .input-group { width: 100%; }
  .iconos-navbar { gap: 0.35rem; }
  .icono-redondo { width: 34px; height: 34px; }
  .avatar { width: 36px; height: 36px; }
  /* Con el buscador abierto se ocultan los botones de acceso para que la
     barra de búsqueda tenga todo el espacio entre la marca y los iconos. */
  .navbar-inner.busqueda-abierta .boton-acceso { display: none !important; }
  /* Con la búsqueda abierta se oculta la lupa (ya está el campo visible). */
  .navbar-inner.busqueda-abierta .boton-buscar { display: none !important; }
}

/* Enlaces del footer */
.footer-enlace {
  color: var(--kei-beige-claro);
  text-decoration: none;
  font-size: 0.9rem;
}
.footer-enlace:hover, .footer-enlace.router-link-active { color: #fff; text-decoration: underline; }

/* En móvil los desplegables del navbar (notificaciones, perfil) se muestran
   como lámina fija bajo la barra: así nunca quedan cortados por el viewport. */
@media (max-width: 575.98px) {
  .navbar .dropdown-menu {
    position: fixed;
    top: 62px;
    left: 0.75rem;
    right: 0.75rem;
    width: auto !important;
    max-height: calc(100vh - 90px);
    overflow-y: auto;
  }
}
</style>
