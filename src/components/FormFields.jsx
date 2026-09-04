export function Field({ label, children, required }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-slate mb-1">
        {label}{required && <span className="text-rust"> *</span>}
      </span>
      {children}
    </label>
  )
}

export function FieldError({ message }) {
  if (!message) return null
  return <span className="block text-xs text-rust mt-1">{message}</span>
}

const baseInput =
  'w-full px-3 py-2 border rounded bg-white text-ink text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss'

const inputBorder = (hasError) => hasError ? 'border-rust' : 'border-line'

export function TextInput({ hasError, ...props }) {
  return <input {...props} className={`${baseInput} ${inputBorder(hasError)} ${props.className || ''}`} />
}

export function NumberInput({ hasError, ...props }) {
  return <input {...props} type="number" className={`${baseInput} ${inputBorder(hasError)} ${props.className || ''}`} />
}

export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink mb-4">
      <input type="checkbox" {...props} className="accent-moss w-4 h-4" />
      {label}
    </label>
  )
}

export function Select({ children, hasError, ...props }) {
  return (
    <select {...props} className={`${baseInput} ${inputBorder(hasError)}`}>
      {children}
    </select>
  )
}
