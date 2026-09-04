import { describe, it, expect } from 'vitest'
import { validateProductForm } from './productValidation'

const validForm = {
  productName: 'Chai',
  categoryID: '1',
  supplierID: '',
  quantityPerUnit: '10 boxes',
  unitPrice: '18.5',
  unitsInStock: '39',
  unitsOnOrder: '0',
  reorderLevel: '10',
  discontinued: false
}

describe('validateProductForm', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(validateProductForm(validForm)).toEqual({})
  })

  it('exige el nombre del producto', () => {
    const errors = validateProductForm({ ...validForm, productName: '' })
    expect(errors.productName).toBe('El nombre del producto es requerido.')
  })

  it('rechaza un nombre de más de 100 caracteres', () => {
    const errors = validateProductForm({ ...validForm, productName: 'a'.repeat(101) })
    expect(errors.productName).toBe('Máximo 100 caracteres.')
  })

  it('exige seleccionar una categoría', () => {
    const errors = validateProductForm({ ...validForm, categoryID: '' })
    expect(errors.categoryID).toBe('Selecciona una categoría.')
  })

  it('no exige proveedor (es opcional)', () => {
    const errors = validateProductForm({ ...validForm, supplierID: '' })
    expect(errors.supplierID).toBeUndefined()
  })

  it('rechaza un precio negativo', () => {
    const errors = validateProductForm({ ...validForm, unitPrice: '-5' })
    expect(errors.unitPrice).toBe('Debe ser un número mayor o igual a 0.')
  })

  it('acepta un precio vacío (opcional)', () => {
    const errors = validateProductForm({ ...validForm, unitPrice: '' })
    expect(errors.unitPrice).toBeUndefined()
  })

  it('rechaza unitsInStock negativo', () => {
    const errors = validateProductForm({ ...validForm, unitsInStock: '-1' })
    expect(errors.unitsInStock).toBe('Debe ser un entero mayor o igual a 0.')
  })

  it('rechaza unitsInStock no entero', () => {
    const errors = validateProductForm({ ...validForm, unitsInStock: '1.5' })
    expect(errors.unitsInStock).toBe('Debe ser un entero mayor o igual a 0.')
  })

  it('rechaza valores por encima del límite de short (32767)', () => {
    const errors = validateProductForm({ ...validForm, reorderLevel: '40000' })
    expect(errors.reorderLevel).toBe('No puede superar 32,767.')
  })

  it('rechaza quantityPerUnit de más de 50 caracteres', () => {
    const errors = validateProductForm({ ...validForm, quantityPerUnit: 'a'.repeat(51) })
    expect(errors.quantityPerUnit).toBe('Máximo 50 caracteres.')
  })
})
