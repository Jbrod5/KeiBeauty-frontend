<template>
  <div class="container py-4">
    <nav aria-label="breadcrumb" class="mb-3"><ol class="breadcrumb"><li class="breadcrumb-item"><router-link to="/admin">Panel Admin</router-link></li><li class="breadcrumb-item active">Reportes</li></ol></nav>
    <header class="text-center mb-4">
      <h1 class="fw-bold font-display" style="color: var(--kei-casi-negro);"><i class="bi bi-bar-chart-line me-2" style="color: var(--kei-oliva);"></i>Reportes Administrativos</h1>
      <p style="color: var(--kei-gris-medio);">Ventas, ganancias, productos y clientes</p>
    </header>

    <!-- Filtros periodo global -->
    <section class="card shadow-sm mb-4">
      <div class="card-body d-flex flex-wrap gap-3 align-items-end">
        <div><label class="form-label">Desde</label><input type="date" v-model="filtros.desde" class="form-control" /></div>
        <div><label class="form-label">Hasta</label><input type="date" v-model="filtros.hasta" class="form-control" /></div>
        <button @click="cargarTodo" class="btn btn-primary rounded-pill"><i class="bi bi-arrow-clockwise me-1"></i>Actualizar</button>
        <small style="color: var(--kei-gris-medio);">Aplica a ventas totales, ganancias, top productos/clientes y periodo</small>
      </div>
    </section>

    <!-- Graficos -->
    <section class="card shadow-sm mb-4">
      <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <strong style="color: var(--kei-casi-negro);"><i class="bi bi-graph-up me-1" style="color: var(--kei-oliva);"></i>Gráficos</strong>
        <small style="color: var(--kei-gris-medio);">Reflejan el rango de fechas seleccionado</small>
      </div>
      <div class="card-body">
        <div class="row g-4">
          <div class="col-12 col-xl-6">
            <div class="h6 fw-semibold mb-2" style="color: var(--kei-casi-negro);">Ventas por mes</div>
            <div style="height: 260px;"><Bar v-if="datosVentasPorMes.labels.length" :data="datosVentasPorMes" :options="opcionesBarras" /><p v-else class="text-center pt-5" style="color: var(--kei-gris-medio);">Sin datos</p></div>
          </div>
          <div class="col-12 col-xl-6">
            <div class="h6 fw-semibold mb-2" style="color: var(--kei-casi-negro);">Ganancias por mes</div>
            <div style="height: 260px;"><Line v-if="datosGanancias.labels.length" :data="datosGanancias" :options="opcionesLinea" /><p v-else class="text-center pt-5" style="color: var(--kei-gris-medio);">Sin datos</p></div>
          </div>
          <div class="col-12 col-xl-6">
            <div class="h6 fw-semibold mb-2" style="color: var(--kei-casi-negro);">Productos más vendidos</div>
            <div style="height: 300px;"><Bar v-if="datosTopProductos.labels.length" :data="datosTopProductos" :options="opcionesBarrasHorizontales" /><p v-else class="text-center pt-5" style="color: var(--kei-gris-medio);">Sin datos</p></div>
          </div>
          <div class="col-12 col-xl-6">
            <div class="h6 fw-semibold mb-2" style="color: var(--kei-casi-negro);">Clientes con más compras</div>
            <div style="height: 300px;"><Bar v-if="datosClientesTop.labels.length" :data="datosClientesTop" :options="opcionesBarras" /><p v-else class="text-center pt-5" style="color: var(--kei-gris-medio);">Sin datos</p></div>
          </div>
          <div class="col-12">
            <div class="h6 fw-semibold mb-2" style="color: var(--kei-casi-negro);">Ventas con descuento</div>
            <div style="height: 300px;"><Bar v-if="datosVentasDescuento.labels.length" :data="datosVentasDescuento" :options="opcionesBarras" /><p v-else class="text-center pt-5" style="color: var(--kei-gris-medio);">Sin datos</p></div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="cargando" class="text-center py-5"><div class="spinner-border"></div><p style="color: var(--kei-gris-medio);">Cargando reportes...</p></div>
    <div v-else>
      <!-- Ventas Totales -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-cash-stack me-1" style="color: var(--kei-oliva);"></i>Ventas Totales</strong>
          <button @click="exportar('ventas-totales')" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('ventas-totales', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body row text-center">
          <div class="col-6"><div class="p-3 rounded" style="background: var(--kei-oliva-suave);"><div class="h4 mb-0" style="color: var(--kei-oliva-oscuro);">{{ ventasTotales.total_pedidos }}</div><small style="color: var(--kei-gris-medio);">Pedidos</small></div></div>
          <div class="col-6"><div class="p-3 rounded" style="background: var(--kei-oliva-suave);"><div class="h4 mb-0" style="color: var(--kei-oliva-oscuro);">{{ formatPrice(ventasTotales.total_ventas) }}</div><small style="color: var(--kei-gris-medio);">Ventas</small></div></div>
        </div>
      </section>

      <!-- Ventas por Mes -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-calendar3 me-1" style="color: var(--kei-oliva);"></i>Ventas por Mes</strong>
          <button @click="exportar('ventas-por-mes')" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('ventas-por-mes', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead><tr><th>Año</th><th>Mes</th><th>Pedidos</th><th>Total (Q)</th></tr></thead>
              <tbody>
                <tr v-for="r in ventasPorMes" :key="r.anio+'-'+r.mes"><td>{{ r.anio }}</td><td>{{ r.mes }}</td><td>{{ r.pedidos }}</td><td>{{ formatPrice(r.total) }}</td></tr>
                <tr v-if="ventasPorMes.length===0"><td colspan="4" class="text-center py-3" style="color: var(--kei-gris-medio);">Sin datos</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Ventas por Periodo -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-calendar-range me-1" style="color: var(--kei-oliva);"></i>Ventas por Periodo Seleccionado</strong>
          <button @click="exportar('ventas-por-periodo')" :disabled="!filtros.desde || !filtros.hasta" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('ventas-por-periodo', 'pdf')" :disabled="!filtros.desde || !filtros.hasta" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body">
          <div v-if="!filtros.desde || !filtros.hasta" class="alert alert-info"><i class="bi bi-info-circle me-1"></i>Selecciona desde y hasta para ver pedidos del periodo.</div>
          <div v-else>
            <p style="color: var(--kei-gris-medio);">Pedidos: <strong style="color: var(--kei-casi-negro);">{{ ventasPeriodo.cantidad || 0 }}</strong> — Total: <strong style="color: var(--kei-oliva);">{{ formatPrice(ventasPeriodo.total_ventas || 0) }}</strong></p>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th></tr></thead>
                <tbody>
                  <tr v-for="p in ventasPeriodo.pedidos || []" :key="p.id"><td>#{{ p.id }}</td><td>{{ p.fecha_pedido?.slice(0,10) }}</td><td>{{ p.usuario_id || p.email_contacto || 'Invitado' }}</td><td><span class="badge" :style="estadoBadge(p.estado)">{{ p.estado }}</span></td><td>{{ formatPrice(p.monto_total) }}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Ganancias -->
      <section class="card shadow-sm mb-4 border" style="border-color: var(--kei-oliva) !important;">
        <div class="card-header d-flex justify-content-between align-items-center" style="background: var(--kei-oliva-suave);">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-graph-up-arrow me-1" style="color: var(--kei-oliva);"></i>Ganancias (Ingresos - Costos)</strong>
          <button @click="exportar('ganancias')" class="btn btn-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('ganancias', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body row text-center">
          <div class="col-12 col-md-4"><div class="p-3 rounded" style="background: #EAF0E2;"><div class="h5 mb-0" style="color: var(--kei-oliva-oscuro);">{{ formatPrice(ganancias.ingresos) }}</div><small>Ingresos</small></div></div>
          <div class="col-12 col-md-4"><div class="p-3 rounded" style="background: #F2F2F2;"><div class="h5 mb-0" style="color: var(--kei-casi-negro);">{{ formatPrice(ganancias.costos) }}</div><small>Costos (entradas)</small></div></div>
          <div class="col-12 col-md-4"><div class="p-3 rounded" style="background: var(--kei-oliva); color:#fff;"><div class="h5 mb-0">{{ formatPrice(ganancias.ganancia) }}</div><small style="color:#fff;">Ganancia ({{ ganancias.margen_porcentaje }}%)</small></div></div>
        </div>
        <div class="card-footer small" style="color: var(--kei-gris-medio);">Costos = suma de entradas con costo_unitario. Si no se ingresó costo en la entrada, no se contabiliza.</div>
      </section>

      <!-- Productos más vendidos -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-trophy me-1" style="color: var(--kei-oliva);"></i>Productos Más Vendidos</strong>
          <button @click="exportar('productos-mas-vendidos')" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('productos-mas-vendidos', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead><tr><th>Producto</th><th>Marca</th><th>Vendidos</th><th>Ingresos</th></tr></thead>
              <tbody>
                <tr v-for="p in topProductos" :key="p.producto_id"><td>{{ p.nombre }}</td><td>{{ p.marca }}</td><td><span class="badge" style="background: var(--kei-oliva);">{{ p.total_vendidos }}</span></td><td>{{ formatPrice(p.total_ingresos) }}</td></tr>
                <tr v-if="topProductos.length===0"><td colspan="4" class="text-center py-3" style="color: var(--kei-gris-medio);">Sin datos</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Ventas con descuento -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-percent me-1" style="color: var(--kei-oliva);"></i>Ventas con Descuento</strong>
          <button @click="exportar('ventas-con-descuento')" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('ventas-con-descuento', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body">
          <div class="row text-center mb-3">
            <div class="col-6 col-md-3"><div class="p-3 rounded" style="background: var(--kei-oliva-suave);"><div class="h5 mb-0" style="color: var(--kei-oliva-oscuro);">{{ ventasDescuento.totales.unidades || 0 }}</div><small style="color: var(--kei-gris-medio);">Unidades</small></div></div>
            <div class="col-6 col-md-3"><div class="p-3 rounded" style="background: var(--kei-oliva-suave);"><div class="h5 mb-0" style="color: var(--kei-oliva-oscuro);">{{ ventasDescuento.totales.unidades_con_descuento || 0 }}</div><small style="color: var(--kei-gris-medio);">Con descuento</small></div></div>
            <div class="col-6 col-md-3"><div class="p-3 rounded" style="background: var(--kei-oliva-suave);"><div class="h5 mb-0" style="color: var(--kei-oliva-oscuro);">{{ formatPrice(ventasDescuento.totales.ingresos_con_descuento || 0) }}</div><small style="color: var(--kei-gris-medio);">Ingresos</small></div></div>
            <div class="col-6 col-md-3"><div class="p-3 rounded" style="background: var(--kei-fondo);"><div class="h5 mb-0" style="color: var(--kei-casi-negro);">{{ formatPrice(ventasDescuento.totales.ahorro_total || 0) }}</div><small style="color: var(--kei-gris-medio);">Ahorro dado</small></div></div>
          </div>

          <div v-if="ventasDescuento.comparacion" class="alert alert-info py-2 px-3 small">
            <i class="bi bi-graph-up-arrow me-1"></i>
            Frente al periodo anterior ({{ ventasDescuento.comparacion.desde }} al {{ ventasDescuento.comparacion.hasta }})
            <strong>{{ ventasDescuento.comparacion.variacion_ingresos_porcentaje == null ? 'sin datos previos' : formatPrice(ventasDescuento.comparacion.variacion_ingresos_porcentaje) + '%' }}</strong>
            en ingresos
            ({{ formatPrice(ventasDescuento.comparacion.ingresos || 0) }} → {{ formatPrice(ventasDescuento.totales.ingresos_con_descuento || 0) }}).
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead><tr><th>Producto</th><th>Unidades</th><th>Con descuento</th><th>Ingresos (Q)</th><th>Ahorro (Q)</th><th>Desc. medio</th></tr></thead>
              <tbody>
                <tr v-for="p in ventasDescuento.productos || []" :key="p.producto_id">
                  <td>{{ p.nombre }}</td>
                  <td>{{ p.unidades }}</td>
                  <td>{{ p.unidades_con_descuento }}</td>
                  <td>{{ formatPrice(p.ingresos_con_descuento) }}</td>
                  <td>{{ formatPrice(p.ahorro_total) }}</td>
                  <td>{{ p.descuento_promedio }}%</td>
                </tr>
                <tr v-if="(ventasDescuento.productos || []).length===0"><td colspan="6" class="text-center py-3" style="color: var(--kei-gris-medio);">Sin datos</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Clientes top -->
      <section class="card shadow-sm mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-people me-1" style="color: var(--kei-oliva);"></i>Clientes con Más Compras</strong>
          <button @click="exportar('clientes-top')" class="btn btn-outline-primary btn-sm rounded-pill"><i class="bi bi-file-earmark-excel me-1"></i>Excel</button>
          <button @click="exportar('clientes-top', 'pdf')" class="btn btn-outline-secondary btn-sm rounded-pill ms-2"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead><tr><th>Cliente</th><th>Email</th><th>Pedidos</th><th>Gastado</th></tr></thead>
              <tbody>
                <tr v-for="c in topClientes" :key="c.usuario_id"><td>{{ c.nombre }}</td><td>{{ c.email }}</td><td>{{ c.total_pedidos }}</td><td>{{ formatPrice(c.total_gastado) }}</td></tr>
                <tr v-if="topClientes.length===0"><td colspan="4" class="text-center py-3" style="color: var(--kei-gris-medio);">Sin datos</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useAuthStore } from '../stores/authStore'
import { getReportesVentasTotales, getReportesVentasPorMes, getReportesVentasPorPeriodo, getReportesGanancias, getReportesProductosMasVendidos, getReportesClientesTop, getReportesVentasConDescuento, descargarReporte } from '../services/api'
import { construirDescargaReporte, extraerNombreArchivo } from '../utils/descargas.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const COLOR_OLIVA = 'rgba(140, 176, 122, 0.75)'
const COLOR_OLIVA_SOLIDO = '#8CB07A'
const COLOR_GRIS = 'rgba(77, 77, 89, 0.75)'
const COLOR_ROJO = 'rgba(199, 123, 123, 0.8)'

const router = useRouter()
const authStore = useAuthStore()
const cargando = ref(false)
const filtros = ref({ desde: '', hasta: '' })
const ventasTotales = ref({ total_pedidos:0, total_ventas:0 })
const ventasPorMes = ref([])
const ventasPeriodo = ref({})
const ganancias = ref({ ingresos:0, costos:0, ganancia:0, margen_porcentaje:0 })
const topProductos = ref([])
const topClientes = ref([])
const ventasDescuento = ref({ productos: [], totales: {}, comparacion: null })

const opcionesBarras = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true } }
}
const opcionesBarrasHorizontales = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { x: { beginAtZero: true } }
}
const opcionesLinea = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true } }
}

