<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Gestión de Marcas</h1>
      <p style="color: var(--kei-gris-medio);">Administra marcas del catálogo</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando marcas...</p>
    </div>

    <div v-else-if="error && marcas.length === 0" class="alert alert-danger d-flex flex-column align-items-center text-center gap-3" role="alert">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ error }}</span>
      </div>
      <button class="btn btn-primary btn-sm rounded-pill" @click="loadMarcas">Reintentar</button>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <div>{{ error }}</div>
      </div>

      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="bi" :class="editMode ? 'bi-pencil-square' : 'bi-plus-circle'" style="color: var(--kei-beige);"></i>
          <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">{{ editMode ? 'Editar Marca' : 'Crear Marca' }}</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveMarca()" class="d-flex flex-column gap-3">
            <div>
              <label class="form-label">Nombre</label>
              <input v-model="form.nombre" placeholder="Nombre de la marca" required class="form-control" />
            </div>
            <div>
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" placeholder="Descripción opcional" rows="2" class="form-control"></textarea>
            </div>
            <div>
              <label class="form-label">URL del logo (opcional)</label>
              <input v-model="form.logo_url" placeholder="https://..." class="form-control" />
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary rounded-pill">
                <i :class="editMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-2"></i>{{ editMode ? 'Guardar cambios' : 'Crear marca' }}
              </button>
              <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline-secondary rounded-pill">
                <i class="bi bi-x-lg me-1"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="card shadow-sm overflow-hidden">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="bi bi-award" style="color: var(--kei-beige);"></i>
          <span class="fw-bold" style="color: var(--kei-casi-negro);">Marcas ({{ marcas.length }})</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-3">ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Logo</th>
                <th class="pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in marcas" :key="m.id">
                <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ m.id }}</span></td>
                <td class="fw-medium" style="color: var(--kei-casi-negro);">{{ m.nombre }}</td>
                <td style="color: var(--kei-gris-medio);">{{ m.descripcion || '-' }}</td>
                <td>
                  <img v-if="m.logo_url" :src="m.logo_url" alt="logo" class="rounded border" style="max-height: 40px; max-width: 80px; object-fit: contain; border-color: var(--kei-gris-claro) !important;" />
                  <span v-else class="small" style="color: var(--kei-beige-medio);"><i class="bi bi-image me-1"></i>Sin logo</span>
                </td>
                <td class="pe-3">
                  <div class="d-flex gap-2">
                    <button @click="editMarca(m)" class="btn btn-outline-primary btn-sm rounded-pill">
                      <i class="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button @click="eliminarMarca(m.id)" class="btn btn-outline-secondary btn-sm rounded-pill">
                      <i class="bi bi-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="marcas.length === 0" class="text-center py-5">
          <i class="bi bi-award fs-1 mb-2 d-block" style="color: var(--kei-beige-medio);"></i>
          <p class="mb-0" style="color: var(--kei-gris-medio);">No hay marcas registradas.</p>
        </div>
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
</style>
