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
      <p style="color: var(--kei-gris-medio);">Nuevo producto con galería ImageKit (múltiples imágenes)</p>
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

          <div class="mb-3"><label class="form-label">URL de imagen (opcional, solo si no subes archivos)</label><input v-model="form.imagen_url" placeholder="https://..." class="form-control" @input="onUrlInput" /></div>
          <div class="mb-3">
            <label class="form-label">Galería de imágenes (ImageKit) <span class="small text-muted">— selecciona múltiples JPG/PNG/WebP</span></label>
            <input type="file" @change="onFiles" multiple accept="image/jpeg,image/png,image/gif,image/webp" class="form-control" />
            <small style="color: var(--kei-gris-medio);">Puedes seleccionar varias imágenes. Marca una con <i class="bi bi-star-fill" style="color:#FFD700;"></i> como principal (se muestra en catálogo).</small>
          </div>
          <!-- Previews múltiples con estrella amarilla -->
          <div v-if="galeria.length > 0" class="mb-3 p-3 rounded" style="background: var(--kei-oliva-suave); border: 1px solid var(--kei-oliva-claro);">
            <div class="d-flex align-items-center gap-2 mb-2">
              <strong style="color: var(--kei-casi-negro);"><i class="bi bi-images me-1"></i>Galería seleccionada ({{ galeria.length }})</strong>
              <small style="color: var(--kei-gris-medio);">— clic en <i class="bi bi-star"></i> para marcar principal (amarillo)</small>
            </div>
            <div class="row g-3">
              <div v-for="(item, idx) in galeria" :key="idx" class="col-6 col-md-4 col-lg-3">
                <div class="card overflow-hidden" :style="item.es_principal ? 'border:2px solid #FFD700 !important;' : 'border:1px solid var(--kei-gris-claro);'">
                  <div class="position-relative" style="aspect-ratio:1; background:#fff;">
                    <img :src="item.url" alt="preview" class="w-100 h-100" style="object-fit:cover;" />
                    <button type="button" @click="marcarPrincipal(idx)" class="btn btn-sm rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center" :style="item.es_principal ? 'background:#FFD700; color:#fff; border:none; width:28px;height:28px;' : 'background:rgba(255,255,255,0.9); color:#999; border:1px solid #ddd; width:28px;height:28px;'" :title="item.es_principal ? 'Principal' : 'Marcar como principal'">
                      <i :class="item.es_principal ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                    </button>
                    <span v-if="item.es_principal" class="badge position-absolute bottom-0 start-0 m-1" style="background:#FFD700; color:#000; font-size:0.6rem;"><i class="bi bi-star-fill me-1"></i>Principal</span>
                  </div>
                  <div class="p-2 d-flex justify-content-between align-items-center">
                    <small class="text-truncate" style="color: var(--kei-gris-medio); max-width:80px;">{{ item.file ? item.file.name : 'URL' }}</small>
                    <button type="button" @click="quitarGaleria(idx)" class="btn btn-outline-secondary btn-sm rounded-pill" style="padding:2px 8px;"><i class="bi bi-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Preview URL simple si solo hay URL -->
            <div v-if="galeria.length===0 && preview" class="mt-2 d-flex align-items-center gap-3">
              <img :src="preview" alt="preview" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" />
              <div><strong style="color: var(--kei-casi-negro);">Vista previa URL</strong><br><small style="color: var(--kei-gris-medio);">{{ previewOrigen }}</small><br><button type="button" @click="limpiarPreview" class="btn btn-outline-secondary btn-sm rounded-pill mt-2">Quitar</button></div>
            </div>
          </div>
          <div v-else-if="preview" class="mb-3 p-3 rounded d-flex align-items-center gap-3" style="background: var(--kei-oliva-suave); border: 1px solid var(--kei-oliva-claro);">
            <img :src="preview" alt="preview" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" />
            <div><strong style="color: var(--kei-casi-negro);">Vista previa</strong><br><small style="color: var(--kei-gris-medio);">{{ previewOrigen }}</small><br><button type="button" @click="limpiarPreview" class="btn btn-outline-secondary btn-sm rounded-pill mt-2">Quitar</button></div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getCategories, getMarcas, createProduct, createMarca, subirImagenesGaleria, marcarImagenPrincipal } from '../services/api'