const etiquetaMes = (m) => `${MESES[(Number(m) || 1) - 1] || ''}`

const datosVentasPorMes = computed(() => ({
  labels: ventasPorMes.value.map(r => `${etiquetaMes(r.mes)} ${r.anio}`),
  datasets: [{
    label: 'Ventas (Q)',
    data: ventasPorMes.value.map(r => r.total),
    backgroundColor: COLOR_OLIVA,
    borderColor: COLOR_OLIVA_SOLIDO,
    borderWidth: 1,
    borderRadius: 4
  }]
}))

const datosGanancias = computed(() => {
  const serie = ganancias.value.por_mes || []
  return {
    labels: serie.map(m => `${etiquetaMes(m.mes)} ${m.anio}`),
    datasets: [
      { label: 'Ingresos (Q)', data: serie.map(m => m.ingresos), backgroundColor: COLOR_OLIVA, borderColor: COLOR_OLIVA_SOLIDO, tension: 0.25, fill: false },
      { label: 'Costos (Q)', data: serie.map(m => m.costos), backgroundColor: COLOR_ROJO, borderColor: COLOR_ROJO, tension: 0.25, fill: false }
    ]
  }
})

const datosTopProductos = computed(() => ({
  labels: topProductos.value.map(p => p.nombre),
  datasets: [{
    label: 'Unidades vendidas',
    data: topProductos.value.map(p => p.total_vendidos),
    backgroundColor: COLOR_GRIS,
    borderRadius: 4
  }]
}))

