<template>
  <nav class="navbar navbar-expand-lg sticky-top shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
        <i class="bi bi-stars" style="color: var(--kei-oliva);"></i>
        <span class="font-display">KeiBeauty</span>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarKei" aria-controls="navbarKei" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarKei">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item"><router-link to="/" class="nav-link">Inicio</router-link></li>
          <li class="nav-item"><router-link to="/catalogo" class="nav-link">Catálogo</router-link></li>
          <li v-if="!isAdmin" class="nav-item">
            <router-link to="/carrito" class="nav-link position-relative">
              <i class="bi bi-bag me-1"></i>Carrito
              <span v-if="cartCount > 0" class="badge rounded-pill ms-1" style="background: var(--kei-oliva);">{{ cartCount }}</span>
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link to="/admin" class="nav-link fw-semibold" style="color: var(--kei-oliva) !important;"><i class="bi bi-speedometer2 me-1"></i>Panel Admin</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-2">
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
                  <li><hr class="dropdown-divider" /></li>
                  <li><h6 class="dropdown-header">Administración</h6></li>
                  <li><router-link to="/admin" class="dropdown-item"><i class="bi bi-speedometer2 me-2"></i>Dashboard</router-link></li>
                  <li><router-link to="/admin/productos" class="dropdown-item"><i class="bi bi-box-seam me-2"></i>Productos</router-link></li>
                  <li><router-link to="/admin/productos/crear" class="dropdown-item ps-4 small"><i class="bi bi-plus-lg me-1"></i>Crear producto</router-link></li>
                  <li><router-link to="/admin/marcas" class="dropdown-item"><i class="bi bi-award me-2"></i>Marcas</router-link></li>
                  <li><router-link to="/admin/categorias" class="dropdown-item"><i class="bi bi-tags me-2"></i>Categorías</router-link></li>
                <li><router-link to="/admin/pedidos" class="dropdown-item"><i class="bi bi-receipt me-2"></i>Pedidos</router-link></li>
                <li><router-link to="/admin/resenas" class="dropdown-item"><i class="bi bi-star me-2"></i>Reseñas</router-link></li>
                <li><router-link to="/admin/reportes" class="dropdown-item"><i class="bi bi-bar-chart-line me-2"></i>Reportes</router-link></li>
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
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from './stores/cartStore'
import { useAuthStore } from './stores/authStore'
import { useNotificacionStore } from './stores/notificacionStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notifStore = useNotificacionStore()

const cartCount = computed(() => cartStore.totalItems)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U')
const whatsappUrl = computed(() => import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/50239718418')

function logout() {
  authStore.logout()
  router.push('/')
}
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
</style>
