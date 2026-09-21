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
      <section class="card shadow-sm mb-4">
        <div class="card-header" style="background: var(--kei-oliva-suave); border-color: var(--kei-oliva-claro);">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-pencil me-1"></i>Datos del producto #{{ id }}</strong>
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
            <div class="d-flex gap-2">
              <button type="submit" :disabled="guardando" class="btn btn-primary rounded-pill px-4"><span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span><i class="bi bi-check-lg me-1"></i>Guardar cambios</button>
              <router-link to="/admin/productos" class="btn btn-outline-secondary rounded-pill">Volver</router-link>
            </div>
          </form>
        </div>
      </section>

      <!-- Galería -->
      <section class="card shadow-sm">
        <div class="card-header d-flex align-items-center justify-content-between">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-images me-2" style="color: var(--kei-oliva);"></i>Galería de imágenes</strong>
          <small style="color: var(--kei-gris-medio);">Una sola principal <i class="bi bi-star-fill" style="color:#FFD700;"></i></small>
        </div>
        <div class="card-body">
          <div v-if="galeria.length===0" class="text-center py-3">
            <i class="bi bi-image fs-2 d-block mb-2" style="color: var(--kei-beige-medio);"></i>
            <p style="color: var(--kei-gris-medio);">Sin imágenes. Sube la primera como principal.</p>
          </div>
          <div v-else class="row g-3 mb-4">
            <div v-for="img in galeria" :key="img.id" class="col-6 col-md-4 col-lg-3">
              <div class="card overflow-hidden" :style="img.es_principal ? 'border:2px solid #FFD700 !important;' : 'border:1px solid var(--kei-gris-claro);'">
                <div class="position-relative" style="aspect-ratio:1; background:#fff;">
                  <img :src="img.imagen_url" :alt="'img '+img.id" class="w-100 h-100" style="object-fit:cover;" />
                  <button type="button" @click="hacerPrincipal(img.id)" class="btn btn-sm rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center" :style="img.es_principal ? 'background:#FFD700; color:#000; border:none; width:32px;height:32px;' : 'background:rgba(255,255,255,0.9); color:#999; border:1px solid #ddd; width:32px;height:32px;'" :title="img.es_principal ? 'Principal' : 'Marcar como principal'">
                    <i :class="img.es_principal ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                  </button>
                  <span v-if="img.es_principal" class="badge position-absolute bottom-0 start-0 m-1" style="background:#FFD700; color:#000; font-size:0.6rem;"><i class="bi bi-star-fill me-1"></i>Principal</span>
                </div>
                <div class="p-2 d-flex justify-content-between align-items-center">
                  <small style="color: var(--kei-gris-medio);">#{{ img.id }}</small>
                  <button type="button" @click="eliminarImg(img.id)" class="btn btn-outline-danger btn-sm rounded-pill" style="padding:2px 8px;"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
          </div>

          <hr style="border-color: var(--kei-gris-claro);" />
          <h6 class="fw-bold" style="color: var(--kei-casi-negro);"><i class="bi bi-cloud-arrow-up me-1" style="color: var(--kei-oliva);"></i>Añadir imágenes</h6>
          <input type="file" @change="onNuevos" multiple accept="image/jpeg,image/png,image/gif,image/webp" class="form-control mb-3" />
          <div v-if="nuevos.length>0" class="row g-3 mb-3">
            <div v-for="(item, idx) in nuevos" :key="idx" class="col-6 col-md-4 col-lg-3">
              <div class="card overflow-hidden" :style="item.es_principal ? 'border:2px solid #FFD700 !important;' : 'border:1px solid var(--kei-gris-claro);'">
                <div class="position-relative" style="aspect-ratio:1; background:#fff;">
                  <img :src="item.url" class="w-100 h-100" style="object-fit:cover;" />
                  <button type="button" @click="marcarNuevoPrincipal(idx)" class="btn btn-sm rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center" :style="item.es_principal ? 'background:#FFD700; color:#000; border:none; width:28px;height:28px;' : 'background:rgba(255,255,255,0.9); color:#999; border:1px solid #ddd; width:28px;height:28px;'">
                    <i :class="item.es_principal ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                  </button>
                </div>
                <div class="p-2 d-flex justify-content-between align-items-center">
                  <small class="text-truncate" style="max-width:80px; color: var(--kei-gris-medio);">{{ item.file.name }}</small>
                  <button type="button" @click="quitarNuevo(idx)" class="btn btn-outline-secondary btn-sm rounded-pill" style="padding:2px 8px;"><i class="bi bi-x-lg"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="button" @click="subirNuevos" :disabled="nuevos.length===0 || subiendo" class="btn btn-primary rounded-pill"><span v-if="subiendo" class="spinner-border spinner-border-sm me-2"></span><i class="bi bi-cloud-arrow-up me-1"></i>Subir {{ nuevos.length }} imágenes</button>
            <button type="button" @click="nuevos=[]" :disabled="nuevos.length===0" class="btn btn-outline-secondary rounded-pill">Limpiar selección</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getProductById, getCategories, getMarcas, updateProduct, getProductoImagenes, subirImagenesGaleria, marcarImagenPrincipal, eliminarImagenGaleria } from '../services/api'
