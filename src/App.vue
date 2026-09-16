<template>
  <header class="header">
    <nav class="nav container">
      <router-link to="/" class="logo">KeiBeauty</router-link>
      <ul class="nav-links">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/catalogo">Catálogo</router-link></li>
        <li>
          <router-link to="/carrito" class="cart-link">
            🛒 Carrito
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
        </li>
      </ul>

      <div class="nav-actions">
        <div v-if="!isAuthenticated" class="auth-buttons">
          <router-link to="/login" class="btn btn-outline">Iniciar Sesión</router-link>
          <router-link to="/registro" class="btn btn-primary">Registrarse</router-link>
        </div>

        <div v-else class="user-menu">
          <div class="user-avatar" @click="toggleDropdown">
            <span>{{ userInitial }}</span>
          </div>
          <ul v-if="showDropdown" class="dropdown-menu" role="menu">
            <li role="none">
              <span class="dropdown-header" role="menuitem">{{ userName }}</span>
            </li>
            <li role="none">
              <span class="dropdown-email" role="menuitem">{{ userEmail }}</span>
            </li>
            <li role="none"><hr class="dropdown-divider" /></li>
            <li role="none">
              <router-link to="/perfil" class="dropdown-item" role="menuitem">Mi Perfil</router-link>
            </li>
            <li role="none">
              <router-link to="/mis-pedidos" class="dropdown-item" role="menuitem">Mis Pedidos</router-link>
            </li>
            <li role="none">
              <router-link to="/perfil/favoritos" class="dropdown-item" role="menuitem">Mis Favoritos</router-link>
            </li>
            <li v-if="isAdmin" role="none">
              <router-link to="/admin/categorias" class="dropdown-item" role="menuitem">Categorías</router-link>
            </li>
            <li v-if="isAdmin" role="none">
              <router-link to="/admin/pedidos" class="dropdown-item" role="menuitem">Panel Admin</router-link>
            </li>
            <li v-if="isAdmin" role="none">
              <router-link to="/admin/productos" class="dropdown-item" role="menuitem">Productos</router-link>
            </li>
            <li role="none"><hr class="dropdown-divider" /></li>
            <li role="none">
              <button @click="logout" class="dropdown-item dropdown-logout" role="menuitem">Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <main class="main container">
    <router-view />
  </main>
  <footer class="footer">
    <p>&copy; 2024 KeiBeauty. Cuidado de la piel coreano.</p>
  </footer>
</template>

<script setup>
import { computed, ref } from 'vue'
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

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function logout() {
  authStore.logout()
  showDropdown.value = false
  router.push('/')
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    showDropdown.value = false
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #fafafa;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #e91e63;
}

.cart-link {
  position: relative;
  text-decoration: none;
  color: #555;
  font-weight: 500;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background: #e91e63;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #e91e63;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #c2185b;
}

.btn-outline {
  background: transparent;
  color: #e91e63;
  border: 1px solid #e91e63;
}

.btn-outline:hover {
  background: #e91e63;
  color: white;
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 220px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border: 1px solid #eee;
  list-style: none;
  padding: 0.5rem 0;
  z-index: 200;
  animation: dropdownIn 0.15s ease-out;
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  display: block;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.dropdown-email {
  display: block;
  padding: 0 1rem 0.75rem;
  font-size: 0.85rem;
  color: #666;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 0.5rem 0.

}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
}

.dropdown-item:hover {
  background: #fafafa;
  color: #e91e63;
}

.dropdown-logout {
  color: #e53935;
}

.dropdown-logout:hover {
  background: #fdeaea;
}

.main {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.footer {
  background: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .auth-buttons .btn-outline {
    display: none;
  }
}
</style>