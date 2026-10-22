import { ref, computed } from 'vue'
import { getConfiguracionEnvio } from '../services/api'

// Política de envío de la tienda (costo fijo + mínimo para envío gratis).
// Es la misma para todo el sitio, así que el estado se comparte y se carga
// una sola vez: carrito y checkout muestran siempre el mismo desglose.
const envio = ref({ costo_envio: 0, minimo_envio_gratis: 0 })
const cargado = ref(false)
let promesaCarga = null

/**
 * Calcula el desglose del envío a partir de un subtotal.
 * @param {import('vue').Ref<number>} subtotal Subtotal del pedido (ref)
 */
export function useEnvio(subtotal) {
  const cargando = ref(false)

  const valorSubtotal = computed(() => Number(subtotal?.value ?? 0) || 0)

  async function cargarEnvio() {
    if (cargado.value) return envio.value
    if (!promesaCarga) {
      cargando.value = true
      promesaCarga = getConfiguracionEnvio()
        .then((r) => {
          envio.value = r.data || { costo_envio: 0, minimo_envio_gratis: 0 }
          cargado.value = true
          return envio.value
        })
        .catch((e) => {
          console.error('Error cargando la configuración de envío:', e)
          return envio.value
        })
        .finally(() => {
          promesaCarga = null
          cargando.value = false
        })
    }
    return promesaCarga
  }

  const envioGratis = computed(() =>
    envio.value.minimo_envio_gratis > 0 && valorSubtotal.value >= envio.value.minimo_envio_gratis
  )

  const costoEnvio = computed(() => (envioGratis.value ? 0 : envio.value.costo_envio))

  const total = computed(() => valorSubtotal.value + costoEnvio.value)

  const faltanParaEnvioGratis = computed(() => {
    if (envio.value.minimo_envio_gratis <= 0 || envioGratis.value) return 0
    return envio.value.minimo_envio_gratis - valorSubtotal.value
  })

  return {
    envio,
    cargando,
    envioGratis,
    costoEnvio,
    total,
    faltanParaEnvioGratis,
    cargarEnvio
  }
}
