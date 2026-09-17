<template>
  <div class="container py-4">
    <nav aria-label="breadcrumb" class="mb-3"><ol class="breadcrumb"><li class="breadcrumb-item"><router-link to="/admin">Panel Admin</router-link></li><li class="breadcrumb-item active">Productos</li></ol></nav>
    <header class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mb-4">
      <div class="text-center text-md-start">
        <h1 class="fw-bold font-display mb-1" style="color: var(--kei-casi-negro);"><i class="bi bi-box-seam me-2" style="color: var(--kei-oliva);"></i>Gestión de Productos</h1>
        <p class="mb-0" style="color: var(--kei-gris-medio);">Listado, inventario e imágenes (ImageKit)</p>
      </div>
      <router-link to="/admin/productos/crear" class="btn btn-primary rounded-pill px-4"><i class="bi bi-plus-lg me-2"></i>Crear producto</router-link>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status"></div><p style="color: var(--kei-gris-medio);">Cargando...</p>
    </div>
    <div v-else-if="error && products.length === 0" class="alert alert-danger text-center"><i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}<button class="btn btn-primary btn-sm rounded-pill ms-3" @click="loadProducts">Reintentar</button></div>
    <div v-else>
      <div class="card shadow-sm mb-4">
        <div class="card-body d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
          <label class="form-label mb-0 fw-medium d-inline-flex align-items-center gap-2" style="color: var(--kei-casi-negro);"><i class="bi bi-funnel" style="color: var(--kei-oliva);"></i>Estado:</label>
          <select v-model="filtroEstado" @change="loadProducts" class="form-select w-auto" style="min-width: 200px;"><option value="">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option><option value="agotado">Agotado</option></select>
        </div>
      </div>
      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 py-2"><i class="bi bi-exclamation-triangle-fill"></i><div>{{ error }}</div></div>
      <section class="card shadow-sm overflow-hidden">
        <div class="card-header d-flex align-items-center justify-content-between"><span class="fw-bold d-inline-flex align-items-center gap-2" style="color: var(--kei-casi-negro);"><i class="bi bi-box-seam" style="color: var(--kei-oliva);"></i>Productos ({{ products.length }})</span></div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead><tr><th class="ps-3">ID</th><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Estado</th><th class="pe-3">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td class="ps-3"><span class="fw-bold" style="color: var(--kei-casi-negro);">#{{ p.id }}</span></td>
                <td><img :src="p.imagen_url || 'https://via.placeholder.com/60x60?text=?'" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid var(--kei-gris-claro);" /></td>
                <td><router-link :to="`/producto/${p.id}`" class="text-decoration-none fw-medium d-inline-flex align-items-center gap-2" style="color: var(--kei-oliva);"><i class="bi bi-box-seam small"></i>{{ p.nombre }}<i class="bi bi-box-arrow-up-right small" style="color: var(--kei-beige-medio);"></i></router-link><br><small style="color: var(--kei-beige-medio);">{{ p.marca_nombre }} · {{ p.categoria_nombre }}</small></td>
                <td class="fw-bold" style="color: var(--kei-casi-negro);">{{ formatPrice(p.precio) }}</td>
                <td><span class="badge rounded-pill" style="background: var(--kei-oliva-suave); color: var(--kei-casi-negro); border: 1px solid var(--kei-oliva-claro);">{{ p.stock }}</span></td>
                <td><span class="badge rounded-pill text-uppercase px-2 py-1" :style="estadoBadgeStyle(p.estado)">{{ p.estado }}</span></td>
                <td class="pe-3">
                  <div class="d-flex flex-wrap gap-1 align-items-center">
                    <router-link :to="`/admin/productos/${p.id}/editar`" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-pencil me-1"></i>Editar</router-link>
                    <button @click="eliminarProducto(p.id)" class="btn btn-outline-secondary btn-sm rounded-pill"><i class="bi bi-trash me-1"></i>Eliminar</button>
                    <button @click="mostrarAjuste(p.id)" class="btn btn-outline-secondary btn-sm rounded-pill"><i class="bi bi-arrow-down-up me-1"></i>Ajustar</button>
                  </div>
                  <div v-if="ajusteActivo === p.id" class="card mt-2 p-2 d-inline-flex flex-row flex-wrap align-items-center gap-2" style="background: var(--kei-oliva-suave); border-color: var(--kei-oliva-claro);">
                    <select v-model="ajusteTipo" class="form-select form-select-sm w-auto"><option value="">Tipo</option><option value="entrada">Entrada</option><option value="salida">Salida</option></select>
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
import { getProducts, deleteProduct, ajustarInventario } from '../services/api'
const router = useRouter(); const authStore = useAuthStore()
const products=ref([]); const loading=ref(true); const error=ref(''); const filtroEstado=ref(''); const ajusteActivo=ref(null); const ajusteTipo=ref(''); const ajusteCantidad=ref('')
function formatPrice(price){ return new Intl.NumberFormat('es-GT', { style:'currency', currency:'GTQ', minimumFractionDigits:2 }).format(price) }
function estadoBadgeStyle(estado){
  if(estado==='activo') return 'background: var(--kei-oliva-suave); color: var(--kei-oliva-oscuro); border: 1px solid var(--kei-oliva-claro);'
  if(estado==='inactivo') return 'background: var(--kei-beige-claro); color: var(--kei-casi-negro); border: 1px solid var(--kei-beige-medio);'
  if(estado==='agotado') return 'background: #f8e8e8; color: #7a3a3a; border: 1px solid #e0c0c0;'
  return 'background: var(--kei-gris-claro); color: var(--kei-casi-negro);'
}
async function loadProducts(){
  loading.value=true; error.value=''
  try{ const params = filtroEstado.value ? { estado: filtroEstado.value } : {}; const result = await getProducts(params); products.value = Array.isArray(result) ? result : (result?.data||[]) }catch(err){ error.value = err.response?.data?.message || 'Error al cargar productos' } finally{ loading.value=false }
}
async function eliminarProducto(id){ if(!confirm('¿Eliminar producto?')) return; try{ await deleteProduct(id); await loadProducts() }catch(err){ error.value=err.response?.data?.message||'Error al eliminar' } }
function mostrarAjuste(id){ ajusteActivo.value=id; ajusteTipo.value=''; ajusteCantidad.value='' }
function cancelarAjuste(){ ajusteActivo.value=null; ajusteTipo.value=''; ajusteCantidad.value='' }
async function confirmaAjuste(id){ const t=ajusteTipo.value; const c=parseInt(ajusteCantidad.value||'0'); if(!t||c<=0){ error.value='Selecciona tipo y cantidad válida'; return } try{ await ajustarInventario(id,t,c); await loadProducts(); cancelarAjuste() }catch(err){ error.value=err.response?.data?.message||'Error al ajustar' } }
onMounted(async ()=>{ if(!authStore.isAdmin){ router.push('/'); return } await loadProducts() })
</script>
