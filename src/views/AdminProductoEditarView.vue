<template>
  <div class="container py-4">
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/admin">Panel Admin</router-link></li>
        <li class="breadcrumb-item"><router-link to="/admin/productos">Productos</router-link></li>
        <li class="breadcrumb-item active">Editar #{{ id }}</li>
      </ol>
    </nav>
    <header class="text-center mb-3">
      <span class="badge rounded-pill mb-2" style="background: var(--kei-oliva);"><i class="bi bi-pencil-square me-1"></i>Modo edición</span>
      <h1 class="fw-bold font-display" style="color: var(--kei-casi-negro);">Editar Producto</h1>
      <p v-if="original" style="color: var(--kei-gris-medio);">Editando: <strong style="color: var(--kei-casi-negro);">{{ original.nombre }}</strong></p>
    </header>
    <div v-if="cargando" class="text-center py-5"><div class="spinner-border"></div><p style="color: var(--kei-gris-medio);">Cargando producto...</p></div>
    <div v-else>
      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2"><i class="bi bi-exclamation-triangle-fill"></i><div>{{ error }}</div></div>
      <div v-if="exito" class="alert alert-primary d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill"></i><div>{{ exito }}</div></div>
      <section class="card shadow-sm">
        <div class="card-header" style="background: var(--kei-oliva-suave); border-color: var(--kei-oliva-claro);">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-pencil me-1"></i>Producto #{{ id }}</strong>
        </div>
        <div class="card-body">
          <form @submit.prevent="guardar()">
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6"><label class="form-label">Nombre *</label><input v-model="form.nombre" required class="form-control" /></div>
              <div class="col-12 col-md-6"><label class="form-label">Precio (Q) *</label><div class="input-group"><span class="input-group-text" style="background: var(--kei-oliva-suave);">Q</span><input v-model="form.precio" type="number" step="0.01" required class="form-control" /></div></div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6"><label class="form-label">Stock *</label><input v-model="form.stock" type="number" required class="form-control" /></div>
              <div class="col-12 col-md-6"><label class="form-label">Tamaño</label><input v-model="form.tamano" class="form-control" /></div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-12 col-md-6"><label class="form-label">Marca *</label><select v-model="form.marca_id" required class="form-select"><option value="">Selecciona marca</option><option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option></select></div>
              <div class="col-12 col-md-6"><label class="form-label">Categoría *</label><select v-model="form.categoria_id" required class="form-select"><option value="">Selecciona categoría</option><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
            </div>
            <div class="mb-3"><label class="form-label">Descripción</label><textarea v-model="form.descripcion" rows="2" class="form-control"></textarea></div>
            <div class="mb-3"><label class="form-label">Ingredientes clave</label><textarea v-model="form.ingredientes_clave" rows="2" class="form-control"></textarea></div>
            <div class="mb-3"><label class="form-label">Tipo de piel</label><input v-model="form.tipo_piel" class="form-control" /></div>
            <div class="mb-3"><label class="form-label">URL de imagen</label><input v-model="form.imagen_url" class="form-control" @input="onUrlInput" /></div>
            <div class="mb-3"><label class="form-label">Archivo nuevo (ImageKit)</label><input type="file" @change="onFile" accept="image/jpeg,image/png,image/gif,image/webp" class="form-control" /></div>
            <!-- Preview actual + nuevo -->
            <div class="mb-3 p-3 rounded" style="background: var(--kei-oliva-suave); border: 1px solid var(--kei-oliva-claro);">
              <small class="fw-semibold" style="color: var(--kei-casi-negro);">Vista previa de imagen</small>
              <div class="d-flex align-items-center gap-3 mt-2">
                <img v-if="preview" :src="preview" alt="preview" style="width:120px;height:120px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" @error="previewError=true" />
                <span v-else class="small" style="color: var(--kei-gris-medio);">Sin imagen</span>
                <div>
                  <div class="small" style="color: var(--kei-gris-medio);">{{ previewOrigen }}</div>
                  <button v-if="archivo" type="button" @click="limpiarArchivo" class="btn btn-outline-secondary btn-sm rounded-pill mt-1">Quitar archivo</button>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" :disabled="guardando" class="btn btn-primary rounded-pill px-4"><span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span><i class="bi bi-check-lg me-1"></i>Guardar cambios</button>
              <router-link to="/admin/productos" class="btn btn-outline-secondary rounded-pill">Volver</router-link>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getProductById, getCategories, getMarcas, updateProduct, uploadProductImage } from '../services/api'
const route = useRoute(); const router = useRouter(); const authStore = useAuthStore()
const id = route.params.id
const marcas=ref([]); const categorias=ref([]); const error=ref(''); const exito=ref(''); const cargando=ref(true); const guardando=ref(false)
const original=ref(null)
const form=ref({ nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' })
const archivo=ref(null); const preview=ref(''); const previewOrigen=ref('')
function onFile(e){ const f=e.target.files&&e.target.files[0]; if(!f){archivo.value=null; updatePreview(); return} archivo.value=f; preview.value=URL.createObjectURL(f); previewOrigen.value=`Archivo nuevo: ${f.name}` }
function onUrlInput(){ if(archivo.value) return; updatePreview() }
function updatePreview(){ if(archivo.value){ preview.value=URL.createObjectURL(archivo.value); previewOrigen.value=`Archivo: ${archivo.value.name}`; return } if(form.value.imagen_url){ preview.value=form.value.imagen_url; previewOrigen.value='URL actual' } else { preview.value=''; previewOrigen.value='Sin imagen' } }
function limpiarArchivo(){ archivo.value=null; const inp=document.querySelector('input[type="file"]'); if(inp) inp.value=''; updatePreview() }
async function guardar(){
  error.value=''; exito.value=''; guardando.value=true
  try{
    if(archivo.value){ await uploadProductImage(id, archivo.value); exito.value='Imagen actualizada'; setTimeout(()=> router.push('/admin/productos'), 800); return }
    await updateProduct(id, form.value); exito.value='Producto actualizado'; setTimeout(()=> router.push('/admin/productos'), 800)
  }catch(err){ error.value = err.response?.data?.message || 'Error al actualizar' } finally { guardando.value=false }
}
onMounted(async ()=>{
  if(!authStore.isAdmin){ router.push('/'); return }
  try{
    const [prod, c, m] = await Promise.all([getProductById(id), getCategories(), getMarcas()])
    original.value = prod; form.value = { nombre: prod.nombre, precio: prod.precio, stock: prod.stock, marca_id: prod.marca_id, categoria_id: prod.categoria_id, descripcion: prod.descripcion||'', ingredientes_clave: prod.ingredientes_clave||'', tipo_piel: prod.tipo_piel||'', imagen_url: prod.imagen_url||'', tamano: prod.tamano||'' }
    categorias.value = c.data||[]; marcas.value = m.data||[]; updatePreview()
  }catch(e){ error.value = e.response?.data?.message || 'No se pudo cargar producto' } finally { cargando.value=false }
})
</script>
