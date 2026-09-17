<template>
  <div class="container py-4" style="max-width: 880px;">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Mi Perfil</h1>
      <p style="color: var(--kei-gris-medio);">Gestiona tu información personal</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando perfil...</p>
    </div>

    <div v-else>
      <div class="card shadow-sm overflow-hidden">
        <!-- Avatar header -->
        <div class="card-body text-center p-4 p-md-5" style="background-color: var(--kei-fondo); border-bottom: 1px solid var(--kei-gris-claro);">
          <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm fw-bold fs-1 text-white" style="width: 96px; height: 96px; background-color: var(--kei-gris-oscuro);">
            {{ userInitial }}
          </div>
          <h2 class="h4 fw-bold mb-1" style="color: var(--kei-casi-negro);">{{ userName }}</h2>
          <p class="mb-2" style="color: var(--kei-gris-medio);">{{ userEmail }}</p>
          <span class="badge rounded-pill text-uppercase px-3 py-2" :class="isAdmin ? 'bg-primary' : 'bg-secondary'" style="letter-spacing: 0.05em; font-size: 0.75rem;">
            <i :class="isAdmin ? 'bi bi-shield-check me-1' : 'bi bi-person me-1'"></i>
            {{ isAdmin ? 'Administrador' : 'Cliente' }}
          </span>
        </div>

        <div class="card-body p-4">
          <!-- Información Personal -->
          <div class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-person-lines-fill me-2" style="color: var(--kei-beige);"></i>Información Personal
            </h3>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Nombre</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ userName }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Email</div>
                    <div class="fw-medium text-break" style="color: var(--kei-casi-negro);">{{ userEmail }}</div>
                  </div>
                </div>
              </div>
              <div v-if="telefono" class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Teléfono</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ telefono }}</div>
                  </div>
                </div>
              </div>
              <div v-if="direccion_envio" class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Dirección de envío</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ direccion_envio }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Rol</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ isAdmin ? 'Administrador' : 'Cliente' }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Miembro desde</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ formatDate(fecha_registro) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div>
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-lightning me-2" style="color: var(--kei-beige);"></i>Acciones Rápidas
            </h3>
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <router-link to="/mis-pedidos" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-box-seam fs-5"></i>
                  <span>Mis Pedidos</span>
                </router-link>
              </div>
              <div class="col-12 col-md-4">
                <router-link to="/perfil/favoritos" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-heart fs-5"></i>
                  <span>Mis Favoritos</span>
                </router-link>
              </div>
              <div class="col-12 col-md-4">
                <router-link to="/catalogo" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-bag fs-5"></i>
                  <span>Seguir Comprando</span>
                </router-link>
              </div>
            </div>
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
</style>
