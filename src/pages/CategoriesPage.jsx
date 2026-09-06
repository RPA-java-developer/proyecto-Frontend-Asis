import { useEffect, useState } from 'react'
import { categoriesApi } from '../api/categories'
import { extractErrorMessage } from '../api/client'
import Drawer from '../components/Drawer'
import { Field, TextInput } from '../components/FormFields'

const emptyForm = { categoryName: '', description: '' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setCategories(await categoriesApi.getAll())
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setDrawerOpen(true)
  }

  function openEdit(category) {
    setEditingId(category.categoryID)
    setForm({
      categoryName: category.categoryName,
      description: category.description ?? '',
      picture: category.picture ?? ''
    })
    setError(null)
    setDrawerOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const dto = {
      categoryName: form.categoryName,
      description: form.description || null,
      picture: form.picture || null
    }

    try {
      if (editingId) {
        await categoriesApi.update(editingId, dto)
      } else {
        await categoriesApi.create(dto)
      }
      setDrawerOpen(false)
      await load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category) {
    if (!confirm(`¿Eliminar "${category.categoryName}"?`)) return
    try {
      await categoriesApi.remove(category.categoryID)
      await load()
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Categories</h1>
          <p className="text-sm text-slate mt-0.5">{categories.length} categorías</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-moss hover:bg-mossdark text-white text-sm font-medium px-4 py-2 rounded"
        >
          Add category
        </button>
      </div>

      {loading ? (
        <p className="text-slate text-sm">Cargando…</p>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-line rounded p-10 text-center text-slate">
          Todavía no hay categorías. Crea la primera.
        </div>
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-line text-left text-xs text-slate">
                <th className="px-4 py-2.5 font-medium">ID</th>
                <th className="px-4 py-2.5 font-medium">Picture</th>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Description</th>
                <th className="px-4 py-2.5 font-medium text-right">Products</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr
                  key={c.categoryID}
                  className={`border-b border-line last:border-0 ${i % 2 ? 'bg-white/50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2.5 font-mono tabular text-slate">{c.categoryID}</td>


                  <td className="px-4 py-2.5">
                    {c.picture ? (
                      <img
                        src={`/images/${c.picture}`}
                        alt={c.categoryName}
                        className="w-10 h-10 object-cover rounded border border-line bg-white"
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="w-10 h-10 rounded border border-dashed border-line bg-paper text-slate text-[10px] items-center justify-center"
                      style={{ display: c.picture ? 'none' : 'flex' }}
                    >
                      Sin imagen
                    </div>
                  </td>


                  <td className="px-4 py-2.5 text-ink font-medium">{c.categoryName}</td>
                  <td className="px-4 py-2.5 text-slate">{c.description || '—'}</td>
                  <td className="px-4 py-2.5 font-mono tabular text-right text-ink">{c.productCount}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(c)} className="text-slate hover:text-ink text-xs mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c)} className="text-slate hover:text-rust text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingId ? 'Edit category' : 'Add category'}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Category name" required>
            <TextInput
              required
              value={form.categoryName}
              onChange={e => setForm({ ...form, categoryName: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <TextInput
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </Field>


          <Field label="Picture">
            <TextInput
              placeholder="picture.png"  
              value={form.picture}
              onChange={e => setForm({ ...form, picture: e.target.value })}
            />
          </Field>          


          {form.picture && (
            <div className="mb-4">
              <span className="block text-xs font-medium text-slate mb-1">Vista previa</span>
              <img
                src={`/images/${form.picture}`} 
                
                alt="Vista previa"
                className="w-16 h-16 object-cover rounded border border-line bg-white"
                onError={e => { e.currentTarget.style.display = 'none' }}
                onLoad={e => { e.currentTarget.style.display = 'block' }}
              />
            </div>
          )}


          <button
            type="submit"
            disabled={saving}
            className="w-full bg-moss hover:bg-mossdark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded mt-2"
          >
            {saving ? 'Guardando…' : editingId ? 'Save changes' : 'Create category'}
          </button>
        </form>
      </Drawer>
    </div>
  )
}
