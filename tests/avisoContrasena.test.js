import { describe, expect, it } from 'vitest'
import { mensajeAvisoContrasena } from '../src/utils/descargas.js'

describe('mensajeAvisoContrasena', () => {
  it('devuelve el aviso cuando se restableció la contraseña', () => {
    expect(mensajeAvisoContrasena({ passwordReset: 'success' })).toBe(
      'Tu contraseña fue restablecida. Ya puedes iniciar sesión.'
    )
  })

  it('devuelve vacío sin el parámetro', () => {
    expect(mensajeAvisoContrasena({})).toBe('')
    expect(mensajeAvisoContrasena()).toBe('')
  })
})
