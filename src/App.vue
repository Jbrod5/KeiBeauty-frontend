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
          <!-- Carrito solo para clientes, no para admin -->
          <li v-if="!isAdmin" class="nav-item">
            <router-link to="/carrito" class="nav-link position-relative">
              <i class="bi bi-bag me-1"></i>Carrito
              <span v-if="cartCount > 0" class="badge rounded-pill ms-1" style="background: var(--kei-oliva);">{{ cartCount }}</span>
            </router-link>
          </li>
          <!-- Panel Admin visible solo admin, pero en navbar como destacado -->
          <li v-if="isAdmin" class="nav-item">
            <router-link to="/admin" class="nav-link fw-semibold" style="color: var(--kei-oliva) !important;"><i class="bi bi-speedometer2 me-1"></i>Panel Admin</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-2">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-outline-primary btn-sm rounded-pill px-3">Iniciar sesión</router-link>
            <router-link to="/registro" class="btn btn-primary btn-sm rounded-pill px-3">Registrarse</router-link>
          </template>
          <div v-else class="dropdown">
            <button class="btn rounded-circle d-flex align-items-center justify-content-center" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width:40px;height:40px;background: var(--kei-oliva);color:#fff;border:none;">
              {{ userInitial }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
              <li><span class="dropdown-item-text fw-semibold font-display">{{ userName }}</span></li>
              <li><span class="dropdown-item-text small text-muted">{{ userEmail }}</span></li>
              <li><span v-if="isAdmin" class="dropdown-item-text"><span class="badge" style="background: var(--kei-oliva);">Administrador</span></span></li>
              <li><hr class="dropdown-divider" /></li>
              <li><router-link to="/perfil" class="dropdown-item"><i class="bi bi-person me-2"></i>Mi perfil</router-link></li>
              <!-- Solo clientes ven pedidos y favoritos -->
              <template v-if="!isAdmin">
                <li><router-link to="/mis-pedidos" class="dropdown-item"><i class="bi bi-box-seam me-2"></i>Mis pedidos</router-link></li>
                <li><router-link to="/perfil/favoritos" class="dropdown-item"><i class="bi bi-heart me-2"></i>Mis favoritos</router-link></li>
              </template>
              <!-- Admin opciones colapsadas aquí -->
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
              </template>
              <li><hr class="dropdown-divider" /></li>
              <li><button @click="logout" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
            </ul>
          </div>
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
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from './stores/cartStore'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartCount = computed(() => cartStore.totalItems)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email || '')
const userInitial = computed(() => authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U')

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar { background: #fff !important; border-bottom: 2px solid var(--kei-oliva-claro); }
.nav-link.router-link-active { color: var(--kei-oliva) !important; font-weight: 600; }
</style>
