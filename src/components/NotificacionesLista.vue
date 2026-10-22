<template>
  <div class="notificaciones-lista">
    <div v-if="compacto" class="d-flex justify-content-between align-items-center px-1 pb-2">
      <span class="fw-bold small">Notificaciones</span>
      <button
        v-if="notifStore.noLeidas > 0"
        @click="notifStore.marcarTodasLeidas()"
        class="btn btn-sm btn-link p-0"
        style="font-size:0.7rem; color: var(--kei-oliva);"
      >Marcar todas</button>
    </div>

    <div v-if="notifStore.notificaciones.length === 0" class="text-center py-3 small" style="color: var(--kei-gris-medio);">
      Sin notificaciones
    </div>

    <div
      v-for="n in notifStore.notificaciones"
      :key="n.id"
      class="px-2 py-1"
      :style="n.leido ? 'opacity:0.7;' : 'background: var(--kei-oliva-suave);'"
    >
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1" @click="handleNotifClick(n)" style="cursor:pointer;">
          <div class="small fw-semibold" style="color: var(--kei-casi-negro);">
            <i :class="iconoNotif(n.tipo)" class="me-1" style="color: var(--kei-oliva);"></i>{{ n.titulo }}
          </div>
          <div class="small" style="color: var(--kei-gris-medio);">{{ n.mensaje }}</div>
          <small style="color: var(--kei-beige-medio);">{{ formatFecha(n.fecha_creacion) }}</small>
        </div>
        <button
          v-if="!n.leido"
          @click.stop="notifStore.marcarLeida(n.id)"
          class="btn btn-sm ms-2"
          title="Marcar leída"
          style="color: var(--kei-oliva);"
        >
          <i class="bi bi-check2-circle"></i>
        </button>
      </div>
      <hr class="my-1" style="border-color: var(--kei-gris-claro);" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNotificacionStore } from '../stores/notificacionStore'

// La lista de notificaciones se usa en dos lugares: el desplegable de la
// campana (escritorio) y el panel dentro del menu del perfil (movil).
const props = defineProps({
  compacto: { type: Boolean, default: false }
})

const router = useRouter()
const notifStore = useNotificacionStore()

function iconoNotif(tipo) {
  if (tipo === 'pedido_estado') return 'bi bi-box-seam'
  if (tipo === 'pedido_guia') return 'bi bi-truck'
  if (tipo === 'producto_stock') return 'bi bi-bell'
  return 'bi bi-info-circle'
}

function formatFecha(f) {
  if (!f) return ''
  return new Date(f).toLocaleString('es-GT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function handleNotifClick(n) {
  notifStore.marcarLeida(n.id)
  if (n.datos?.pedido_id) {
    router.push(`/mis-pedidos/${n.datos.pedido_id}`)
  } else if (n.datos?.producto_id) {
    router.push(`/producto/${n.datos.producto_id}`)
  }
}
</script>
