<template>
  <div class="admin-marcas-view">
    <header class="admin-header">
      <h1>Gestión de Marcas</h1>
      <p class="admin-subtitle">Administra marcas del catálogo</p>
    </header>
    <div v-if="loading" class="loading-state"><p>Cargando marcas...</p></div>
    <div v-else-if="error" class="error-state"><p>{{ error }}</p><button class="btn btn-primary" @click="loadMarcas">Reintentar</button></div>
    <div v-else>
      <section style="background:white;padding:1.5rem;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:2rem;">
        <h2>{{ editMode ? 'Editar Marca' : 'Crear Marca' }}</h2>
        <form @submit.prevent="saveMarca()">
          <input v-model="form.nombre" placeholder="Nombre" required style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;" />
          <textarea v-model="form.descripcion" placeholder="Descripción" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;"></textarea>
          <input v-model="form.logo_url" placeholder="URL del logo (opcional)" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;" />
          <button type="submit" class="btn btn-primary">{{ editMode ? 'Guardar cambios' : 'Crear marca' }}</button>
          <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline" style="margin-left:0.5rem;">Cancelar</button>
        </form>
      </section>
      <section style="background:white;padding:1.5rem;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8f9fa;">
              <th style="padding:1rem;text-align:left;">ID</th>
              <th style="padding:1rem;text-align:left;">Nombre</th>
              <th style="padding:1rem;text-align:left;">Descripción</th>
              <th style="padding:1rem;text-align:left;">Logo</th>
              <th style="padding:1rem;text-align:left;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in marcas" :key="m.id" style="border-bottom:1px solid #eee;">
              <td style="padding:1rem;"><strong>#{{ m.id }}</strong></td>
              <td style="padding:1rem;">{{ m.nombre }}</td>
              <td style="padding:1rem;">{{ m.descripcion || '-' }}</td>
              <td style="padding:1rem;"><img v-if="m.logo_url" :src="m.logo_url" alt="logo" style="max-height:40px;max-width:80px;" /></td>
              <td style="padding:1rem;">
                <button @click="editMarca(m)" class="btn btn-sm btn-outline">Editar</button>
                <button @click="eliminarMarca(m.id)" class="btn btn-sm btn-outline" style="margin-left:0.25rem;">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getMarcas, createMarca, updateMarca, deleteMarca } from '../services/api'
const router = useRouter()
const authStore = useAuthStore()
const marcas = ref([])
const loading = ref(true)
const error = ref('')
const editMode = ref(false)
const form = ref({ nombre: '', descripcion: '', logo_url: '' })
async function loadMarcas() {
  loading.value = true; error.value = ''
  try {
    const res = await getMarcas()
    marcas.value = res.data || []
  } catch (err) { error.value = err.response?.data?.message || 'Error al cargar marcas' }
  finally { loading.value = false }
}
async function saveMarca() {
  try {
    if (editMode.value) {
      await updateMarca(editMode.value.id, form.value)
      editMode.value = false
    } else {
      const res = await createMarca(form.value)
      if (res && res.data) {
        form.value = { nombre: '', descripcion: '', logo_url: '' }
        await loadMarcas()
      }
    }
  } catch (err) { error.value = err.response?.data?.message || 'Error al guardar marca' }
}
function editMarca(m) { editMode.value = m; form.value = { ...m } }
function cancelEdit() { editMode.value = false; form.value = { nombre: '', descripcion: '', logo_url: '' } }
async function eliminarMarca(id) {
  if (!confirm('¿Eliminar marca?')) return
  try { await deleteMarca(id); await loadMarcas() }
  catch (err) { error.value = err.response?.data?.message || 'Error al eliminar' }
}
onMounted(async () => {
  if (!authStore.isAdmin) { router.push('/'); return }
  await loadMarcas()
})
</script>
<style scoped>
.admin-marcas-view { max-width: 1200px; margin: 0 auto; padding: 1rem; }
.admin-header { text-align: center; margin-bottom: 2rem; }
.admin-header h1 { font-size: 2.5rem; color: #2c3e50; }
</style>
