import { apiClient } from './client'

export const authApi = {
  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }).then(res => res.data),
  register: (username, password) =>
    apiClient.post('/auth/register', { username, password }).then(res => res.data)
}