const router = useRouter()
const authStore = useAuthStore()
const marcas = ref([]); const categorias = ref([]); const error = ref(''); const exito = ref(''); const guardando = ref(false)
const form = ref({ nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', imagen_url:'', tamano:'' })
const usarMarcaNueva = ref(false); const nuevaMarcaNombre = ref('')
const galeria = ref([]) // { file, url, es_principal }
const preview = ref(''); const previewOrigen = ref('')

function onFiles(e){
  const files = Array.from(e.target.files || [])
  if(files.length===0) return
  files.forEach((f, i) => {
    const url = URL.createObjectURL(f)
    const es_principal = galeria.value.length===0 && i===0 // primera es principal por defecto
    galeria.value.push({ file: f, url, es_principal })
  })
  // Si se usó URL previa, limpiarla
  if(galeria.value.length>0){ preview.value=''; form.value.imagen_url='' }
}

function marcarPrincipal(idx){
  galeria.value.forEach((item, i) => item.es_principal = i===idx)
}

function quitarGaleria(idx){
  const eraPrincipal = galeria.value[idx].es_principal
  galeria.value.splice(idx,1)
  if(eraPrincipal && galeria.value.length>0) galeria.value[0].es_principal = true
}

function onUrlInput(){
  if(galeria.value.length>0) return
  if(form.value.imagen_url){ preview.value = form.value.imagen_url; previewOrigen.value='URL externa' } else { preview.value=''; }
}
function limpiarPreview(){ form.value.imagen_url=''; preview.value=''; previewOrigen.value='' }

async function crear(){
  error.value=''; exito.value=''; guardando.value=true
  try{
    let marcaId = form.value.marca_id
    if(usarMarcaNueva.value){
      if(!nuevaMarcaNombre.value.trim()) throw new Error('Debes escribir el nombre de la nueva marca')
      const r = await createMarca({ nombre: nuevaMarcaNombre.value.trim() })
      marcaId = r.data.id
      exito.value = `Marca "${nuevaMarcaNombre.value}" creada. `
      // refrescar lista
      const m = await getMarcas(); marcas.value = m.data||[]
    }
    // Crear producto sin imagen si hay galería múltiple, luego subir galería
    const fd = new FormData()
    for(const k in form.value){
      if(k==='marca_id') continue
      if(k==='imagen_url' && galeria.value.length>0) continue // ignorar URL si hay archivos
      if(form.value[k]!=='' && form.value[k]!==null) fd.append(k, form.value[k])
    }
    fd.append('marca_id', marcaId)
    // Si solo hay 1 imagen y no hay galería múltiple, usar archivo único como antes (compatibilidad)
    // Pero con galería múltiple, creamos producto sin archivo y luego subimos
    let productoId = null
    let imagenUrlUnica = form.value.imagen_url
    if(galeria.value.length===0 && !imagenUrlUnica){
      // sin imágenes, crear solo producto
      const res = await createProduct(fd)
      productoId = res.data.id
      exito.value = (exito.value||'') + (res.message || 'Producto creado')
    } else if(galeria.value.length===0 && imagenUrlUnica){
      fd.append('imagen_url', imagenUrlUnica)
      const res = await createProduct(fd)
      productoId = res.data.id
      exito.value = (exito.value||'') + (res.message || 'Producto creado')
    } else if(galeria.value.length>0){
      // Crear producto sin imagen principal aún
      const res = await createProduct(fd)
      productoId = res.data.id
      // Subir galería
      const archivos = galeria.value.map(g => g.file)
      const r2 = await subirImagenesGaleria(productoId, archivos)
      // Marcar principal si no es la primera (backend marca primera como principal por defecto)
      const principalIdx = galeria.value.findIndex(g => g.es_principal)
      if(principalIdx > 0 && r2.data && r2.data.length > principalIdx){
        const idPrincipal = r2.data[principalIdx].id
        await marcarImagenPrincipal(productoId, idPrincipal)
      }
      exito.value = (exito.value||'') + ` Producto creado con ${galeria.value.length} imágenes`
    }
    setTimeout(()=> router.push('/admin/productos'), 900)
  }catch(err){ error.value = err.response?.data?.message || err.message || 'Error al crear' } finally { guardando.value=false }
}
onMounted(async ()=>{
  if(!authStore.isAdmin) { router.push('/'); return }
  const [c,m] = await Promise.all([getCategories(), getMarcas()]); categorias.value = c.data||[]; marcas.value = m.data||[]
})
</script>
