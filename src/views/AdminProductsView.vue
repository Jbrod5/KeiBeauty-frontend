<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Gestión de Productos</h1>
      <p style="color: var(--kei-gris-medio);">Administra productos, inventario e imágenes</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando...</p>
    </div>

    <div v-else-if="error && products.length === 0" class="alert alert-danger d-flex flex-column align-items-center text-center gap-3" role="alert">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ error }}</span>
      </div>
      <button class="btn btn-primary btn-sm rounded-pill" @click="loadProducts">Reintentar</button>
    </div>

    <div v-else>
      <!-- Filtro estado -->
      <div class="card shadow-sm mb-4">
        <div class="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
          <label class="form-label mb-0 fw-medium d-inline-flex align-items-center gap-2" style="color: var(--kei-casi-negro);">
            <i class="bi bi-funnel" style="color: var(--kei-beige);"></i>Estado:
          </label>
          <select v-model="filtroEstado" @change="loadProducts" class="form-select w-auto" style="min-width: 200px;">
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <div>{{ error }}</div>
      </div>

      <!-- Form -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="bi" :class="editMode ? 'bi-pencil-square' : 'bi-plus-circle'" style="color: var(--kei-beige);"></i>
          <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">{{ editMode ? 'Editar Producto' : 'Crear Producto' }}</h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveProduct()">
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="form.nombre" placeholder="Nombre" required class="form-control" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Precio</label>
                <div class="input-group">
                  <span class="input-group-text" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">Q</span>
                  <input v-model="form.precio" placeholder="0.00" type="number" step="0.01" required class="form-control" />
                </div>
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Stock</label>
                <input v-model="form.stock" placeholder="Stock" type="number" required class="form-control" />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Tamaño</label>
                <input v-model="form.tamano" placeholder="Tamaño (ej. 250ml)" class="form-control" />
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6">
                <label class="form-label">Marca</label>
                <select v-model="form.marca_id" required class="form-select">
                  <option value="">Selecciona marca</option>
                  <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">Categoría</label>
                <select v-model="form.categoria_id" required class="form-select">
                  <option value="">Selecciona categoría</option>
                  <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" placeholder="Descripción" rows="2" class="form-control"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Ingredientes clave</label>
              <textarea v-model="form.ingredientes_clave" placeholder="Ingredientes clave" rows="2" class="form-control"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo de piel</label>
              <input v-model="form.tipo_piel" placeholder="Tipo de piel" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">URL de imagen (opcional, se ignora si subes archivo)</label>
              <input v-model="form.imagen_url" placeholder="https://..." class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Archivo de imagen (ImageKit) <span class="small text-muted">— JPG/PNG/WebP</span></label>
              <input type="file" @change="handleImage($event)" accept="image/jpeg,image/png,image/gif,image/webp" class="form-control" />
              <div v-if="previewUrl" class="mt-2 d-flex align-items-center gap-2">
                <img :src="previewUrl" alt="preview" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" />
                <small style="color: var(--kei-gris-medio);">Vista previa</small>
                <button type="button" @click="clearImage" class="btn btn-outline-secondary btn-sm rounded-pill">Quitar</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary rounded-pill">
                <i :class="editMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-2"></i>{{ editMode ? 'Guardar cambios' : 'Crear producto' }}
              </button>
              <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline-secondary rounded-pill">
                <i class="bi bi-x-lg me-1"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Tabla productos -->
      <section class="card shadow-sm overflow-hidden">
        <div class="card-header d-flex align-items-center justify-content-between">
          <span class="fw-bold d-inline-flex align-items-center gap-2" style="color: var(--kei-casi-negro);">
            <i class="bi bi-box-seam" style="color: var(--kei-beige);"></i>Productos ({{ products.length }})
          </span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-3">ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th class="pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ p.id }}</span></td>
                <td>
                  <router-link :to="`/producto/${p.id}`" class="text-decoration-none fw-medium d-inline-flex align-items-center gap-2" style="color: var(--kei-gris-oscuro);">
                    <i class="bi bi-box-seam small" style="color: var(--kei-beige);"></i>{{ p.nombre }}
                    <i class="bi bi-box-arrow-up-right small" style="color: var(--kei-beige-medio);"></i>
                  </router-link>
                </td>
                <td class="fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(p.precio) }}</td>
                <td>
                  <span class="badge rounded-pill" style="background-color: var(--kei-fondo); color: var(--kei-casi-negro); border: 1px solid var(--kei-gris-claro);">{{ p.stock }}</span>
                </td>
                <td>
                  <span class="badge rounded-pill text-uppercase px-2 py-1" :style="estadoBadgeStyle(p.estado)">{{ p.estado }}</span>
                </td>
                <td class="pe-3">
                  <div class="d-flex flex-wrap gap-1 align-items-center">
                    <button @click="editProduct(p)" class="btn btn-outline-primary btn-sm rounded-pill">
                      <i class="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button @click="eliminarProducto(p.id)" class="btn btn-outline-secondary btn-sm rounded-pill">
                      <i class="bi bi-trash me-1"></i>Eliminar
                    </button>
                    <button @click="mostrarAjuste(p.id)" class="btn btn-outline-secondary btn-sm rounded-pill">
                      <i class="bi bi-arrow-down-up me-1"></i>Ajustar
                    </button>
                  </div>
                  <div v-if="ajusteActivo === p.id" class="card mt-2 p-2 d-inline-flex flex-row flex-wrap align-items-center gap-2" style="background-color: var(--kei-fondo); border-color: var(--kei-gris-claro);">
                    <select v-model="ajusteTipo" class="form-select form-select-sm w-auto">
                      <option value="">Tipo</option>
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                    <input v-model="ajusteCantidad" type="number" class="form-control form-control-sm" style="width: 80px;" placeholder="Cant" />
                    <button @click="confirmaAjuste(p.id)" class="btn btn-primary btn-sm rounded-pill">Confirmar</button>
                    <button @click="cancelarAjuste()" class="btn btn-outline-secondary btn-sm rounded-pill">Cancelar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getProducts, getCategories, getMarcas, createProduct, updateProduct, deleteProduct, uploadProductImage, ajustarInventario } from '../services/api'
