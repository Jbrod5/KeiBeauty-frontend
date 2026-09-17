<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Gestión de Reseñas</h1>
      <p style="color: var(--kei-gris-medio);">Administra reseñas de productos</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando reseñas...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex flex-column align-items-center text-center gap-3" role="alert">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ error }}</span>
      </div>
      <button class="btn btn-primary btn-sm rounded-pill" @click="loadResenas">Reintentar</button>
    </div>

    <div v-else class="card shadow-sm overflow-hidden">
      <div class="card-header d-flex align-items-center gap-2">
        <i class="bi bi-star" style="color: var(--kei-beige);"></i>
        <span class="fw-bold" style="color: var(--kei-casi-negro);">Reseñas ({{ resenas.length }})</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-3">ID</th>
              <th>Producto</th>
              <th>Usuario</th>
              <th>Calificación</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th class="pe-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in resenas" :key="r.id">
              <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ r.id }}</span></td>
              <td>
                <router-link v-if="r.producto_id" :to="`/producto/${r.producto_id}`" class="text-decoration-none fw-medium d-inline-flex align-items-center gap-1" style="color: var(--kei-gris-oscuro);">
                  <i class="bi bi-box-seam small" style="color: var(--kei-beige);"></i>{{ r.producto_nombre || 'Producto ' + r.producto_id }}
                </router-link>
                <span v-else style="color: var(--kei-casi-negro);">{{ r.producto_nombre || 'Producto ' + r.producto_id }}</span>
              </td>
              <td style="color: var(--kei-gris-medio);">{{ r.usuario_nombre || 'Usuario #' + r.usuario_id }}</td>
              <td>
                <span class="d-inline-flex align-items-center gap-1 fw-bold" style="color: var(--kei-casi-negro);">
                  {{ r.calificacion }}
                  <i class="bi bi-star-fill small" style="color: var(--kei-beige);"></i>
                </span>
                <div class="d-flex gap-1 mt-1">
                  <i v-for="n in 5" :key="n" :class="n <= r.calificacion ? 'bi bi-star-fill' : 'bi bi-star'" :style="n <= r.calificacion ? 'color: var(--kei-beige);' : 'color: var(--kei-gris-claro);'" class="small"></i>
                </div>
              </td>
              <td style="color: var(--kei-gris-medio); max-width: 260px;">
                <span class="text-truncate d-inline-block" style="max-width: 240px;">{{ r.comentario || '-' }}</span>
              </td>
              <td class="small" style="color: var(--kei-gris-medio);">{{ formatDate(r.fecha) }}</td>
              <td class="pe-3">
                <button @click="eliminarResena(r.id)" class="btn btn-outline-secondary btn-sm rounded-pill">
                  <i class="bi bi-trash me-1"></i>Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="resenas.length === 0" class="text-center py-5">
        <i class="bi bi-chat-left-text fs-1 mb-2 d-block" style="color: var(--kei-beige-medio);"></i>
        <p class="mb-0" style="color: var(--kei-gris-medio);">No hay reseñas registradas.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getResenas, deleteResena } from '../services/api'
const router = useRouter()
const authStore = useAuthStore()
const resenas = ref([])
const loading = ref(true)
const error = ref('')
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-GT', { year:'numeric', month:'short', day:'numeric' })
}
async function loadResenas() {
  loading.value = true; error.value = ''
  try {
    const result = await getResenas()
    resenas.value = result.data || []
  } catch (err) { error.value = err.response?.data?.message || 'Error al cargar reseñas' }
  finally { loading.value = false }
}
async function eliminarResena(id) {
  if (!confirm('¿Eliminar reseña?')) return
  try { await deleteResena(id); await loadResenas() }
  catch (err) { error.value = err.response?.data?.message || 'Error al eliminar' }
}
onMounted(async () => {
  if (!authStore.isAdmin) { router.push('/'); return }
  await loadResenas()
})
</script>
<style scoped>
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
