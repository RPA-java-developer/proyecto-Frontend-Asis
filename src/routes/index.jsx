import { useRoutes, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import { authRoutes } from './authRoutes'
import { productRoutes } from './productRoutes'
import { categoryRoutes } from './categoryRoutes'
import { supplierRoutes } from './supplierRoutes'

export default function AppRoutes() {
  return useRoutes([
    // Rutas públicas
    ...authRoutes,

    // Rutas protegidas: comparten el layout (sidebar) y requieren sesión.
    // Agregar un nuevo módulo de rutas protegidas es solo: crearlo y
    // añadirlo aquí, sin tocar el resto del enrutamiento.
    {
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="/products" replace /> },
        ...productRoutes,
        ...categoryRoutes,
        ...supplierRoutes
      ]
    },

    // Cualquier ruta desconocida
    { path: '*', element: <Navigate to="/products" replace /> }
  ])
}
