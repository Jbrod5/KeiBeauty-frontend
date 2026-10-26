import { describe, expect, it } from 'vitest'
import {
  construirDescargaReporte,
  extraerNombreArchivo
} from '../src/utils/descargas.js'

describe('construirDescargaReporte', () => {
  it('construye la URL de Excel con los filtros como query', () => {
    const r = construirDescargaReporte('/reportes/ventas-totales', { desde: '2026-01-01', hasta: '2026-01-31' }, 'excel')
    expect(r.urlFinal).toBe('/reportes/ventas-totales?desde=2026-01-01&hasta=2026-01-31&excel=1')
    expect(r.nombrePorDefecto).toBe('ventas-totales.xlsx')
    expect(r.mime).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  })

  it('construye la URL de PDF con el parámetro pdf=1', () => {
    const r = construirDescargaReporte('/reportes/ganancias', {}, 'pdf')
    expect(r.urlFinal).toBe('/reportes/ganancias?pdf=1')
    expect(r.nombrePorDefecto).toBe('ganancias.pdf')
    expect(r.mime).toBe('application/pdf')
  })

  it('usa excel como formato por defecto ante un formato desconocido', () => {
    const r = construirDescargaReporte('/reportes/clientes-top', {}, 'otro')
    expect(r.urlFinal).toContain('excel=1')
    expect(r.nombrePorDefecto).toBe('clientes-top.xlsx')
  })
})

describe('extraerNombreArchivo', () => {
  it('extrae el filename del Content-Disposition', () => {
    expect(extraerNombreArchivo('attachment; filename="ventas_2026-01-01_2026-01-31.pdf"', 'ganancias.pdf'))
      .toBe('ventas_2026-01-01_2026-01-31.pdf')
  })

  it('usa el nombre por defecto si no hay header', () => {
    expect(extraerNombreArchivo(null, 'ventas-totales.xlsx')).toBe('ventas-totales.xlsx')
  })
})
