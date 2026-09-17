<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Gestión de Categorías</h1>
      <p style="color: var(--kei-gris-medio);">Administra las categorías del catálogo</p>
    </header>

    <div class="card shadow-sm mb-4">
      <div class="card-header d-flex align-items-center gap-2">
        <i class="bi" :class="editMode ? 'bi-pencil-square' : 'bi-plus-circle'" style="color: var(--kei-beige);"></i>
        <h3 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">{{ editMode ? 'Editar categoría' : 'Crear categoría' }}</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitCategory" class="d-flex flex-column gap-3">
          <div>
            <label for="cat-nombre" class="form-label">Nombre</label>
            <input id="cat-nombre" v-model="form.nombre" type="text" placeholder="Nombre de la categoría" required class="form-control" />
          </div>
          <div>
            <label for="cat-desc" class="form-label">Descripción</label>
            <textarea id="cat-desc" v-model="form.descripcion" placeholder="Descripción opcional" rows="3" class="form-control"></textarea>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary rounded-pill" :disabled="loadingForm">
              <span v-if="loadingForm" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else :class="editMode ? 'bi bi-check-lg me-2' : 'bi bi-plus-lg me-2'"></i>{{ editMode ? 'Guardar cambios' : 'Crear categoría' }}
            </button>
            <button v-if="editMode" type="button" class="btn btn-outline-secondary rounded-pill" @click="cancelEdit">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
          </div>
        </form>
        <div v-if="formError" class="alert alert-danger d-flex align-items-center gap-2 mt-3 py-2" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>{{ formError }}</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 200px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando categorías...</p>
    </div>

    <div v-else class="card shadow-sm overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-3">ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th class="pe-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ cat.id }}</span></td>
              <td class="fw-medium" style="color: var(--kei-casi-negro);">{{ cat.nombre }}</td>
              <td style="color: var(--kei-gris-medio);">{{ cat.descripcion || '-' }}</td>
              <td class="pe-3">
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-primary btn-sm rounded-pill" @click="startEdit(cat)">
                    <i class="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button class="btn btn-outline-secondary btn-sm rounded-pill" @click="confirmDelete(cat)" :disabled="deletingId === cat.id">
                    <span v-if="deletingId === cat.id" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-trash me-1"></i>Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="categories.length === 0" class="text-center py-5">
        <i class="bi bi-tag fs-1 mb-2 d-block" style="color: var(--kei-beige-medio);"></i>
        <p class="mb-0" style="color: var(--kei-gris-medio);">No hay categorías registradas.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const categories = ref([])
const loading = ref(true)
const loadingForm = ref(false)
const deletingId = ref(null)
const formError = ref('')
const editMode = ref(false)
const editId = ref(null)
const form = ref({ nombre: '', descripcion: '' })

async function loadCategories() {
  loading.value = true
  try {
    const result = await getCategories()
    categories.value = result.data
  } catch (err) {
    console.error('Error cargando categorías:', err)
  } finally {
    loading.value = false
  }
}

function startEdit(cat) {
  editMode.value = true
  editId.value = cat.id
  form.value = { nombre: cat.nombre, descripcion: cat.descripcion || '' }
  formError.value = ''
}

function cancelEdit() {
  editMode.value = false
  editId.value = null
  form.value = { nombre: '', descripcion: '' }
  formError.value = ''
}

async function submitCategory() {
  loadingForm.value = true
  formError.value = ''
  try {
    if (editMode.value) {
      await updateCategory(editId.value, form.value)
    } else {
      await createCategory(form.value)
    }
    await loadCategories()
    cancelEdit()
  } catch (err) {
    formError.value = err.response?.data?.message || err.message || 'Error al guardar categoría'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(cat) {
  if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return
  deletingId.value = cat.id
  try {
    await deleteCategory(cat.id)
    await loadCategories()
  } catch (err) {
    alert(err.response?.data?.message || err.message || 'No se pudo eliminar la categoría.')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  loadCategories()
})
</script>

<style scoped>
</style>
