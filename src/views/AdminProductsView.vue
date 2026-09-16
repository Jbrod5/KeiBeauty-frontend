<template>
  <div class="admin-products-view">
    <header class="admin-header">
      <h1>Gestión de Productos</h1>
      <p class="admin-subtitle">Administra productos, inventario e imágenes</p>
    </header>
    <div v-if="loading" class="loading-state"><p>Cargando...</p></div>
    <div v-else-if="error" class="error-state"><p>{{ error }}</p><button class="btn btn-primary" @click="loadProducts">Reintentar</button></div>
    <div v-else>
      <div style="text-align:center;margin-bottom:1rem;">
        <label>Estado:</label>
        <select v-model="filtroEstado" @change="loadProducts" class="status-select" style="margin-left:0.5rem;">
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="agotado">Agotado</option>
        </select>
      </div>
      <section style="background:white;padding:1.5rem;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:2rem;">
        <h2>{{ editMode ? 'Editar Producto' : 'Crear Producto' }}</h2>
        <form @submit.prevent="saveProduct()">
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
            <input v-model="form.nombre" placeholder="Nombre" required style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;" />
            <input v-model="form.precio" placeholder="Precio" type="number" step="0.01" required style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;" />
          </div>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
            <input v-model="form.stock" placeholder="Stock" type="number" required style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;" />
            <input v-model="form.tamano" placeholder="Tamaño (ej. 250ml)" style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;" />
          </div>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
            <select v-model="form.marca_id" required style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;">
              <option value="">Marca</option>
              <option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option>
            </select>
            <select v-model="form.categoria_id" required style="flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;min-width:200px;">
              <option value="">Categoría</option>
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </div>
          <textarea v-model="form.descripcion" placeholder="Descripción" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;"></textarea>
          <textarea v-model="form.ingredientes_clave" placeholder="Ingredientes clave" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;"></textarea>
          <input v-model="form.tipo_piel" placeholder="Tipo de piel" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;" />
          <input v-model="form.imagen_url" placeholder="URL de imagen (opcional)" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;margin-bottom:0.5rem;" />
          <input type="file" @change="handleImage($event)" accept="image/*" style="margin-bottom:0.5rem;" />
          <div style="margin-top:0.5rem;">
            <button type="submit" class="btn btn-primary">{{ editMode ? 'Guardar cambios' : 'Crear producto' }}</button>
            <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline" style="margin-left:0.5rem;">Cancelar</button>
          </div>
        </form>
      </section>
      <section style="background:white;padding:1.5rem;border-radius:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8f9fa;">
              <th style="padding:1rem;text-align:left;">ID</th>
              <th style="padding:1rem;text-align:left;">Nombre</th>
              <th style="padding:1rem;text-align:left;">Precio</th>
              <th style="padding:1rem;text-align:left;">Stock</th>
              <th style="padding:1rem;text-align:left;">Estado</th>
              <th style="padding:1rem;text-align:left;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id" style="border-bottom:1px solid #eee;">
              <td style="padding:1rem;"><strong>#{{ p.id }}</strong></td>
              <td style="padding:1rem;">{{ p.nombre }}</td>
              <td style="padding:1rem;">{{ formatPrice(p.precio) }}</td>
              <td style="padding:1rem;">{{ p.stock }}</td>
              <td style="padding:1rem;"><span :class="'status-' + p.estado" style="padding:0.375rem 0.875rem;border-radius:50px;font-size:0.75rem;font-weight:600;text-transform:uppercase;display:inline-block;background:#fff3e0;color:#e65100;">{{ p.estado }}</span></td>
              <td style="padding:1rem;">
                <button @click="editProduct(p)" class="btn btn-sm btn-outline" style="font-size:0.75rem;">Editar</button>
                <button @click="eliminarProducto(p.id)" class="btn btn-sm btn-outline" style="font-size:0.75rem;margin-left:0.25rem;">Eliminar</button>
                <button @click="mostrarAjuste(p.id)" class="btn btn-sm btn-outline" style="font-size:0.75rem;margin-top:0.25rem;">Ajustar inventario</button>
                <div v-if="ajusteActivo === p.id" style="margin-top:0.5rem;padding:0.5rem;border:1px solid #ddd;border-radius:0.5rem;background:#fafafa;display:inline-block;">
                  <select v-model="ajusteTipo" style="font-size:0.75rem;padding:0.2rem;margin-right:0.25rem;">
                    <option value="">Tipo</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                  </select>
                  <input v-model="ajusteCantidad" type="number" style="font-size:0.75rem;width:60px;padding:0.2rem;" placeholder="Cant" />
                  <button @click="confirmaAjuste(p.id)" class="btn btn-sm btn-outline" style="font-size:0.75rem;margin-left:0.25rem;">Confirmar</button>
                  <button @click="cancelarAjuste()" class="btn btn-sm btn-outline" style="font-size:0.75rem;margin-left:0.25rem;">Cancelar</button>
                </div>
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
function formatPrice(price) { return new Intl.NumberFormat('es-GT', { style:'currency', currency:'GTQ', minimumFractionDigits:2 }).format(price) }
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
function handleImage(event) {}
async function saveProduct() {
  try {
    if (editMode.value) {
      await updateProduct(editMode.value.id, form.value)
      editMode.value = false
    } else {
      const formData = new FormData()
      for (const k in form.value) {
        if (form.value[k] !== null && form.value[k] !== undefined && form.value[k] !== '') { formData.append(k, form.value[k]) }
      }
      const archivoInput = document.querySelector('input[type="file"]')
      if (archivoInput && archivoInput.files[0]) { formData.append('archivo', archivoInput.files[0]) }
      const res = await createProduct(formData)
      if (res && res.data) {
        form.value = { nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' }
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
.admin-products-view { max-width:1200px; margin:0 auto; padding:1rem; }
.admin-header { text-align:center; margin-bottom:2rem; }
.admin-header h1 { font-size:2.5rem; color:#2c3e50; }
.form-section { background:white; padding:1.5rem; border-radius:1rem; box-shadow:0 2px 8px rgba(0,0,0,0.05); margin-bottom:2rem; }
.form-row { display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
.form-row input, .form-row select, .form-row textarea { flex:1; padding:0.5rem; border:1px solid #ddd; border-radius:0.5rem; min-width:200px; }
.product-form button { margin-top:0.5rem; }
.table-section { background:white; padding:1.5rem; border-radius:1rem; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
.status-activo { background:#e8f5e9; color:#2e7d32; }
.status-inactivo { background:#fff3e0; color:#e65100; }
.status-agotado { background:#fce4ec; color:#c62828; }
</style>
