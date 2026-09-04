import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { extractErrorMessage } from '../api/client'
import { Field, FieldError, TextInput } from '../components/FormFields'

function validate({ username, password }) {
  const errors = {}

  if (!username.trim()) {
    errors.username = 'El usuario es requerido.'
  } else if (username.trim().length < 3) {
    errors.username = 'El usuario debe tener al menos 3 caracteres.'
  }

  if (!password) {
    errors.password = 'La contraseña es requerida.'
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.'
  }

  return errors
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError(null)

    const errors = validate({ username, password })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/products')
    } catch (err) {
      setApiError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value)
    if (fieldErrors.username) {
      setFieldErrors({ ...fieldErrors, username: undefined })
    }
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: undefined })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-semibold text-2xl text-ink tracking-tight">ASISYA</div>
          <div className="text-sm text-slate mt-1">Catálogo de productos</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded p-6" noValidate>
          {apiError && (
            <div className="mb-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded px-3 py-2">
              {apiError}
            </div>
          )}

          <Field label="Username" required>
            <TextInput
              autoFocus
              hasError={!!fieldErrors.username}
              value={username}
              onChange={handleUsernameChange}
            />
            <FieldError message={fieldErrors.username} />
          </Field>

          <Field label="Password" required>
            <TextInput
              type="password"
              hasError={!!fieldErrors.password}
              value={password}
              onChange={handlePasswordChange}
            />
            <FieldError message={fieldErrors.password} />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss hover:bg-mossdark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded mt-2"
          >
            {loading ? 'Entrando…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
