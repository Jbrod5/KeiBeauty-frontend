<template>
  <div class="profile-view">
    <header class="profile-header">
      <h1>Mi Perfil</h1>
      <p class="profile-subtitle">Gestiona tu información personal</p>
    </header>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando perfil...</p>
    </div>

    <div v-else class="profile-content">
      <div class="profile-card">
        <div class="profile-avatar">
          <span>{{ userInitial }}</span>
        </div>
        <h2 class="profile-name">{{ userName }}</h2>
        <p class="profile-email">{{ userEmail }}</p>
        <span class="profile-role" :class="isAdmin ? 'role-admin' : 'role-cliente'">
          {{ isAdmin ? 'Administrador' : 'Cliente' }}
        </span>
      </div>

      <div class="profile-sections">
        <div class="profile-section">
          <h3>Información Personal</h3>
          <dl class="profile-details">
            <div>
              <dt>Nombre</dt>
              <dd>{{ userName }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ userEmail }}</dd>
            </div>
            <div v-if="telefono">
              <dt>Teléfono</dt>
              <dd>{{ telefono }}</dd>
            </div>
            <div v-if="direccion_envio">
              <dt>Dirección de envío</dt>
              <dd>{{ direccion_envio }}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{{ isAdmin ? 'Administrador' : 'Cliente' }}</dd>
            </div>
            <div>
              <dt>Miembro desde</dt>
              <dd>{{ formatDate(fecha_registro) }}</dd>
            </div>
          </dl>
        </div>

        <div class="profile-section">
          <h3>Acciones Rápidas</h3>
          <div class="quick-actions">
            <router-link to="/mis-pedidos" class="action-btn">
              <span class="action-icon">📦</span>
              <span>Mis Pedidos</span>
            </router-link>
            <router-link to="/perfil/favoritos" class="action-btn">
              <span class="action-icon">♡</span>
              <span>Mis Favoritos</span>
            </router-link>
            <router-link to="/catalogo" class="action-btn">
              <span class="action-icon">🛍️</span>
              <span>Seguir Comprando</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)

const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email || '')
const isAdmin = computed(() => authStore.isAdmin)
const userInitial = computed(() => authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U')
const telefono = computed(() => authStore.user?.telefono || '')
const direccion_envio = computed(() => authStore.user?.direccion_envio || '')
const fecha_registro = computed(() => authStore.user?.fecha_registro || '')

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function logout() {
  authStore.logout()
  router.push('/')
}

async function loadProfile() {
  loading.value = true
  try {
    if (authStore.accessToken.value && !authStore.user.value) {
      await authStore.fetchProfile()
    }
  } catch (err) {
    console.error('Error loading profile:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.profile-card {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-bottom: 1px solid #eee;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 16px rgba(233, 30, 99, 0.3);
}

.profile-name {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 0.25rem;
}

.profile-email {
  color: #666;
  margin: 0 0 0.5rem;
}

.profile-role {
  display: inline-block;
  padding: 0.375rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-admin {
  background: #e3f2fd;
  color: #1565c0;
}

.role-cliente {
  background: #e8f5e9;
  color: #2e7d32;
}

.profile-sections {
  padding: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.profile-section h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e91e63;
  display: inline-block;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.profile-details div {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.profile-details dt {
  font-size: 0.8rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.profile-details dd {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 180px;
  justify-content: center;
}

.action-btn:hover {
  border-color: #e91e63;
  color: #e91e63;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.15);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  gap: 1rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #e91e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-details {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>