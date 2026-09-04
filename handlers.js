import { http, HttpResponse } from 'msw'

// Misma URL base que usa src/api/client.js por defecto
const BASE_URL = 'http://localhost:5146/api'

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json()

    if (body.username === 'admin' && body.password === 'admin123') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
        username: 'admin'
      })
    }

    return HttpResponse.text('Usuario o contraseña incorrectos.', { status: 401 })
  })
]
