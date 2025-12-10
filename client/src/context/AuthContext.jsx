import { createContext, useState, useEffect } from 'react'
import { getToken, saveToken, logout as clearToken } from '../services/auth'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (token) {
      // Fallback if we have token but no user data (shouldn't happen with new logic, but good safety)
      setUser({ token })
    }
  }, [])

  const login = (token, userData) => {
    saveToken(token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    clearToken()
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
