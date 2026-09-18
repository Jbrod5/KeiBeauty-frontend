<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm rounded-3">
          <div class="card-body p-4">
            <p class="seccion-etiqueta mb-2"><i class="bi bi-gear me-1"></i>Conexión</p>
            <h1 class="h4 fw-bold mb-3 font-display" style="color: var(--kei-casi-negro);">
              Configurar API del backend
            </h1>

            <!-- Mensaje de guardado por URL -->
            <div v-if="mensajeUrl" class="alert alert-success d-flex align-items-center gap-2" role="alert">
              <i class="bi bi-check-circle-fill"></i>
              <span>{{ mensajeUrl }}</span>
            </div>

            <p class="small mb-3" style="color: var(--kei-gris-medio);">
              Esta app recuerda a qué backend conectarse. Útil cuando el backend
              tiene una dirección cambiante (por ejemplo, un túnel ngrok nuevo
              cada día): basta abrir
              <code>/config-api?api=https://tu-backend.ngrok-free.app/api</code>
              y queda guardado en este navegador, sin recompilar nada.
            </p>

            <!-- Estado actual -->
            <ul class="list-group mb-3">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="bi bi-hdd-network me-2" style="color: var(--kei-oliva);"></i>API en uso</span>
                <code class="small text-break">{{ urlEfectiva }}</code>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="bi bi-flag me-2" style="color: var(--kei-oliva);"></i>Valor por defecto</span>
                <code class="small text-break">{{ urlDefecto }}</code>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="bi bi-pin-angle me-2" style="color: var(--kei-oliva);"></i>Dirección manual</span>
                <span v-if="hayOverride" class="badge rounded-pill" style="background: var(--kei-oliva);">Activa</span>
                <span v-else class="badge rounded-pill" style="background: var(--kei-gris-claro); color: var(--kei-gris-medio);">Inactiva</span>
              </li>
            </ul>

            <!-- Resultado de la prueba -->
            <div v-if="resultadoPrueba" class="alert d-flex align-items-center gap-2" :class="pruebaOk ? 'alert-success' : 'alert-danger'" role="alert">
              <i class="bi" :class="pruebaOk ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
              <span>{{ resultadoPrueba }}</span>
            </div>
            <div v-if="errorForm" class="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <i class="bi bi-exclamation-triangle-fill"></i>
              <span>{{ errorForm }}</span>
            </div>

            <!-- Formulario manual -->
            <label for="urlApi" class="form-label fw-semibold">Dirección base de la API (termina en /api)</label>
            <div class="input-group mb-3">
              <input
                id="urlApi"
                v-model="urlManual"
                type="url"
                class="form-control"
                placeholder="https://tu-backend.ngrok-free.app/api"
              />
              <button class="btn btn-primary" @click="guardarManual" :disabled="probando">
                <i class="bi bi-save me-1"></i>Guardar
              </button>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-outline-primary rounded-pill" @click="probarConexion" :disabled="probando">
                <span v-if="probando" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                <i v-else class="bi bi-activity me-1"></i>Probar conexión
              </button>
              <button v-if="hayOverride" class="btn btn-outline-secondary rounded-pill" @click="restablecer">
                <i class="bi bi-arrow-counterclockwise me-1"></i>Volver al valor por defecto
              </button>
              <router-link to="/catalogo" class="btn btn-secondary rounded-pill">
                <i class="bi bi-bag-heart me-1"></i>Ir al catálogo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  obtenerUrlBaseApi,
  guardarUrlBaseApi,
  restablecerUrlBaseApi,
  hayOverrideUrlBaseApi
} from '../services/api'

// Vista /config-api: permite fijar la URL del backend en localStorage,
// manual o vía query ?api=<url>. Ideal para túneles ngrok con URL cambiante.
const route = useRoute()

const urlManual = ref('')
const urlEfectiva = ref(obtenerUrlBaseApi())
const urlDefecto = ref(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
const hayOverride = ref(hayOverrideUrlBaseApi())
const mensajeUrl = ref('')
const errorForm = ref('')
const resultadoPrueba = ref('')
const pruebaOk = ref(false)
const probando = ref(false)

function normalizarUrl(url) {
  return (url || '').trim().replace(/\/+$/, '')
}

function esUrlValida(url) {
  return /^https?:\/\/[^ ]+$/i.test(url || '')
}

function refrescarEstado() {
  urlEfectiva.value = obtenerUrlBaseApi()
  hayOverride.value = hayOverrideUrlBaseApi()
  urlManual.value = hayOverride.value ? urlEfectiva.value : ''
}

function guardarManual() {
  errorForm.value = ''
  mensajeUrl.value = ''
  const url = normalizarUrl(urlManual.value)
  if (!esUrlValida(url)) {
    errorForm.value = 'URL inválida: debe empezar con http:// o https:// (ej. https://abc.ngrok-free.app/api).'
    return
  }
  guardarUrlBaseApi(url)
  mensajeUrl.value = 'Dirección guardada. La app ya se comunica con el nuevo backend.'
  refrescarEstado()
}

function restablecer() {
  restablecerUrlBaseApi()
  mensajeUrl.value = ''
  errorForm.value = ''
  resultadoPrueba.value = ''
  refrescarEstado()
}

async function probarConexion() {
  probando.value = true
  resultadoPrueba.value = ''
  try {
    // /health vive en la raíz del backend, fuera del prefijo /api
    const raiz = normalizarUrl(urlEfectiva.value).replace(/\/api$/, '')
    const respuesta = await fetch(`${raiz}/health`, {
      headers: { 'ngrok-skip-browser-warning': '1' }
    })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
    const datos = await respuesta.json()
    pruebaOk.value = true
    resultadoPrueba.value = `Conexión exitosa: ${datos.service || 'API'} (${datos.status || 'ok'}).`
  } catch (e) {
    pruebaOk.value = false
    resultadoPrueba.value = 'No se pudo contactar al backend. Revisá la URL y que el túnel/servidor esté arriba.'
  } finally {
    probando.value = false
  }
}

onMounted(() => {
  // Modo transparente: /config-api?api=<url> guarda y confirma sin más clics
  const urlQuery = normalizarUrl(route.query.api)
  if (urlQuery) {
    if (esUrlValida(urlQuery)) {
      guardarUrlBaseApi(urlQuery)
      mensajeUrl.value = 'Dirección actualizada desde el enlace. Ya podés usar la tienda.'
    } else {
      errorForm.value = 'El parámetro ?api= no trae una URL válida.'
    }
  }
  refrescarEstado()
})
</script>

<style scoped>
.seccion-etiqueta {
  color: var(--kei-oliva-oscuro);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
