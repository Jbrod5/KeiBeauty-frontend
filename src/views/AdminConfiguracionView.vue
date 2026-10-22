<template>
  <div class="container py-4">
    <nav aria-label="breadcrumb" class="mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/admin">Panel Admin</router-link></li>
        <li class="breadcrumb-item active">Configuración</li>
      </ol>
    </nav>

    <header class="text-center mb-4">
      <h1 class="fw-bold font-display" style="color: var(--kei-casi-negro);">
        <i class="bi bi-sliders me-2" style="color: var(--kei-oliva);"></i>Configuración de la Tienda
      </h1>
      <p style="color: var(--kei-gris-medio);">Ajustes de envío y reglas comerciales</p>
    </header>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border"></div>
      <p style="color: var(--kei-gris-medio);">Cargando configuración...</p>
    </div>

    <div v-else>
      <div v-if="mensaje" class="alert alert-success d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill"></i><div>{{ mensaje }}</div>
      </div>
      <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle-fill"></i><div>{{ error }}</div>
      </div>

      <section class="card shadow-sm mb-4">
        <div class="card-header" style="background: var(--kei-oliva-suave); border-color: var(--kei-oliva-claro);">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-truck me-1" style="color: var(--kei-oliva);"></i>Política de envío</strong>
        </div>
        <div class="card-body">
          <p class="small mb-4" style="color: var(--kei-gris-medio);">
            Todos los pedidos pagan un costo de envío fijo, salvo que el subtotal de los
            productos alcance el mínimo indicado; en ese caso el envío es gratis.
          </p>

          <!-- Interruptor de envío gratis -->
          <div class="card mb-4" style="background-color: var(--kei-fondo) !important;">
            <div class="card-body py-3">
              <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div class="flex-grow-1 me-3">
                  <div class="fw-medium d-flex align-items-center gap-2" style="color: var(--kei-casi-negro);">
                    <i class="bi bi-truck"></i>
                    Envío gratis por monto mínimo
                    <span class="badge rounded-pill" :class="form.envio_gratis_activo ? 'bg-success' : 'bg-secondary'" style="font-size: 0.7rem;">
                      {{ form.envio_gratis_activo ? 'Activado' : 'Desactivado' }}
                    </span>
                  </div>
                  <small style="color: var(--kei-gris-medio);">
                    Cuando está activado, los pedidos que alcanzan el mínimo se cobran sin envío
                    y el cliente ve en el carrito cuánto le falta para lograrlo.
                  </small>
                </div>
                <div class="form-check form-switch mb-0">
                  <input
                    id="switchEnvioGratis"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    v-model="form.envio_gratis_activo"
                    aria-label="Activar o desactivar el envío gratis por monto mínimo"
                    style="width: 3rem; height: 1.6rem;"
                  />
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent="guardarEnvio" novalidate>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label for="costoEnvio" class="form-label">Costo de envío (Q) *</label>
                <div class="input-group">
                  <span class="input-group-text" style="background: var(--kei-oliva-suave);">Q</span>
                  <input
                    id="costoEnvio"
                    v-model="form.costo_envio"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="form-control"
                    :class="{ 'is-invalid': errores.costo_envio }"
                  />
                </div>
                <div v-if="errores.costo_envio" class="invalid-feedback d-block">{{ errores.costo_envio }}</div>
                <small style="color: var(--kei-gris-medio);">Costo que se suma al subtotal del pedido.</small>
              </div>

              <div class="col-12 col-md-6">
                <label for="minimoEnvioGratis" class="form-label">Mínimo para envío gratis (Q) *</label>
                <div class="input-group">
                  <span class="input-group-text" style="background: var(--kei-oliva-suave);">Q</span>
                  <input
                    id="minimoEnvioGratis"
                    v-model="form.minimo_envio_gratis"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="form-control"
                    :disabled="!form.envio_gratis_activo"
                    :class="{ 'is-invalid': errores.minimo_envio_gratis }"
                  />
                </div>
                <div v-if="errores.minimo_envio_gratis" class="invalid-feedback d-block">{{ errores.minimo_envio_gratis }}</div>
                <small style="color: var(--kei-gris-medio);">
                  <template v-if="form.envio_gratis_activo">
                    Subtotal a partir del cual el envío es gratis.
                  </template>
                  <template v-else>
                    El envío gratis está desactivado, así que este valor no se aplica.
                  </template>
                </small>
              </div>
            </div>

            <div class="mt-4">
              <button type="submit" :disabled="guardando" class="btn btn-primary rounded-pill px-4">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                <i class="bi bi-check-lg me-1"></i>Guardar configuración
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-header" style="background: var(--kei-fondo); border-color: var(--kei-gris-claro);">
          <strong style="color: var(--kei-casi-negro);"><i class="bi bi-list-ul me-1" style="color: var(--kei-oliva);"></i>Todos los ajustes</strong>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3">Clave</th>
                  <th>Valor</th>
                  <th>Descripción</th>
                  <th class="pe-3">Actualizado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in ajustes" :key="item.clave">
                  <td class="ps-3"><code>{{ item.clave }}</code></td>
                  <td class="fw-semibold" style="color: var(--kei-casi-negro);">{{ item.valor }}</td>
                  <td class="small" style="color: var(--kei-gris-medio);">{{ item.descripcion || '—' }}</td>
                  <td class="pe-3 small" style="color: var(--kei-gris-medio);">{{ formatearFecha(item.fecha_actualizacion) }}</td>
                </tr>
                <tr v-if="ajustes.length === 0">
                  <td colspan="4" class="text-center py-3" style="color: var(--kei-gris-medio);">Sin ajustes configurados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/authStore'
