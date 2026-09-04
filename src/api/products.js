import { apiClient } from './client'

export const productsApi = {
  //getAll: () => apiClient.get('/products/paginacion?PageNumber=1').then(res => res.data),

  // El backend devuelve { currentPage, totalPages, pageSize, totalCount, data: [...] }

  /*
  getPaginated: (pageNumber = 1, pageSize = 10) =>
    apiClient
      .get('/products', { params: { PageNumber: pageNumber, PageSize: pageSize } })
      .then(res => res.data),
  */

  // El backend devuelve { currentPage, totalPages, pageSize, totalCount, data: [...] }
  getPaginated: (pageNumber = 1, pageSize = 10, { searchTerm, categoryID } = {}) =>
    apiClient
      .get('/products', {
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          searchTerm: searchTerm || undefined,
          categoryID: categoryID || undefined
        }
      })
      .then(res => res.data),      
  getById: (id) => apiClient.get(`/products/${id}`).then(res => res.data),
  create: (dto) => apiClient.post('/products', dto).then(res => res.data),
  update: (id, dto) => apiClient.put(`/products/${id}`, dto),
  remove: (id) => apiClient.delete(`/products/${id}`)
}
