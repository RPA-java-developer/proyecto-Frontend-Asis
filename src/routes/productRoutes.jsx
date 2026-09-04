import ProductsPage from '../pages/ProductsPage'
import BulkImportPage from '../pages/BulkImportPage'

export const productRoutes = [
  { path: '/products', element: <ProductsPage /> },
  { path: '/products/bulk-import', element: <BulkImportPage /> }
]