const route = useRoute(); const router = useRouter(); const authStore = useAuthStore()
const id = route.params.id
const marcas=ref([]); const categorias=ref([]); const error=ref(''); const exito=ref(''); const cargando=ref(true); const guardando=ref(false)
const original=ref(null)
const form=ref({ nombre:'', precio:'', stock:'', marca_id:'', categoria_id:'', descripcion:'', ingredientes_clave:'', tipo_piel:'', tamano:'' })
const galeria=ref([]); const nuevos=ref([]); const subiendo=ref(false)

async function cargarGaleria(){
  try{ const r = await getProductoImagenes(id); galeria.value = r.data || [] }catch(e){ console.error(e) }
}
function onNuevos(e){
  const files = Array.from(e.target.files||[])
  files.forEach((f,i)=>{
    const url = URL.createObjectURL(f)
    const es_principal = galeria.value.length===0 && nuevos.value.length===0 && i===0
    nuevos.value.push({ file:f, url, es_principal })
  })
  e.target.value=''
}
function marcarNuevoPrincipal(idx){ nuevos.value.forEach((item,i)=> item.es_principal = i===idx) }
function quitarNuevo(idx){ const era = nuevos.value[idx].es_principal; nuevos.value.splice(idx,1); if(era && nuevos.value.length>0) nuevos.value[0].es_principal=true }

async function hacerPrincipal(imagenId){
  try{ await marcarImagenPrincipal(id, imagenId); await cargarGaleria(); exito.value='Imagen principal actualizada'; setTimeout(()=> exito.value='', 2000) }catch(err){ error.value = err.response?.data?.message || 'Error al marcar principal' }
}
async function eliminarImg(imagenId){
  if(!confirm('¿Eliminar esta imagen?')) return
  try{ await eliminarImagenGaleria(id, imagenId); await cargarGaleria(); exito.value='Imagen eliminada'; setTimeout(()=> exito.value='', 2000) }catch(err){ error.value = err.response?.data?.message || 'Error al eliminar' }
}
async function subirNuevos(){
  if(nuevos.value.length===0) return
  subiendo.value=true; error.value=''; exito.value=''
  try{
    const archivos = nuevos.value.map(n=> n.file)
    const principalIdx = nuevos.value.findIndex(n=> n.es_principal)
    const r = await subirImagenesGaleria(id, archivos)
    // Si se marcó principal entre los nuevos y no es el primero, marcarlo
    if(principalIdx>0 && r.data && r.data.length>principalIdx){
      await marcarImagenPrincipal(id, r.data[principalIdx].id)
    } else if(principalIdx===0 && galeria.value.length===0){
      // Si no había galería y primer nuevo es principal, backend ya lo marcó, pero asegurar
    }
    nuevos.value=[]
    await cargarGaleria()
    exito.value = 'Imágenes subidas exitosamente'
  }catch(err){ error.value = err.response?.data?.message || 'Error al subir' } finally { subiendo.value=false }
}

async function guardar(){
  error.value=''; exito.value=''; guardando.value=true
  try{ await updateProduct(id, form.value); exito.value='Producto actualizado'; setTimeout(()=> router.push('/admin/productos'), 800) }catch(err){ error.value = err.response?.data?.message || 'Error al actualizar' } finally { guardando.value=false }
}
onMounted(async ()=>{
  if(!authStore.isAdmin){ router.push('/'); return }
  try{
    const [prod, c, m] = await Promise.all([getProductById(id), getCategories(), getMarcas()])
    original.value = prod; form.value = { nombre: prod.nombre, precio: prod.precio, stock: prod.stock, marca_id: prod.marca_id, categoria_id: prod.categoria_id, descripcion: prod.descripcion||'', ingredientes_clave: prod.ingredientes_clave||'', tipo_piel: prod.tipo_piel||'', tamano: prod.tamano||'' }
    categorias.value = c.data||[]; marcas.value = m.data||[]
    await cargarGaleria()
  }catch(e){ error.value = e.response?.data?.message || 'No se pudo cargar producto' } finally { cargando.value=false }
})
</script>
