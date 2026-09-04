import { useEffect, useRef, useState } from 'react'
import { bulkImportApi } from '../api/bulkImport'
import { extractErrorMessage } from '../api/client'

const POLL_INTERVAL_MS = 1500

const STATUS_LABELS = {
  Pending: 'En cola…',
  Running: 'Procesando…',
  Completed: 'Completado',
  CompletedWithErrors: 'Completado con errores',
  Failed: 'Falló'
}

export default function BulkImportPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [status, setStatus] = useState(null)

  const pollRef = useRef(null)

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => stopPolling, [])

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setUploadError(null)
  }

  async function handleUpload() {
    if (!file) return

    setUploading(true)
    setUploadError(null)
    setStatus(null)
    stopPolling()

    try {
      const result = await bulkImportApi.uploadCsv(file)
      const jobId = result.jobId

      // Primer chequeo inmediato, luego polling
      const initialStatus = await bulkImportApi.getStatus(jobId)
      setStatus(initialStatus)

      pollRef.current = setInterval(async () => {
        try {
          const s = await bulkImportApi.getStatus(jobId)
          setStatus(s)

          if (s.status === 'Completed' || s.status === 'CompletedWithErrors' || s.status === 'Failed') {
            stopPolling()
          }
        } catch (err) {
          stopPolling()
          setUploadError(extractErrorMessage(err))
        }
      }, POLL_INTERVAL_MS)
    } catch (err) {
      setUploadError(extractErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  function handleReset() {
    stopPolling()
    setFile(null)
    setStatus(null)
    setUploadError(null)
  }

  const isRunning = status && (status.status === 'Pending' || status.status === 'Running')
  const isDone = status && !isRunning

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Bulk import</h1>
        <p className="text-sm text-slate mt-0.5">
          Carga masiva de productos desde un archivo CSV
        </p>
      </div>

      {!status && (
        <div className="border border-line rounded p-6 bg-white">
          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate mb-2">Archivo CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-moss file:text-white file:text-sm file:font-medium hover:file:bg-mossdark file:cursor-pointer cursor-pointer"
            />
          </label>

          {file && (
            <p className="text-sm text-slate mb-4">
              {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}

          {uploadError && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {uploadError}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-moss hover:bg-mossdark disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded"
          >
            {uploading ? 'Subiendo…' : 'Iniciar carga'}
          </button>

          <p className="text-xs text-slate mt-4">
            El encabezado esperado es: ProductName, CategoryID, SupplierID, QuantityPerUnit,
            UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel, Discontinued
          </p>
        </div>
      )}

      {status && (
        <div className="border border-line rounded p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-ink">
              {STATUS_LABELS[status.status] || status.status}
            </span>
            {isRunning && (
              <span className="text-xs text-slate animate-pulse">Actualizando…</span>
            )}
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-2 bg-line rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-300 ${
                status.status === 'Failed' ? 'bg-rust' : 'bg-moss'
              }`}
              style={{ width: `${status.progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate mb-6">
            {status.progressPercentage}% · {status.processedRows.toLocaleString()} de{' '}
            {status.totalRows.toLocaleString()} filas
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-xs text-slate mb-1">Exitosos</div>
              <div className="font-mono tabular text-lg text-moss">
                {status.successCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate mb-1">Con error</div>
              <div className="font-mono tabular text-lg text-rust">
                {status.errorCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate mb-1">Total</div>
              <div className="font-mono tabular text-lg text-ink">
                {status.totalRows.toLocaleString()}
              </div>
            </div>
          </div>

          {status.generalErrorMessage && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {status.generalErrorMessage}
            </div>
          )}

          {status.sampleErrors?.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-medium text-slate mb-2">
                Primeros {status.sampleErrors.length} errores
              </div>
              <div className="border border-line rounded overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-paper border-b border-line text-left text-slate">
                      <th className="px-3 py-2 font-medium">Fila</th>
                      <th className="px-3 py-2 font-medium">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.sampleErrors.map((e, i) => (
                      <tr key={i} className="border-b border-line last:border-0">
                        <td className="px-3 py-1.5 font-mono tabular text-slate">{e.rowNumber}</td>
                        <td className="px-3 py-1.5 text-ink">{e.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isDone && (
            <button
              onClick={handleReset}
              className="bg-moss hover:bg-mossdark text-white text-sm font-medium px-4 py-2 rounded"
            >
              Cargar otro archivo
            </button>
          )}
        </div>
      )}
    </div>
  )
}
