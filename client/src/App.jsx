import './index.css'
import AuthContext, { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Analytics />
    </AuthProvider>
  )
}
