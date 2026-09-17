<template>
  <div class="container py-4">
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/admin">Panel Admin</router-link></li>
        <li class="breadcrumb-item"><router-link to="/admin/productos">Productos</router-link></li>
        <li class="breadcrumb-item active">Crear producto</li>
      </ol>
    </nav>
    <header class="text-center mb-4">
      <h1 class="fw-bold font-display" style="color: var(--kei-casi-negro);"><i class="bi bi-plus-circle me-2" style="color: var(--kei-oliva);"></i>Crear Producto</h1>
      <p style="color: var(--kei-gris-medio);">Nuevo producto con imagen ImageKit</p>
    </header>
    <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2"><i class="bi bi-exclamation-triangle-fill"></i><div>{{ error }}</div></div>
    <div v-if="exito" class="alert alert-primary d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill"></i><div>{{ exito }}</div></div>
    <section class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="crear()">
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-6"><label class="form-label">Nombre *</label><input v-model="form.nombre" required class="form-control" /></div>
            <div class="col-12 col-md-6"><label class="form-label">Precio (Q) *</label><div class="input-group"><span class="input-group-text" style="background: var(--kei-oliva-suave);">Q</span><input v-model="form.precio" type="number" step="0.01" required class="form-control" /></div></div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-6"><label class="form-label">Stock *</label><input v-model="form.stock" type="number" required class="form-control" /></div>
            <div class="col-12 col-md-6"><label class="form-label">Tamaño</label><input v-model="form.tamano" placeholder="250ml" class="form-control" /></div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-6">
              <label class="form-label">Marca *</label>
              <select v-model="form.marca_id" :required="!usarMarcaNueva" :disabled="usarMarcaNueva" class="form-select"><option value="">Selecciona marca</option><option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option></select>
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="checkNuevaMarca" v-model="usarMarcaNueva" />
                <label class="form-check-label small" for="checkNuevaMarca" style="color: var(--kei-oliva);">Usar marca no listada</label>
              </div>
              <div v-if="usarMarcaNueva" class="mt-2">
                <input v-model="nuevaMarcaNombre" placeholder="Nombre de la nueva marca" required class="form-control form-control-sm" />
                <small style="color: var(--kei-beige-medio);">Se creará la marca al crear el producto</small>
              </div>
            </div>
            <div class="col-12 col-md-6"><label class="form-label">Categoría *</label><select v-model="form.categoria_id" required class="form-select"><option value="">Selecciona categoría</option><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
          </div>
          <div class="mb-3"><label class="form-label">Descripción</label><textarea v-model="form.descripcion" rows="2" class="form-control"></textarea></div>
          <div class="mb-3"><label class="form-label">Ingredientes clave</label><textarea v-model="form.ingredientes_clave" rows="2" class="form-control"></textarea></div>
          <div class="mb-3"><label class="form-label">Tipo de piel</label><input v-model="form.tipo_piel" class="form-control" /></div>
          <div class="mb-3"><label class="form-label">URL de imagen (opcional)</label><input v-model="form.imagen_url" placeholder="https://..." class="form-control" @input="onUrlInput" /></div>
          <div class="mb-3">
            <label class="form-label">Archivo de imagen (ImageKit) <span class="small text-muted">— JPG/PNG/WebP</span></label>
            <input type="file" @change="onFile" accept="image/jpeg,image/png,image/gif,image/webp" class="form-control" />
          </div>
          <!-- Preview -->
          <div v-if="preview" class="mb-3 p-3 rounded d-flex align-items-center gap-3" style="background: var(--kei-oliva-suave); border: 1px solid var(--kei-oliva-claro);">
            <img :src="preview" alt="preview" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" @error="previewError = true" />
            <div>
              <strong style="color: var(--kei-casi-negro);">Vista previa</strong><br>
              <small style="color: var(--kei-gris-medio);">{{ previewOrigen }}</small><br>
              <button type="button" @click="limpiarPreview" class="btn btn-outline-secondary btn-sm rounded-pill mt-2">Quitar</button>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" :disabled="guardando" class="btn btn-primary rounded-pill px-4"><span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span><i class="bi bi-plus-lg me-1"></i>Crear producto</button>
            <router-link to="/admin/productos" class="btn btn-outline-secondary rounded-pill">Cancelar</router-link>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getCategories, getMarcas, createProduct, createMarca } from '../services/api'
const router = useRouter()
const authStore = useAuthStore()
const marcas = ref([]); const categorias = ref([]); const error = ref(''); const exito = ref(''); const guardando = ref(false)
const form = ref({ nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' })
const usarMarcaNueva = ref(false); const nuevaMarcaNombre = ref('')
const archivo = ref(null); const preview = ref(''); const previewOrigen = ref(''); const previewError = ref(false)
function onFile(e){
  const f = e.target.files && e.target.files[0]
  if(!f){ archivo.value=null; updatePreview(); return }
  archivo.value = f; previewOrigen.value = `Archivo: ${f.name}`; preview.value = URL.createObjectURL(f); error.value=''
}
function onUrlInput(){ if(archivo.value) return; updatePreview() }
function updatePreview(){
  if(archivo.value){ preview.value = URL.createObjectURL(archivo.value); previewOrigen.value=`Archivo: ${archivo.value.name}`; return }
  if(form.value.imagen_url){ preview.value = form.value.imagen_url; previewOrigen.value='URL externa' } else { preview.value=''; previewOrigen.value='' }
}
function limpiarPreview(){ archivo.value=null; form.value.imagen_url=''; preview.value=''; previewOrigen.value=''; const inp=document.querySelector('input[type="file"]'); if(inp) inp.value='' }
async function crear(){
  error.value=''; exito.value=''; guardando.value=true
  try{
    let marcaId = form.value.marca_id
    if(usarMarcaNueva.value){
      if(!nuevaMarcaNombre.value.trim()) throw new Error('Debes escribir el nombre de la nueva marca')
      const r = await createMarca({ nombre: nuevaMarcaNombre.value.trim() })
      marcaId = r.data.id
      exito.value = `Marca "${nuevaMarcaNombre.value}" creada. `
    }
    const fd = new FormData()
    for(const k in form.value){
      if(k==='marca_id') continue
      if(form.value[k]!=='' && form.value[k]!==null) fd.append(k, form.value[k])
    }
    fd.append('marca_id', marcaId)
    if(archivo.value) fd.append('archivo', archivo.value)
    const res = await createProduct(fd)
    exito.value = (exito.value || '') + (res.message || 'Producto creado')
    setTimeout(()=> router.push('/admin/productos'), 900)
  }catch(err){ error.value = err.response?.data?.message || err.message || 'Error al crear' } finally { guardando.value=false }
}
onMounted(async ()=>{
  if(!authStore.isAdmin) { router.push('/'); return }
  const [c,m] = await Promise.all([getCategories(), getMarcas()]); categorias.value = c.data||[]; marcas.value = m.data||[]
})
</script>
