<template>
  <nav class="navbar navbar-expand-lg sticky-top shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <img :src="logoKei" alt="Logo KeiBeauty" class="logo-navbar" />
        <span class="font-display">KeiBeauty</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarKei" aria-controls="navbarKei" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarKei">
        <ul class="navbar-nav mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item"><router-link to="/catalogo" class="nav-link">Catálogo</router-link></li>
        </ul>

        <!-- Buscador de productos: en la barra superior para buscar desde cualquier página -->
        <div class="buscador-navbar flex-grow-1 px-0 px-lg-3">
          <div class="input-group">
            <span class="input-group-text" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">
              <i class="bi bi-search" style="color: var(--kei-beige-medio);"></i>
            </span>
            <input
              type="search"
              v-model="busqueda"
              @input="alEscribirBusqueda"
              @keyup.enter="aplicarBusqueda"
              @keyup.esc="limpiarBusqueda"
              placeholder="Buscar productos..."
              class="form-control"
              aria-label="Buscar productos"
            />
            <button v-if="busqueda" type="button" class="btn btn-light" @click="limpiarBusqueda" title="Limpiar búsqueda" aria-label="Limpiar búsqueda">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2 ms-auto">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-outline-primary btn-sm rounded-pill px-3">Iniciar sesión</router-link>
            <router-link to="/registro" class="btn btn-primary btn-sm rounded-pill px-3">Registrarse</router-link>
          </template>
          <template v-else>
            <!-- Campana notificaciones -->
            <div class="dropdown">
              <button class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width:38px;height:38px; border:1px solid var(--kei-gris-claro);">
                <i class="bi bi-bell" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
                <span v-if="notifStore.noLeidas > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:0.6rem;">{{ notifStore.noLeidas > 9 ? '9+' : notifStore.noLeidas }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow" style="width:360px; max-height:400px; overflow:auto;">
                <li class="dropdown-header d-flex justify-content-between align-items-center">
                  <span class="fw-bold">Notificaciones</span>
                  <button v-if="notifStore.noLeidas>0" @click="notifStore.marcarTodasLeidas()" class="btn btn-sm btn-link p-0" style="font-size:0.7rem; color: var(--kei-oliva);">Marcar todas leídas</button>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li v-if="notifStore.notificaciones.length===0" class="text-center py-3 small" style="color: var(--kei-gris-medio);">Sin notificaciones</li>
                <li v-for="n in notifStore.notificaciones" :key="n.id" class="px-2 py-1" :style="n.leido ? 'opacity:0.7;' : 'background: var(--kei-oliva-suave);'">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1" @click="handleNotifClick(n)" style="cursor:pointer;">
                      <div class="small fw-semibold" style="color: var(--kei-casi-negro);"><i :class="iconoNotif(n.tipo)" class="me-1" style="color: var(--kei-oliva);"></i>{{ n.titulo }}</div>
                      <div class="small" style="color: var(--kei-gris-medio);">{{ n.mensaje }}</div>
                      <small style="color: var(--kei-beige-medio);">{{ formatFecha(n.fecha_creacion) }}</small>
                    </div>
                    <button v-if="!n.leido" @click.stop="notifStore.marcarLeida(n.id)" class="btn btn-sm ms-2" title="Marcar leída" style="color: var(--kei-oliva);"><i class="bi bi-check2-circle"></i></button>
                  </div>
                  <hr class="my-1" style="border-color: var(--kei-gris-claro);" />
                </li>
              </ul>
            </div>
            <!-- Carrito -->
            <router-link
              v-if="!isAdmin"
              to="/carrito"
              class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center"
              style="width:38px;height:38px; border:1px solid var(--kei-gris-claro);"
              title="Carrito"
              aria-label="Carrito"
            >
              <i class="bi bi-bag" style="color: var(--kei-oliva); font-size:1.1rem;"></i>
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill" style="background: var(--kei-oliva); font-size:0.6rem;">{{ cartCount }}</span>
            </router-link>
            <!-- Avatar -->
            <div class="dropdown">
              <button class="btn rounded-circle d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width:40px;height:40px;background: var(--kei-oliva);color:#fff;border:none;">
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from './stores/cartStore'
import { useAuthStore } from './stores/authStore'
import { useNotificacionStore } from './stores/notificacionStore'
import logoKei from './assets/kei-beauty.jpg'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notifStore = useNotificacionStore()
const toast = useToast()

// En móvil el menú del navbar es desplegable: contraerlo automáticamente
// después de cada navegación para no tapar el contenido.
// Se cierra con un clic programático en el toggler para usar la única
// instancia de Bootstrap (main.js) y no duplicar manejadores de eventos.
function cerrarMenuNavbar() {
  const elemento = document.getElementById('navbarKei')
  const toggler = document.querySelector('.navbar-toggler')
  if (!elemento || !toggler) return
  if (elemento.classList.contains('show')) toggler.click()
}
router.afterEach(() => cerrarMenuNavbar())

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
const temporizadorBusqueda = ref(null)

// El input refleja lo que hay en la URL (por ejemplo al llegar desde otra página)
watch(() => route.query.buscar, (valor) => {
  const texto = valor || ''
  if (texto !== busqueda.value) busqueda.value = texto
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
function iconoNotif(tipo){
  if(tipo==='pedido_estado') return 'bi bi-box-seam'
  if(tipo==='pedido_guia') return 'bi bi-truck'
  if(tipo==='producto_stock') return 'bi bi-bell'
  return 'bi bi-info-circle'
}
function formatFecha(f){
  if(!f) return ''
  return new Date(f).toLocaleString('es-GT', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})
}
function handleNotifClick(n){
  notifStore.marcarLeida(n.id)
  if(n.datos?.pedido_id){
    router.push(`/mis-pedidos/${n.datos.pedido_id}`)
  } else if(n.datos?.producto_id){
    router.push(`/producto/${n.datos.producto_id}`)
  }
}

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
/* El buscador ocupa el espacio disponible entre la marca y los iconos */
.buscador-navbar .input-group { max-width: 480px; }
/* En móvil el buscador baja a su propia línea, a lo ancho del menú */
@media (max-width: 991.98px) {
  .buscador-navbar { order: 3; width: 100%; padding-top: 0.5rem; }
  .buscador-navbar .input-group { max-width: none; }
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