import { getConfiguracion, actualizarConfiguracion } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const cargando = ref(true)
const guardando = ref(false)
const ajustes = ref([])
const mensaje = ref('')
const error = ref('')
const errores = ref({})
const form = ref({ costo_envio: '', minimo_envio_gratis: '', envio_gratis_activo: true })

function formatearFecha(valor) {
  if (!valor) return '—'
  return new Date(valor).toLocaleString('es-GT', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    const r = await getConfiguracion()
    ajustes.value = r.data || []
    const porClave = (clave) => ajustes.value.find(a => a.clave === clave)
    form.value.costo_envio = porClave('costo_envio')?.valor ?? ''
    form.value.minimo_envio_gratis = porClave('minimo_envio_gratis')?.valor ?? ''
    const bruto = String(porClave('envio_gratis_activo')?.valor ?? 'true').trim().toLowerCase()
    form.value.envio_gratis_activo = !['false', '0', 'no', 'off', 'inactivo'].includes(bruto)
  } catch (err) {
    error.value = err.response?.data?.message || 'No se pudo cargar la configuración'
  } finally {
    cargando.value = false
  }
}

function validar() {
  errores.value = {}
  let valido = true
  const claves = form.value.envio_gratis_activo ? ['costo_envio', 'minimo_envio_gratis'] : ['costo_envio']
  for (const clave of claves) {
    const valor = Number(form.value[clave])
    if (form.value[clave] === '' || Number.isNaN(valor)) {
      errores.value[clave] = 'Ingresa un valor numérico'
      valido = false
    } else if (valor < 0) {
      errores.value[clave] = 'El valor no puede ser negativo'
      valido = false
    }
  }
  return valido
}

async function guardarEnvio() {
  mensaje.value = ''
  error.value = ''
  if (!validar()) return

  guardando.value = true
  try {
    await actualizarConfiguracion('costo_envio', Number(form.value.costo_envio).toFixed(2))
    if (form.value.envio_gratis_activo) {
      await actualizarConfiguracion('minimo_envio_gratis', Number(form.value.minimo_envio_gratis).toFixed(2))
    }
    await actualizarConfiguracion('envio_gratis_activo', form.value.envio_gratis_activo ? 'true' : 'false')
    await cargar()
    mensaje.value = 'Configuración de envío actualizada correctamente.'
    toast.success('Configuración guardada')
  } catch (err) {
    error.value = err.response?.data?.message || 'No se pudo guardar la configuración'
    toast.error(error.value)
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  await cargar()
})
</script>
