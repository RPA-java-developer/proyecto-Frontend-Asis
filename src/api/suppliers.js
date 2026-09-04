import { apiClient } from './client'

export const suppliersApi = {
  getAll: () => apiClient.get('/suppliers').then(res => res.data),
  getById: (id) => apiClient.get(`/suppliers/${id}`).then(res => res.data),
  create: (dto) => apiClient.post('/suppliers', dto).then(res => res.data),
  update: (id, dto) => apiClient.put(`/suppliers/${id}`, dto),
  remove: (id) => apiClient.delete(`/suppliers/${id}`)
}
