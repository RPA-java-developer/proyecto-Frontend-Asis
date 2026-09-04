export function validateLoginForm({ username, password }) {
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
