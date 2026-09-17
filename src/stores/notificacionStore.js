import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useNotificacionStore = defineStore('notificacion', () => {
  const notificaciones = ref([])
  const noLeidas = ref(0)
  const loading = ref(false)

  const tieneNoLeidas = computed(() => noLeidas.value > 0)

  async function fetchNotificaciones() {
    try {
      loading.value = true
      const res = await api.get('/notificaciones')
      notificaciones.value = res.data.data || []
      noLeidas.value = res.data.no_leidas || 0
    } catch (e) {
      // Silenciar si no autenticado
    } finally {
      loading.value = false
    }
  }

  async function marcarLeida(id) {
    try {
      await api.put(`/notificaciones/${id}/leida`)
      const n = notificaciones.value.find(x => x.id === id)
      if (n && !n.leido) {
        n.leido = true
        noLeidas.value = Math.max(0, noLeidas.value - 1)
      }
    } catch {}
  }

  async function marcarTodasLeidas() {
    try {
      await api.put('/notificaciones/leer-todas')
      notificaciones.value.forEach(n => n.leido = true)
      noLeidas.value = 0
    } catch {}
  }

  return { notificaciones, noLeidas, tieneNoLeidas, loading, fetchNotificaciones, marcarLeida, marcarTodasLeidas }
})
