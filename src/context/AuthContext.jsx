import { createContext, useState } from 'react'
import { authApi } from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('asisya_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('asisya_username'))

  async function login(usernameInput, password) {
    const result = await authApi.login(usernameInput, password)
    localStorage.setItem('asisya_token', result.token)
    localStorage.setItem('asisya_username', result.username)
    setToken(result.token)
    setUsername(result.username)
  }

  function logout() {
    localStorage.removeItem('asisya_token')
    localStorage.removeItem('asisya_username')
    setToken(null)
    setUsername(null)
  }

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
