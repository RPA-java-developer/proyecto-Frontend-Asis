import { apiClient } from './client'

export const bulkImportApi = {
  uploadCsv: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient
      .post('/products/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => res.data)
  },

  getStatus: (jobId) =>
    apiClient.get(`/products/bulk-import/${jobId}/status`).then(res => res.data)
}