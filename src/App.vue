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
import { computed } from 'vue'
import { useCartStore } from './stores/cartStore'

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalItems)
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
</style>