const router = useRouter()
const authStore = useAuthStore()
const products = ref([])
const marcas = ref([])
const categorias = ref([])
const loading = ref(true)
const error = ref('')
const editMode = ref(false)
const filtroEstado = ref('')
const ajusteActivo = ref(null)
const ajusteTipo = ref('')
const ajusteCantidad = ref('')
const form = ref({ nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' })
const archivoImagen = ref(null)
const previewUrl = ref('')
function formatPrice(price) { return new Intl.NumberFormat('es-GT', { style:'currency', currency:'GTQ', minimumFractionDigits:2 }).format(price) }
function estadoBadgeStyle(estado) {
  if (estado === 'activo') return 'background-color: var(--kei-fondo); color: var(--kei-gris-oscuro); border: 1px solid var(--kei-beige-claro);'
  if (estado === 'inactivo') return 'background-color: var(--kei-beige-claro); color: var(--kei-casi-negro); border: 1px solid var(--kei-beige-medio);'
  if (estado === 'agotado') return 'background-color: #f8e8e8; color: #7a3a3a; border: 1px solid #e0c0c0;'
  return 'background-color: var(--kei-gris-claro); color: var(--kei-casi-negro);'
}
async function loadProducts() {
  loading.value = true; error.value = ''
  try {
    const params = filtroEstado.value ? { estado: filtroEstado.value } : {}
    const result = await getProducts(params)
    products.value = Array.isArray(result) ? result : (result?.data || [])
  } catch (err) { error.value = err.response?.data?.message || 'Error al cargar productos' }
  finally { loading.value = false }
}
async function loadMarcas() {
  try {
    const res = await getMarcas()
    marcas.value = res.data || []
  } catch (e) { console.error('Error marcas', e) }
}

async function loadCategories() {
  try { const res = await getCategories(); categorias.value = res.data || [] }
  catch (e) { console.error('Error categorías', e) }
}
function handleImage(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) { archivoImagen.value = null; previewUrl.value = ''; return }
  const permitidos = ['image/jpeg','image/png','image/gif','image/webp','image/jpg']
  if (!permitidos.includes(file.type)) { error.value = 'Tipo no permitido: usa JPG/PNG/WebP'; return }
  archivoImagen.value = file
  previewUrl.value = URL.createObjectURL(file)
  error.value = ''
}
function clearImage() {
  archivoImagen.value = null
  previewUrl.value = ''
  const inp = document.querySelector('input[type="file"]')
  if (inp) inp.value = ''
}
async function saveProduct() {
  try {
    if (editMode.value) {
      // Si hay archivo nuevo, subir via ImageKit endpoint dedicado
      if (archivoImagen.value) {
        await uploadProductImage(editMode.value.id, archivoImagen.value)
        await loadProducts()
        editMode.value = false
        form.value = { nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' }
        clearImage()
        return
      }
      await updateProduct(editMode.value.id, form.value)
      editMode.value = false
      form.value = { nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' }
      clearImage()
      await loadProducts()
    } else {
      const formData = new FormData()
      for (const k in form.value) {
        if (form.value[k] !== null && form.value[k] !== undefined && form.value[k] !== '') { formData.append(k, form.value[k]) }
      }
      if (archivoImagen.value) { formData.append('archivo', archivoImagen.value) }
      const res = await createProduct(formData)
      if (res && res.data) {
        form.value = { nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' }
        clearImage()
        await loadProducts()
      }
    }
  } catch (err) { error.value = err.response?.data?.message || 'Error al guardar producto' }
}
function editProduct(p) { editMode.value = p; form.value = { ...p } }
function cancelEdit() { editMode.value = false; form.value = { nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' } }
async function eliminarProducto(id) {
  if (!confirm('¿Eliminar producto?')) return
  try { await deleteProduct(id); await loadProducts() }
  catch (err) { error.value = err.response?.data?.message || 'Error al eliminar' }
}
function mostrarAjuste(id) { ajusteActivo.value = id; ajusteTipo.value = ''; ajusteCantidad.value = '' }
function cancelarAjuste() { ajusteActivo.value = null; ajusteTipo.value = ''; ajusteCantidad.value = '' }
async function confirmaAjuste(id) {
  const tipo = ajusteTipo.value
  const cantidad = parseInt(ajusteCantidad.value || '0')
  if (!tipo || cantidad <= 0) { error.value = 'Selecciona tipo y cantidad válida'; return }
  try { await ajustarInventario(id, tipo, cantidad); await loadProducts(); cancelarAjuste() }
  catch (err) { error.value = err.response?.data?.message || 'Error al ajustar inventario' }
}
onMounted(async () => {
  if (!authStore.isAdmin) { router.push('/'); return }
  await loadMarcas(); await loadCategories(); await loadProducts()
})
</script>
<style scoped>
</style>
