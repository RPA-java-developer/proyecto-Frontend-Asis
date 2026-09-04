import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import LoginPage from './LoginPage'

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<div>Products page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('LoginPage', () => {
  it('muestra errores de validación y no envía el formulario si los campos están vacíos', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('El usuario es requerido.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es requerida.')).toBeInTheDocument()
  })

  it('inicia sesión con credenciales válidas y navega a /products', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'admin123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Products page')).toBeInTheDocument()
    expect(localStorage.getItem('asisya_token')).toBe('fake-jwt-token')
  })

  it('muestra el error del backend con credenciales inválidas', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText(/username/i), 'admin')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Usuario o contraseña incorrectos.')).toBeInTheDocument()
    // Sigue en el login, no navegó
    expect(screen.queryByText('Products page')).not.toBeInTheDocument()
  })
})