const datosClientesTop = computed(() => ({
  labels: topClientes.value.map(c => c.nombre),
  datasets: [{
    label: 'Total gastado (Q)',
    data: topClientes.value.map(c => c.total_gastado),
    backgroundColor: COLOR_OLIVA,
    borderRadius: 4
  }]
}))

const datosVentasDescuento = computed(() => ({
  labels: (ventasDescuento.value.productos || []).map(p => p.nombre),
  datasets: [{
    label: 'Ingresos con descuento (Q)',
    data: (ventasDescuento.value.productos || []).map(p => p.ingresos_con_descuento),
    backgroundColor: COLOR_ROJO,
    borderRadius: 4
  }]
}))

function formatPrice(p){ return new Intl.NumberFormat('es-GT',{style:'currency',currency:'GTQ'}).format(p||0) }
function estadoBadge(e){
  if(e==='agotado') return 'background:#f8e8e8;color:#7a3a3a;border:1px solid #e0c0c0;'
  if(e==='activo') return 'background:var(--kei-oliva-suave);color:var(--kei-oliva-oscuro);border:1px solid var(--kei-oliva-claro);'
  return 'background:var(--kei-gris-claro);color:var(--kei-casi-negro);'
}
async function cargarTodo(){
  cargando.value=true
  try{
    const params = {}
    if(filtros.value.desde) params.desde = filtros.value.desde
    if(filtros.value.hasta) params.hasta = filtros.value.hasta
    const [vt, vpm, gan, prod, cli, desc] = await Promise.all([
      getReportesVentasTotales(params),
      getReportesVentasPorMes(params),
      getReportesGanancias(params),
      getReportesProductosMasVendidos(params),
      getReportesClientesTop(params),
      getReportesVentasConDescuento(params)
    ])
    ventasTotales.value = vt.data || vt
    ventasPorMes.value = vpm.data || []
    ganancias.value = gan.data || gan
    topProductos.value = prod.data || []
    topClientes.value = cli.data || []
    ventasDescuento.value = desc.data || { productos: [], totales: {}, comparacion: null }
    if(filtros.value.desde && filtros.value.hasta){
      const vp = await getReportesVentasPorPeriodo({ desde: filtros.value.desde, hasta: filtros.value.hasta })
      ventasPeriodo.value = vp.data || {}
    } else {
      ventasPeriodo.value = {}
    }
  }catch(e){ console.error(e) } finally{ cargando.value=false }
}
async function exportar(tipo, formato = 'excel'){
  const params = {}
  if(filtros.value.desde) params.desde = filtros.value.desde
  if(filtros.value.hasta) params.hasta = filtros.value.hasta
  const mapa = {
    'ventas-totales': '/reportes/ventas-totales',
    'ventas-por-mes': '/reportes/ventas-por-mes',
    'ventas-por-periodo': '/reportes/ventas-por-periodo',
    'ganancias': '/reportes/ganancias',
    'productos-mas-vendidos': '/reportes/productos-mas-vendidos',
    'clientes-top': '/reportes/clientes-top',
    'ventas-con-descuento': '/reportes/ventas-con-descuento'
  }
  const url = mapa[tipo]
  if(tipo==='ventas-por-periodo' && (!filtros.value.desde || !filtros.value.hasta)){
    alert('Selecciona desde y hasta para exportar periodo')
    return
  }
  try{
    const res = await descargarReporte(url, params, formato)
    const { nombrePorDefecto, mime } = construirDescargaReporte(url, params, formato)
    const blob = new Blob([res.data], { type: mime })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = extraerNombreArchivo(res.headers['content-disposition'], nombrePorDefecto)
    link.click()
    URL.revokeObjectURL(link.href)
  }catch(e){ console.error(e); alert(`Error al descargar ${formato === 'pdf' ? 'PDF' : 'Excel'}`) }
}
onMounted(async ()=>{
  if(!authStore.isAdmin){ router.push('/'); return }
  await cargarTodo()
})
</script>
