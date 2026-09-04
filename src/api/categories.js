import { apiClient } from './client'

export const categoriesApi = {
  getAll: () => apiClient.get('/categories').then(res => res.data),
  getById: (id) => apiClient.get(`/categories/${id}`).then(res => res.data),
  create: (dto) => apiClient.post('/categories', dto).then(res => res.data),
  update: (id, dto) => apiClient.put(`/categories/${id}`, dto),
  remove: (id) => apiClient.delete(`/categories/${id}`)
}
