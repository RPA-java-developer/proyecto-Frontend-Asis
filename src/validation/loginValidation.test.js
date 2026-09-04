import { describe, it, expect } from 'vitest'
import { validateLoginForm } from './loginValidation'

describe('validateLoginForm', () => {
  it('no devuelve errores con datos válidos', () => {
    const errors = validateLoginForm({ username: 'admin', password: 'admin123' })
    expect(errors).toEqual({})
  })

  it('exige un usuario no vacío', () => {
    const errors = validateLoginForm({ username: '', password: 'admin123' })
    expect(errors.username).toBe('El usuario es requerido.')
  })

  it('exige un usuario no vacío aunque solo tenga espacios', () => {
    const errors = validateLoginForm({ username: '   ', password: 'admin123' })
    expect(errors.username).toBe('El usuario es requerido.')
  })

  it('exige al menos 3 caracteres en el usuario', () => {
    const errors = validateLoginForm({ username: 'ab', password: 'admin123' })
    expect(errors.username).toBe('El usuario debe tener al menos 3 caracteres.')
  })

  it('exige una contraseña no vacía', () => {
    const errors = validateLoginForm({ username: 'admin', password: '' })
    expect(errors.password).toBe('La contraseña es requerida.')
  })

  it('exige al menos 6 caracteres en la contraseña', () => {
    const errors = validateLoginForm({ username: 'admin', password: '12345' })
    expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres.')
  })

  it('reporta ambos errores si usuario y contraseña son inválidos', () => {
    const errors = validateLoginForm({ username: '', password: '' })
    expect(Object.keys(errors)).toEqual(['username', 'password'])
  })
})
