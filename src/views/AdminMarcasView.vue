<template>
  <div class="container py-4">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold font-display" style="color: var(--kei-casi-negro);">Gestión de Marcas</h1>
      <p style="color: var(--kei-gris-medio);">Administra marcas del catálogo con logo ImageKit</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status"></div>
      <p style="color: var(--kei-gris-medio);">Cargando marcas...</p>
    </div>

    <div v-else>
      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2"><i class="bi bi-exclamation-triangle-fill"></i><div>{{ error }}</div></div>
      <div v-if="exito" class="alert alert-primary d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill"></i><div>{{ exito }}</div></div>

      <section class="card shadow-sm mb-4" :style="editMode ? 'border:2px solid var(--kei-oliva) !important;' : ''">
        <div class="card-header d-flex align-items-center gap-2" :style="editMode ? 'background: var(--kei-oliva-suave);' : ''">
          <i class="bi" :class="editMode ? 'bi-pencil-square' : 'bi-plus-circle'" style="color: var(--kei-oliva);"></i>
          <h2 class="h6 fw-bold mb-0" style="color: var(--kei-casi-negro);">{{ editMode ? `Editando: ${editMode.nombre}` : 'Crear Marca' }}</h2>
          <span v-if="editMode" class="badge rounded-pill ms-auto" style="background: var(--kei-oliva);">Modo edición</span>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveMarca()" class="d-flex flex-column gap-3">
            <div><label class="form-label">Nombre *</label><input v-model="form.nombre" placeholder="Nombre de la marca" required class="form-control" /></div>
            <div><label class="form-label">Descripción</label><textarea v-model="form.descripcion" placeholder="Descripción opcional" rows="2" class="form-control"></textarea></div>
            <div><label class="form-label">URL del logo (opcional)</label><input v-model="form.logo_url" placeholder="https://..." class="form-control" @input="updatePreview" /></div>
            <div>
              <label class="form-label">Archivo de logo (ImageKit) <span class="small text-muted">— JPG/PNG/WebP</span></label>
              <input type="file" @change="onFile" accept="image/jpeg,image/png,image/gif,image/webp" class="form-control" />
            </div>
            <div v-if="preview" class="p-3 rounded d-flex align-items-center gap-3" style="background: var(--kei-oliva-suave); border: 1px solid var(--kei-oliva-claro);">
              <img :src="preview" alt="preview logo" style="width:80px;height:80px;object-fit:contain;border-radius:8px;border:1px solid var(--kei-gris-claro);background:#fff;" @error="previewError=true" />
              <div>
                <strong style="color: var(--kei-casi-negro);">Vista previa</strong><br>
                <small style="color: var(--kei-gris-medio);">{{ previewOrigen }}</small><br>
                <button v-if="archivo" type="button" @click="limpiarArchivo" class="btn btn-outline-secondary btn-sm rounded-pill mt-1">Quitar archivo</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" :disabled="guardando" class="btn btn-primary rounded-pill"><span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span><i :class="editMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-2"></i>{{ editMode ? 'Guardar cambios' : 'Crear marca' }}</button>
              <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-outline-secondary rounded-pill"><i class="bi bi-x-lg me-1"></i>Cancelar edición</button>
            </div>
          </form>
        </div>
      </section>

      <section class="card shadow-sm overflow-hidden">
        <div class="card-header d-flex align-items-center gap-2">
          <i class="bi bi-award" style="color: var(--kei-oliva);"></i>
          <span class="fw-bold" style="color: var(--kei-casi-negro);">Marcas ({{ marcas.length }})</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th class="ps-3">ID</th><th>Nombre</th><th>Descripción</th><th>Logo</th><th class="pe-3">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="m in marcas" :key="m.id" :style="editMode && editMode.id===m.id ? 'background: var(--kei-oliva-suave);' : ''">
                <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ m.id }}</span></td>
                <td class="fw-medium" style="color: var(--kei-casi-negro);">{{ m.nombre }}</td>
                <td style="color: var(--kei-gris-medio);">{{ m.descripcion || '-' }}</td>
                <td><img v-if="m.logo_url" :src="m.logo_url" alt="logo" class="rounded border" style="max-height: 40px; max-width: 80px; object-fit: contain; border-color: var(--kei-gris-claro) !important;" /><span v-else class="small" style="color: var(--kei-beige-medio);"><i class="bi bi-image me-1"></i>Sin logo</span></td>
                <td class="pe-3"><div class="d-flex gap-2"><button @click="editMarca(m)" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-pencil me-1"></i>Editar</button><button @click="eliminarMarca(m.id)" class="btn btn-outline-secondary btn-sm rounded-pill"><i class="bi bi-trash me-1"></i>Eliminar</button></div></td>
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
import { getMarcas, createMarca, updateMarca, deleteMarca } from '../services/api'
const router = useRouter(); const authStore = useAuthStore()
const marcas=ref([]); const loading=ref(true); const error=ref(''); const exito=ref(''); const guardando=ref(false); const editMode=ref(false)
const form=ref({ nombre:'', descripcion:'', logo_url:'' }); const archivo=ref(null); const preview=ref(''); const previewOrigen=ref('')
function onFile(e){ const f=e.target.files&&e.target.files[0]; if(!f){archivo.value=null; updatePreview(); return} archivo.value=f; preview.value=URL.createObjectURL(f); previewOrigen.value=`Archivo: ${f.name}` }
function updatePreview(){ if(archivo.value){ preview.value=URL.createObjectURL(archivo.value); previewOrigen.value=`Archivo: ${archivo.value.name}`; return } if(form.value.logo_url){ preview.value=form.value.logo_url; previewOrigen.value='URL externa' } else { preview.value=''; previewOrigen.value='' } }
function limpiarArchivo(){ archivo.value=null; const inp=document.querySelector('input[type="file"]'); if(inp) inp.value=''; updatePreview() }
async function loadMarcas(){ loading.value=true; error.value=''; try{ const res=await getMarcas(); marcas.value=res.data||[] }catch(err){ error.value=err.response?.data?.message||'Error' } finally{ loading.value=false } }
async function saveMarca(){
  guardando.value=true; error.value=''; exito.value=''
  try{
    if(editMode.value){
      const fd=new FormData(); fd.append('nombre', form.value.nombre); fd.append('descripcion', form.value.descripcion||''); if(archivo.value) fd.append('archivo', archivo.value); else fd.append('logo_url', form.value.logo_url||'')
      // Usar FormData via updateMarca que ahora soporta archivo: necesitamos enviar como FormData, pero api updateMarca envía JSON; usaremos createMarca-like con PUT form-data: workaround vía api directa
      if(archivo.value){
        // Para edición con archivo, usamos endpoint PUT con FormData: la ruta ahora acepta form-data
        await updateMarca(editMode.value.id, fd)
      } else {
        await updateMarca(editMode.value.id, form.value)
      }
      exito.value='Marca actualizada'; editMode.value=false; form.value={nombre:'', descripcion:'', logo_url:''}; archivo.value=null; preview.value=''; await loadMarcas()
    } else {
      const fd=new FormData(); fd.append('nombre', form.value.nombre); fd.append('descripcion', form.value.descripcion||''); if(archivo.value) fd.append('archivo', archivo.value); else if(form.value.logo_url) fd.append('logo_url', form.value.logo_url)
      const res=await createMarca(fd); if(res&&res.data){ form.value={nombre:'', descripcion:'', logo_url:''}; archivo.value=null; preview.value=''; exito.value='Marca creada'; await loadMarcas() }
    }
  }catch(err){ error.value=err.response?.data?.message||'Error al guardar' } finally{ guardando.value=false }
}
function editMarca(m){ editMode.value=m; form.value={ nombre:m.nombre, descripcion:m.descripcion||'', logo_url:m.logo_url||'' }; archivo.value=null; preview.value=m.logo_url||''; previewOrigen.value= m.logo_url ? 'Logo actual' : 'Sin logo' }
function cancelEdit(){ editMode.value=false; form.value={nombre:'', descripcion:'', logo_url:''}; archivo.value=null; preview.value='' }
async function eliminarMarca(id){ if(!confirm('¿Eliminar marca?')) return; try{ await deleteMarca(id); await loadMarcas() }catch(err){ error.value=err.response?.data?.message||'Error' } }
onMounted(async ()=>{ if(!authStore.isAdmin){ router.push('/'); return } await loadMarcas() })
</script>
