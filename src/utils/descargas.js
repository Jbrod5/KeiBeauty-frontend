export const FORMATO_REPORTE = {
  excel: {
    parametro: 'excel',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx'
  },
  pdf: {
    parametro: 'pdf',
    mime: 'application/pdf',
    extension: '.pdf'
  }
}

export function formatoReporte(formato = 'excel') {
  return FORMATO_REPORTE[formato] || FORMATO_REPORTE.excel
}

/**
 * Construye la URL de descarga y los metadatos del archivo para un reporte.
 * Función pura (sin axios ni DOM) para poder probarla con vitest.
 */
export function construirDescargaReporte(url, params = {}, formato = 'excel') {
  const { parametro, mime, extension } = formatoReporte(formato)
  const qs = new URLSearchParams({ ...params, [parametro]: '1' }).toString()
  const base = String(url).split('/').filter(Boolean).pop() || 'reporte'
  return {
    urlFinal: `${url}?${qs}`,
    nombrePorDefecto: `${base}${extension}`,
    mime
  }
}

/** Extrae el filename del header Content-Disposition o usa el valor por defecto. */
export function extraerNombreArchivo(contentDisposition, nombrePorDefecto) {
  if (!contentDisposition) return nombrePorDefecto
  const m = String(contentDisposition).match(/filename="?([^"]+)"?/)
  return m ? m[1] : nombrePorDefecto
}

/**
 * Aviso para mostrar en el login cuando se llega con ?passwordReset=success
 * tras restablecer la contraseña.
 */
export function mensajeAvisoContrasena(query = {}) {
  if (query && query.passwordReset === 'success') {
    return 'Tu contraseña fue restablecida. Ya puedes iniciar sesión.'
  }
  return ''
}
