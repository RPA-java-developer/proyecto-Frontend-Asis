export const MAX_SMALLINT = 32767 // límite de short en el backend (UnitsInStock, UnitsOnOrder, ReorderLevel)

export function validateProductForm(form) {
  const errors = {}

  if (!form.productName.trim()) {
    errors.productName = 'El nombre del producto es requerido.'
  } else if (form.productName.trim().length > 100) {
    errors.productName = 'Máximo 100 caracteres.'
  }

  if (!form.categoryID) {
    errors.categoryID = 'Selecciona una categoría.'
  }

  if (form.quantityPerUnit && form.quantityPerUnit.length > 50) {
    errors.quantityPerUnit = 'Máximo 50 caracteres.'
  }

  if (form.unitPrice !== '') {
    const price = Number(form.unitPrice)
    if (Number.isNaN(price) || price < 0) {
      errors.unitPrice = 'Debe ser un número mayor o igual a 0.'
    }
  }

  for (const field of ['unitsInStock', 'unitsOnOrder', 'reorderLevel']) {
    if (form[field] === '') continue
    const value = Number(form[field])
    if (!Number.isInteger(value) || value < 0) {
      errors[field] = 'Debe ser un entero mayor o igual a 0.'
    } else if (value > MAX_SMALLINT) {
      errors[field] = `No puede superar ${MAX_SMALLINT.toLocaleString('en-US')}.`
    }
  }

  return errors
}
