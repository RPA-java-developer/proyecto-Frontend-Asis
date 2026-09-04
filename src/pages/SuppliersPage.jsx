import { useEffect, useState } from 'react'
import { suppliersApi } from '../api/suppliers'
import { extractErrorMessage } from '../api/client'
import Drawer from '../components/Drawer'
import { Field, TextInput } from '../components/FormFields'

const emptyForm = {
  companyName: '', contactName: '', contactTitle: '', address: '',
  city: '', region: '', postalCode: '', country: '',
  phone: '', fax: '', homePage: ''
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setSuppliers(await suppliersApi.getAll())
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

  function openEdit(supplier) {
    setEditingId(supplier.supplierID)
    setForm({
      companyName: supplier.companyName,
      contactName: supplier.contactName ?? '',
      contactTitle: supplier.contactTitle ?? '',
      address: supplier.address ?? '',
      city: supplier.city ?? '',
      region: supplier.region ?? '',
      postalCode: supplier.postalCode ?? '',
      country: supplier.country ?? '',
      phone: supplier.phone ?? '',
      fax: supplier.fax ?? '',
      homePage: supplier.homePage ?? ''
    })
    setError(null)
    setDrawerOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const dto = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    )
    dto.companyName = form.companyName // requerido, nunca null

    try {
      if (editingId) {
        await suppliersApi.update(editingId, dto)
      } else {
        await suppliersApi.create(dto)
      }
      setDrawerOpen(false)
      await load()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(supplier) {
    if (!confirm(`¿Eliminar "${supplier.companyName}"?`)) return
    try {
      await suppliersApi.remove(supplier.supplierID)
      await load()
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Suppliers</h1>
          <p className="text-sm text-slate mt-0.5">{suppliers.length} proveedores</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-moss hover:bg-mossdark text-white text-sm font-medium px-4 py-2 rounded"
        >
          Add supplier
        </button>
      </div>

      {loading ? (
        <p className="text-slate text-sm">Cargando…</p>
      ) : suppliers.length === 0 ? (
        <div className="border border-dashed border-line rounded p-10 text-center text-slate">
          Todavía no hay proveedores. Crea el primero.
        </div>
      ) : (
        <div className="border border-line rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white border-b border-line text-left text-xs text-slate">
                <th className="px-4 py-2.5 font-medium">ID</th>
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-4 py-2.5 font-medium">Contact</th>
                <th className="px-4 py-2.5 font-medium">City / Country</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium text-right">Products</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr
                  key={s.supplierID}
                  className={`border-b border-line last:border-0 ${i % 2 ? 'bg-white/50' : 'bg-white'}`}
                >
                  <td className="px-4 py-2.5 font-mono tabular text-slate">{s.supplierID}</td>
                  <td className="px-4 py-2.5 text-ink font-medium">{s.companyName}</td>
                  <td className="px-4 py-2.5 text-slate">{s.contactName || '—'}</td>
                  <td className="px-4 py-2.5 text-slate">
                    {[s.city, s.country].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular text-slate">{s.phone || '—'}</td>
                  <td className="px-4 py-2.5 font-mono tabular text-right text-ink">{s.productCount}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-slate hover:text-ink text-xs mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-slate hover:text-rust text-xs">
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
        title={editingId ? 'Edit supplier' : 'Add supplier'}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Company name" required>
            <TextInput
              required
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact name">
              <TextInput
                value={form.contactName}
                onChange={e => setForm({ ...form, contactName: e.target.value })}
              />
            </Field>
            <Field label="Contact title">
              <TextInput
                value={form.contactTitle}
                onChange={e => setForm({ ...form, contactTitle: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Address">
            <TextInput
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <TextInput
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </Field>
            <Field label="Region">
              <TextInput
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
              />
            </Field>
            <Field label="Postal code">
              <TextInput
                value={form.postalCode}
                onChange={e => setForm({ ...form, postalCode: e.target.value })}
              />
            </Field>
            <Field label="Country">
              <TextInput
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <TextInput
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Fax">
              <TextInput
                value={form.fax}
                onChange={e => setForm({ ...form, fax: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Home page">
            <TextInput
              placeholder="https://…"
              value={form.homePage}
              onChange={e => setForm({ ...form, homePage: e.target.value })}
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-moss hover:bg-mossdark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded mt-2"
          >
            {saving ? 'Guardando…' : editingId ? 'Save changes' : 'Create supplier'}
          </button>
        </form>
      </Drawer>
    </div>
  )
}
