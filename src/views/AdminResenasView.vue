<template>
  <div class="admin-resenas-view">
    <header class="admin-header">
      <h1>Gestión de Reseñas</h1>
      <p>Administra reseñas de productos</p>
    </header>
    <div v-if="loading" class="loading-state"><p>Cargando reseñas...</p></div>
    <div v-else-if="error" class="error-state"><p>{{ error }}</p><button class="btn btn-primary" @click="loadResenas">Reintentar</button></div>
    <div v-else>
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);padding:1rem;">
        <thead><tr style="background:#f8f9fa;"><th>ID</th><th>Producto</th><th>Usuario</th><th>Calificación</th><th>Comentario</th><th>Fecha</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="r in resenas" :key="r.id" style="border-bottom:1px solid #eee;">
            <td style="padding:1rem;">#{{ r.id }}</td>
            <td style="padding:1rem;">{{ r.producto_nombre || 'Producto ' + r.producto_id }}</td>
            <td style="padding:1rem;">{{ r.usuario_nombre || 'Usuario #' + r.usuario_id }}</td>
            <td style="padding:1rem;">{{ r.calificacion }} ★</td>
            <td style="padding:1rem;">{{ r.comentario || '-' }}</td>
            <td style="padding:1rem;">{{ formatDate(r.fecha) }}</td>
            <td style="padding:1rem;">
              <button @click="eliminarResena(r.id)" class="btn btn-sm btn-outline">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
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
.admin-resenas-view { max-width:1200px; margin:0 auto; padding:1rem; }
.admin-header { text-align:center; margin-bottom:2rem; }
.admin-header h1 { font-size:2.5rem; color:#2c3e50; }
</style>
