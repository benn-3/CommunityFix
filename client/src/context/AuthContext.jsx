import { createContext, useState, useEffect } from 'react'
import { getToken, saveToken, logout as clearToken } from '../services/auth'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (token) {
      // optionally fetch user profile
      setUser({ token })
    }
  }, [])

  const login = (token) => {
    saveToken(token)
    setUser({ token })
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
