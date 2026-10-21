<template>
  <div class="container py-4" style="max-width: 880px;">
    <header class="text-center mb-4 py-3">
      <h1 class="fw-bold" style="color: var(--kei-casi-negro);">Mi Perfil</h1>
      <p style="color: var(--kei-gris-medio);">Gestiona tu información personal</p>
    </header>

    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style="min-height: 300px;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p style="color: var(--kei-gris-medio);">Cargando perfil...</p>
    </div>

    <div v-else>
      <div class="card shadow-sm overflow-hidden">
        <!-- Avatar header -->
        <div class="card-body text-center p-4 p-md-5" style="background-color: var(--kei-fondo); border-bottom: 1px solid var(--kei-gris-claro);">
          <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm fw-bold fs-1 text-white" style="width: 96px; height: 96px; background-color: var(--kei-gris-oscuro);">
            {{ userInitial }}
          </div>
          <h2 class="h4 fw-bold mb-1" style="color: var(--kei-casi-negro);">{{ userName }}</h2>
          <p class="mb-2" style="color: var(--kei-gris-medio);">{{ userEmail }}</p>
          <span class="badge rounded-pill text-uppercase px-3 py-2" :class="isAdmin ? 'bg-primary' : 'bg-secondary'" style="letter-spacing: 0.05em; font-size: 0.75rem;">
            <i :class="isAdmin ? 'bi bi-shield-check me-1' : 'bi bi-person me-1'"></i>
            {{ isAdmin ? 'Administrador' : 'Cliente' }}
          </span>
        </div>

        <div class="card-body p-4">
          <!-- Información Personal -->
          <div class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-person-lines-fill me-2" style="color: var(--kei-beige);"></i>Información Personal
            </h3>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Nombre</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ userName }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Email</div>
                    <div class="fw-medium text-break" style="color: var(--kei-casi-negro);">{{ userEmail }}</div>
                  </div>
                </div>
              </div>
              <div v-if="telefono" class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Teléfono</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ telefono }}</div>
                  </div>
                </div>
              </div>
              <div v-if="direccion_envio" class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Dirección de envío</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ direccion_envio }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Rol</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ isAdmin ? 'Administrador' : 'Cliente' }}</div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="card h-100" style="background-color: var(--kei-fondo) !important;">
                  <div class="card-body py-3">
                    <div class="small text-uppercase fw-medium mb-1" style="color: var(--kei-beige-medio); letter-spacing: 0.05em; font-size: 0.75rem;">Miembro desde</div>
                    <div class="fw-medium" style="color: var(--kei-casi-negro);">{{ formatDate(fecha_registro) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mis direcciones -->
          <div class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-geo-alt me-2" style="color: var(--kei-beige);"></i>Mis direcciones
            </h3>

            <div v-if="cargandoDirecciones" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Cargando direcciones...</span></div>
            </div>

            <div v-else-if="direcciones.length === 0" class="card" style="background-color: var(--kei-fondo) !important;">
              <div class="card-body py-3 text-center">
                <small style="color: var(--kei-gris-medio);">Todavía no tienes direcciones guardadas. Agrega una para usarla más rápido en tus pedidos.</small>
              </div>
            </div>

            <div v-else class="row g-3 mb-3">
              <div v-for="dir in direcciones" :key="dir.id" class="col-12 col-md-6">
                <div class="card h-100" :style="dir.es_principal ? 'border: 2px solid var(--kei-oliva) !important;' : ''">
                  <div class="card-body py-3">
                    <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div class="fw-medium" style="color: var(--kei-casi-negro);">
                        <i class="bi bi-pin-map me-1" style="color: var(--kei-beige);"></i>{{ dir.alias || 'Dirección' }}
                      </div>
                      <span v-if="dir.es_principal" class="badge rounded-pill" style="background: var(--kei-oliva); font-size: 0.65rem;">Principal</span>
                    </div>
                    <p class="small mb-3" style="color: var(--kei-gris-medio);">{{ dir.direccion }}</p>
                    <div class="d-flex flex-wrap gap-2">
                      <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill" @click="editarDireccion(dir)">
                        <i class="bi bi-pencil me-1"></i>Editar
                      </button>
                      <button v-if="!dir.es_principal" type="button" class="btn btn-outline-primary btn-sm rounded-pill" @click="marcarDireccionPrincipal(dir)">
                        <i class="bi bi-star me-1"></i>Principal
                      </button>
                      <button type="button" class="btn btn-outline-danger btn-sm rounded-pill" @click="eliminarDireccion(dir)">
                        <i class="bi bi-trash me-1"></i>Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form @submit.prevent="guardarDireccion" class="card" style="background-color: var(--kei-fondo) !important;">
              <div class="card-body py-3">
                <h6 class="fw-semibold mb-3" style="color: var(--kei-casi-negro);">
                  <i class="bi bi-plus-circle me-1" style="color: var(--kei-oliva);"></i>{{ editandoDireccionId ? 'Editar dirección' : 'Agregar dirección' }}
                </h6>
                <div class="row g-2 mb-2">
                  <div class="col-12 col-md-4">
                    <label class="form-label small mb-1" for="aliasDireccion">Alias</label>
                    <input id="aliasDireccion" v-model="formDireccion.alias" maxlength="50" class="form-control" placeholder="Casa, Oficina..." />
                  </div>
                  <div class="col-12 col-md-8">
                    <label class="form-label small mb-1" for="direccionNueva">Dirección completa *</label>
                    <textarea id="direccionNueva" v-model="formDireccion.direccion" rows="2" required minlength="10" class="form-control" placeholder="Calle, zona, ciudad"></textarea>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" :disabled="guardandoDireccion" class="btn btn-primary btn-sm rounded-pill">
                    <span v-if="guardandoDireccion" class="spinner-border spinner-border-sm me-1"></span>
                    <i class="bi bi-check-lg me-1"></i>{{ editandoDireccionId ? 'Guardar cambios' : 'Agregar dirección' }}
                  </button>
                  <button v-if="editandoDireccionId" type="button" class="btn btn-outline-secondary btn-sm rounded-pill" @click="cancelarEdicionDireccion">Cancelar</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Mis teléfonos -->
          <div class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-telephone me-2" style="color: var(--kei-beige);"></i>Mis teléfonos
            </h3>

            <div v-if="cargandoTelefonos" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Cargando teléfonos...</span></div>
            </div>

            <div v-else-if="telefonos.length === 0" class="card" style="background-color: var(--kei-fondo) !important;">
              <div class="card-body py-3 text-center">
                <small style="color: var(--kei-gris-medio);">Todavía no tienes teléfonos guardados. Agrega uno para usarlo en tus pedidos.</small>
              </div>
            </div>

            <div v-else class="row g-3 mb-3">
              <div v-for="tel in telefonos" :key="tel.id" class="col-12 col-md-6">
                <div class="card h-100" :style="tel.es_principal ? 'border: 2px solid var(--kei-oliva) !important;' : ''">
                  <div class="card-body py-3">
                    <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div class="fw-medium" style="color: var(--kei-casi-negro);">
                        <i class="bi bi-phone me-1" style="color: var(--kei-beige);"></i>{{ tel.telefono }}
                      </div>
                      <span v-if="tel.es_principal" class="badge rounded-pill" style="background: var(--kei-oliva); font-size: 0.65rem;">Principal</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill" @click="editarTelefono(tel)">
                        <i class="bi bi-pencil me-1"></i>Editar
                      </button>
                      <button v-if="!tel.es_principal" type="button" class="btn btn-outline-primary btn-sm rounded-pill" @click="marcarTelefonoPrincipal(tel)">
                        <i class="bi bi-star me-1"></i>Principal
                      </button>
                      <button type="button" class="btn btn-outline-danger btn-sm rounded-pill" @click="eliminarTelefono(tel)">
                        <i class="bi bi-trash me-1"></i>Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form @submit.prevent="guardarTelefono" class="card" style="background-color: var(--kei-fondo) !important;">
              <div class="card-body py-3">
                <h6 class="fw-semibold mb-3" style="color: var(--kei-casi-negro);">
                  <i class="bi bi-plus-circle me-1" style="color: var(--kei-oliva);"></i>{{ editandoTelefonoId ? 'Editar teléfono' : 'Agregar teléfono' }}
                </h6>
                <div class="row g-2 mb-2">
                  <div class="col-12 col-md-6">
                    <label class="form-label small mb-1" for="telefonoNuevo">Teléfono *</label>
                    <input id="telefonoNuevo" v-model="formTelefono.telefono" type="tel" required class="form-control" placeholder="50239718418" />
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" :disabled="guardandoTelefono" class="btn btn-primary btn-sm rounded-pill">
                    <span v-if="guardandoTelefono" class="spinner-border spinner-border-sm me-1"></span>
                    <i class="bi bi-check-lg me-1"></i>{{ editandoTelefonoId ? 'Guardar cambios' : 'Agregar teléfono' }}
                  </button>
                  <button v-if="editandoTelefonoId" type="button" class="btn btn-outline-secondary btn-sm rounded-pill" @click="cancelarEdicionTelefono">Cancelar</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Seguridad -->
          <div class="mb-4 pb-3 border-bottom" style="border-color: var(--kei-gris-claro) !important;">
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-shield-lock me-2" style="color: var(--kei-beige);"></i>Seguridad
            </h3>

            <div class="card" style="background-color: var(--kei-fondo) !important;">
              <div class="card-body py-3">
                <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                  <div class="flex-grow-1 me-3">
                    <div class="fw-medium d-flex align-items-center gap-2" style="color: var(--kei-casi-negro);">
                      <i class="bi bi-key"></i>
                      Verificación en dos pasos (2FA)
                      <span class="badge rounded-pill" :class="twoFactorEnabled ? 'bg-success' : 'bg-secondary'" style="font-size: 0.7rem;">
                        {{ twoFactorEnabled ? 'Activado' : 'Desactivado' }}
                      </span>
                    </div>
                    <small style="color: var(--kei-gris-medio);">
                      Al iniciar sesión te enviamos un código de 6 dígitos a tu correo para verificar que eres tú.
                    </small>
                  </div>
                  <div class="form-check form-switch mb-0">
                    <input
                      id="switch2fa"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      :checked="twoFactorEnabled"
                      :disabled="guardando2FA"
                      @change="toggle2FA"
                      aria-label="Activar o desactivar la verificación en dos pasos"
                      style="width: 3rem; height: 1.6rem;"
                    />
                  </div>
                </div>
                <div v-if="guardando2FA" class="d-flex align-items-center gap-2 mt-2">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <small style="color: var(--kei-gris-medio);">Actualizando...</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div>
            <h3 class="h6 fw-bold d-inline-block pb-2 mb-3" style="color: var(--kei-casi-negro); border-bottom: 2px solid var(--kei-beige-medio);">
              <i class="bi bi-lightning me-2" style="color: var(--kei-beige);"></i>Acciones Rápidas
            </h3>
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <router-link to="/mis-pedidos" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-box-seam fs-5"></i>
                  <span>Mis Pedidos</span>
                </router-link>
              </div>
              <div class="col-12 col-md-4">
                <router-link to="/perfil/favoritos" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-heart fs-5"></i>
                  <span>Mis Favoritos</span>
                </router-link>
              </div>
              <div class="col-12 col-md-4">
                <router-link to="/catalogo" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <i class="bi bi-bag fs-5"></i>
                  <span>Seguir Comprando</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/authStore'
import {
  getDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion as eliminarDireccionApi,
  getTelefonos,
  crearTelefono,
  actualizarTelefono,
  eliminarTelefono as eliminarTelefonoApi
} from '../services/api'

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const guardando2FA = ref(false)

// Direcciones y teléfonos guardados en la cuenta
const direcciones = ref([])
const telefonos = ref([])
const cargandoDirecciones = ref(true)
const cargandoTelefonos = ref(true)
const guardandoDireccion = ref(false)
const guardandoTelefono = ref(false)
const editandoDireccionId = ref(null)
const editandoTelefonoId = ref(null)
const formDireccion = ref({ alias: '', direccion: '' })
const formTelefono = ref({ telefono: '' })

const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email || '')
const isAdmin = computed(() => authStore.isAdmin)
const userInitial = computed(() => authStore.user?.nombre?.charAt(0)?.toUpperCase() || 'U')
const telefono = computed(() => authStore.user?.telefono || '')
const direccion_envio = computed(() => authStore.user?.direccion_envio || '')
const fecha_registro = computed(() => authStore.user?.fecha_registro || '')
const twoFactorEnabled = computed(() => authStore.user?.two_factor_enabled === true)

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function toggle2FA() {
  const activar = !twoFactorEnabled.value
  const mensaje = activar
    ? '¿Activar la verificación en dos pasos? Te pediremos un código cada vez que inicies sesión.'
    : '¿Desactivar la verificación en dos pasos? Tu cuenta quedará menos protegida.'
  if (!confirm(mensaje)) {
    // Si el usuario cancela hay que devolver el switch a su estado anterior
    const input = document.getElementById('switch2fa')
    if (input) input.checked = twoFactorEnabled.value
    return
  }

  guardando2FA.value = true
  const result = activar
    ? await authStore.activar2FA()
    : await authStore.desactivar2FA()
  guardando2FA.value = false

  if (result.success) {
    toast.success(
      activar ? 'Verificación en dos pasos activada' : 'Verificación en dos pasos desactivada'
    )
  } else {
    toast.error(result.error || 'No se pudo actualizar la verificación en dos pasos')
    // Revertir el switch visual
    const input = document.getElementById('switch2fa')
    if (input) input.checked = twoFactorEnabled.value
  }
}

async function loadProfile() {
  loading.value = true
  try {
    if (authStore.accessToken.value && !authStore.user.value) {
      await authStore.fetchProfile()
    }
  } catch (err) {
    console.error('Error loading profile:', err)
  } finally {
    loading.value = false
  }
}

// --- Direcciones ---
async function cargarDirecciones() {
  cargandoDirecciones.value = true
  try {
    const r = await getDirecciones()
    direcciones.value = r.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudieron cargar las direcciones')
  } finally {
    cargandoDirecciones.value = false
  }
}

function editarDireccion(dir) {
  editandoDireccionId.value = dir.id
  formDireccion.value = { alias: dir.alias || '', direccion: dir.direccion || '' }
}

function cancelarEdicionDireccion() {
  editandoDireccionId.value = null
  formDireccion.value = { alias: '', direccion: '' }
}

async function guardarDireccion() {
  guardandoDireccion.value = true
  try {
    const payload = {
      alias: formDireccion.value.alias?.trim() || null,
      direccion: formDireccion.value.direccion.trim()
    }
    if (editandoDireccionId.value) {
      await actualizarDireccion(editandoDireccionId.value, payload)
      toast.success('Dirección actualizada')
    } else {
      await crearDireccion(payload)
      toast.success('Dirección guardada')
    }
    cancelarEdicionDireccion()
    await cargarDirecciones()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo guardar la dirección')
  } finally {
    guardandoDireccion.value = false
  }
}

async function marcarDireccionPrincipal(dir) {
  try {
    await actualizarDireccion(dir.id, { es_principal: true })
    toast.success('Dirección principal actualizada')
    await cargarDirecciones()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo actualizar la dirección principal')
  }
}

async function eliminarDireccion(dir) {
  if (!confirm('¿Eliminar esta dirección?')) return
  try {
    await eliminarDireccionApi(dir.id)
    toast.success('Dirección eliminada')
    await cargarDirecciones()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo eliminar la dirección')
  }
}

// --- Teléfonos ---
async function cargarTelefonos() {
  cargandoTelefonos.value = true
  try {
    const r = await getTelefonos()
    telefonos.value = r.data || []
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudieron cargar los teléfonos')
  } finally {
    cargandoTelefonos.value = false
  }
}

function editarTelefono(tel) {
  editandoTelefonoId.value = tel.id
  formTelefono.value = { telefono: tel.telefono || '' }
}

function cancelarEdicionTelefono() {
  editandoTelefonoId.value = null
  formTelefono.value = { telefono: '' }
}

async function guardarTelefono() {
  guardandoTelefono.value = true
  try {
    const payload = { telefono: formTelefono.value.telefono.trim() }
    if (editandoTelefonoId.value) {
      await actualizarTelefono(editandoTelefonoId.value, payload)
      toast.success('Teléfono actualizado')
    } else {
      await crearTelefono(payload)
      toast.success('Teléfono guardado')
    }
    cancelarEdicionTelefono()
    await cargarTelefonos()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo guardar el teléfono')
  } finally {
    guardandoTelefono.value = false
  }
}

async function marcarTelefonoPrincipal(tel) {
  try {
    await actualizarTelefono(tel.id, { es_principal: true })
    toast.success('Teléfono principal actualizado')
    await cargarTelefonos()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo actualizar el teléfono principal')
  }
}

async function eliminarTelefono(tel) {
  if (!confirm('¿Eliminar este teléfono?')) return
  try {
    await eliminarTelefonoApi(tel.id)
    toast.success('Teléfono eliminado')
    await cargarTelefonos()
    await refrescarPerfil()
  } catch (err) {
    toast.error(err.response?.data?.message || 'No se pudo eliminar el teléfono')
  }
}

// Refresca los datos del usuario en el store (dirección/teléfono principal)
async function refrescarPerfil() {
  try {
    await authStore.fetchProfile()
  } catch (err) {
    console.error('Error refrescando perfil:', err)
  }
}

onMounted(async () => {
  await loadProfile()
  await Promise.all([cargarDirecciones(), cargarTelefonos()])
})
</script>

<style scoped>
</style>
