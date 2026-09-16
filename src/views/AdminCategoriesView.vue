<template>
  <div class="admin-categories-view">
    <header class="admin-header">
      <h1>Gestión de Categorías</h1>
      <p class="admin-subtitle">Administra las categorías del catálogo</p>
    </header>

    <div class="admin-form">
      <h3>{{ editMode ? 'Editar categoría' : 'Crear categoría' }}</h3>
      <form @submit.prevent="submitCategory" class="category-form">
        <div class="form-group">
          <label for="cat-nombre">Nombre</label>
          <input id="cat-nombre" v-model="form.nombre" type="text" placeholder="Nombre de la categoría" required />
        </div>
        <div class="form-group">
          <label for="cat-desc">Descripción</label>
          <textarea id="cat-desc" v-model="form.descripcion" placeholder="Descripción opcional" rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loadingForm">{{ editMode ? 'Guardar cambios' : 'Crear categoría' }}</button>
          <button v-if="editMode" type="button" class="btn btn-outline" @click="cancelEdit">Cancelar</button>
        </div>
      </form>
      <div v-if="formError" class="form-error">{{ formError }}</div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando categorías...</p>
    </div>

    <div v-else class="table-container">
      <table class="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>#{{ cat.id }}</td>
            <td>{{ cat.nombre }}</td>
            <td>{{ cat.descripcion || '-' }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click="startEdit(cat)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="confirmDelete(cat)" :disabled="deletingId === cat.id">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && categories.length === 0" class="empty-state">
      <p>No hay categorías registradas.</p>
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
.admin-categories-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
.admin-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
}
.admin-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.admin-subtitle {
  color: #666;
  font-size: 1.1rem;
}
.admin-form {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}
.category-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}
.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e91e63;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.15);
}
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.form-error {
  color: #c62828;
  background: #fdeaea;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}
.categories-table {
  width: 100%;
  border-collapse: collapse;
}
.categories-table th,
.categories-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.categories-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.categories-table tr:hover td {
  background: #fafafa;
}
.action-buttons {
  display: flex;
  gap: 0.5rem;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}
.btn-primary {
  background: #e91e63;
  color: white;
}
.btn-primary:hover:not(:disabled) {
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
.btn-danger {
  background: #c62828;
  color: white;
}
.btn-danger:hover:not(:disabled) {
  background: #b71c1c;
}
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}
.loading-state,
.empty-state {
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
</style>
