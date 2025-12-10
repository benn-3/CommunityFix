import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout, DashboardLayout } from '../components/layout/Layouts'

import HomePage from '../pages/HomePage'
import AllIssues from '../pages/issues/AllIssues'
import IssueDetail from '../pages/issues/IssueDetail'
import CreateIssue from '../pages/issues/CreateIssue'
import Dashboard from '../pages/Dashboard'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import WorkerDashboard from '../pages/worker/WorkerDashboard'
import ProtectedRoute from '../components/layout/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (No Sidebar, Full Width) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes (With Sidebar) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['citizen', 'admin', 'worker']}><Dashboard /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />

          <Route path="/issues" element={<AllIssues />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/report" element={<ProtectedRoute allowedRoles={['citizen', 'worker', 'admin']}><CreateIssue /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
