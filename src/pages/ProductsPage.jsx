import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsApi } from '../api/products'
import { categoriesApi } from '../api/categories'
import { suppliersApi } from '../api/suppliers'
import { extractErrorMessage } from '../api/client'
import Drawer from '../components/Drawer'
import { Field, FieldError, TextInput, NumberInput, Checkbox, Select } from '../components/FormFields'

const MAX_SMALLINT = 32767 // límite de short en el backend (UnitsInStock, UnitsOnOrder, ReorderLevel)

const emptyForm = {
  productName: '',
  categoryID: '',
  supplierID: '',
  quantityPerUnit: '',
  unitPrice: '',
  unitsInStock: '',
  unitsOnOrder: '',
  reorderLevel: '',
  discontinued: false
}

function validateProductForm(form) {
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

  for (const [field, label] of [
    ['unitsInStock', 'Units in stock'],
    ['unitsOnOrder', 'Units on order'],
    ['reorderLevel', 'Reorder level']
  ]) {
    if (form[field] === '') continue
    const value = Number(form[field])
    if (!Number.isInteger(value) || value < 0) {
      errors[field] = 'Debe ser un entero mayor o igual a 0.'
    } else if (value > MAX_SMALLINT) {
      errors[field] = `No puede superar ${MAX_SMALLINT.toLocaleString()}.`
    }
  }

  return errors
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Paginación
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  // Búsqueda y filtro
  const [searchInput, setSearchInput] = useState('') // lo que el usuario escribe
  const [searchTerm, setSearchTerm] = useState('')    // versión con debounce, la que se envía
  const [categoryFilter, setCategoryFilter] = useState('')

  // Mapas ID -> nombre, ya que el endpoint paginado no trae los nombres
  // de categoría/proveedor embebidos (category/supplier vienen null)
  const categoryNameById = Object.fromEntries(categories.map(c => [c.categoryID, c.categoryName]))
  const supplierNameById = Object.fromEntries(suppliers.map(s => [s.supplierID, s.companyName]))

  async function loadCatalogs() {
    try {
      const [c, s] = await Promise.all([categoriesApi.getAll(), suppliersApi.getAll()])
      setCategories(c)
      setSuppliers(s)
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  async function loadProducts(page = pageNumber) {
    setLoading(true)
    try {
      const result = await productsApi.getPaginated(page, pageSize, {
        searchTerm,
        categoryID: categoryFilter
      })
      setProducts(result.data)
      setPageNumber(result.currentPage)
      setTotalPages(result.totalPages)
      setTotalCount(result.totalCount)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCatalogs()
  }, [])

  // Debounce: espera 400ms tras dejar de escribir antes de buscar
  useEffect(() => {
    const timeout = setTimeout(() => setSearchTerm(searchInput), 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  // Vuelve a cargar desde la página 1 cada vez que cambia la búsqueda o el filtro
  useEffect(() => {
    loadProducts(1)
  }, [searchTerm, categoryFilter])

  function goToPage(page) {
    if (page < 1 || page > totalPages) return
    loadProducts(page)
  }

  function clearFilters() {
    setSearchInput('')
    setCategoryFilter('')
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFieldErrors({})
    setError(null)
    setDrawerOpen(true)
  }

  function openEdit(product) {
    setEditingId(product.productID)
    setForm({
      productName: product.productName,
      categoryID: product.categoryID,
      supplierID: product.supplierID ?? '',
      quantityPerUnit: product.quantityPerUnit ?? '',
      unitPrice: product.unitPrice ?? '',
      unitsInStock: product.unitsInStock ?? '',
      unitsOnOrder: product.unitsOnOrder ?? '',
      reorderLevel: product.reorderLevel ?? '',
      discontinued: product.discontinued
    })
    setFieldErrors({})
    setError(null)
    setDrawerOpen(true)
  }

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(fe => ({ ...fe, [field]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const errors = validateProductForm(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSaving(true)

    const dto = {
      productName: form.productName,
      categoryID: Number(form.categoryID),
      supplierID: form.supplierID === '' ? null : Number(form.supplierID),
      quantityPerUnit: form.quantityPerUnit || null,
      unitPrice: form.unitPrice === '' ? null : Number(form.unitPrice),
      unitsInStock: form.unitsInStock === '' ? null : Number(form.unitsInStock),
      unitsOnOrder: form.unitsOnOrder === '' ? null : Number(form.unitsOnOrder),
      reorderLevel: form.reorderLevel === '' ? null : Number(form.reorderLevel),
      discontinued: form.discontinued
    }

    try {
      if (editingId) {
        await productsApi.update(editingId, dto)
      } else {
        await productsApi.create(dto)
      }
      setDrawerOpen(false)
      await loadProducts(editingId ? pageNumber : 1)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!confirm(`¿Eliminar "${product.productName}"?`)) return
    try {
      await productsApi.remove(product.productID)
      await loadProducts(pageNumber)
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Products</h1>
          <p className="text-sm text-slate mt-0.5">{totalCount.toLocaleString()} productos en el catálogo</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/products/bulk-import')}
            className="border border-line hover:bg-white text-ink text-sm font-medium px-4 py-2 rounded"
          >
            Bulk import
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="bg-moss hover:bg-mossdark text-white text-sm font-medium px-4 py-2 rounded"
          >
            Add product
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="flex-1 max-w-xs px-3 py-2 border border-line rounded bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-line rounded bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
          ))}
        </select>

        {(searchInput || categoryFilter) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-slate hover:text-ink"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate text-sm">Cargando…</p>
      ) : products.length === 0 ? (
        <div className="border border-dashed border-line rounded p-10 text-center text-slate">
          {searchInput || categoryFilter
            ? 'No se encontraron productos con esos filtros.'
            : 'Todavía no hay productos. Crea el primero.'}
        </div>
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-line text-left text-xs text-slate">
                <th className="px-4 py-2.5 font-medium">ID</th>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Supplier</th>
                <th className="px-4 py-2.5 font-medium text-right">Price</th>
                <th className="px-4 py-2.5 font-medium text-right">Stock</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.productID}
                  className={`border-b border-line last:border-0 ${i % 2 ? 'bg-white/50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2.5 font-mono tabular text-slate">{p.productID}</td>
                  <td className="px-4 py-2.5 text-ink">
                    {p.productName}
                    {p.discontinued && (
                      <span className="ml-2 text-xs text-rust">discontinued</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-ink">{categoryNameById[p.categoryID] || `#${p.categoryID}`}</td>
                  <td className="px-4 py-2.5 text-ink">
                    {p.supplierID ? (supplierNameById[p.supplierID] || `#${p.supplierID}`) : '—'}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular text-right text-ink">
                    {p.unitPrice != null ? `$${p.unitPrice.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular text-right text-ink">
                    {p.unitsInStock ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-slate hover:text-ink text-xs mr-3"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="text-slate hover:text-rust text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-slate">
            Página {pageNumber} de {totalPages.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              className="px-3 py-1.5 border border-line rounded text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= totalPages}
              className="px-3 py-1.5 border border-line rounded text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit product' : 'Add product'}
      >
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Product name" required>
            <TextInput
              hasError={!!fieldErrors.productName}
              value={form.productName}
              onChange={e => updateField('productName', e.target.value)}
            />
            <FieldError message={fieldErrors.productName} />
          </Field>

          <Field label="Category" required>
            <Select
              hasError={!!fieldErrors.categoryID}
              value={form.categoryID}
              onChange={e => updateField('categoryID', e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
              ))}
            </Select>
            <FieldError message={fieldErrors.categoryID} />
          </Field>

          <Field label="Supplier">
            <Select
              value={form.supplierID}
              onChange={e => updateField('supplierID', e.target.value)}
            >
              <option value="">Sin proveedor</option>
              {suppliers.map(s => (
                <option key={s.supplierID} value={s.supplierID}>{s.companyName}</option>
              ))}
            </Select>
          </Field>

          <Field label="Quantity per unit">
            <TextInput
              placeholder="ej. 12 - 500 g pkgs"
              hasError={!!fieldErrors.quantityPerUnit}
              value={form.quantityPerUnit}
              onChange={e => updateField('quantityPerUnit', e.target.value)}
            />
            <FieldError message={fieldErrors.quantityPerUnit} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Unit price">
              <NumberInput
                step="0.01"
                hasError={!!fieldErrors.unitPrice}
                value={form.unitPrice}
                onChange={e => updateField('unitPrice', e.target.value)}
              />
              <FieldError message={fieldErrors.unitPrice} />
            </Field>
            <Field label="Units in stock">
              <NumberInput
                hasError={!!fieldErrors.unitsInStock}
                value={form.unitsInStock}
                onChange={e => updateField('unitsInStock', e.target.value)}
              />
              <FieldError message={fieldErrors.unitsInStock} />
            </Field>
            <Field label="Units on order">
              <NumberInput
                hasError={!!fieldErrors.unitsOnOrder}
                value={form.unitsOnOrder}
                onChange={e => updateField('unitsOnOrder', e.target.value)}
              />
              <FieldError message={fieldErrors.unitsOnOrder} />
            </Field>
            <Field label="Reorder level">
              <NumberInput
                hasError={!!fieldErrors.reorderLevel}
                value={form.reorderLevel}
                onChange={e => updateField('reorderLevel', e.target.value)}
              />
              <FieldError message={fieldErrors.reorderLevel} />
            </Field>
          </div>

          <Checkbox
            label="Discontinued"
            checked={form.discontinued}
            onChange={e => setForm({ ...form, discontinued: e.target.checked })}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-moss hover:bg-mossdark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded mt-2"
          >
            {saving ? 'Guardando…' : editingId ? 'Save changes' : 'Create product'}
          </button>
        </form>
      </Drawer>
    </div>
  )
}
