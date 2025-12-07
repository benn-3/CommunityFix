import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'

import HomePage from '../pages/HomePage'
import AllIssues from '../pages/AllIssues'
import CreateIssue from '../pages/CreateIssue'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
          <Sidebar />
          <main className="min-h-[calc(100vh-120px)]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/issues" element={<AllIssues />} />
              <Route path="/report" element={<CreateIssue />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
