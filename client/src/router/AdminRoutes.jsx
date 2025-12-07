import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import IssueApproval from '../pages/admin/IssueApproval'
import AssignWorker from '../pages/admin/AssignWorker'

export default function AdminRoutes(){
  return (
    <Routes>
      <Route path="admin" element={<AdminDashboard/>} />
      <Route path="admin/approvals" element={<IssueApproval/>} />
      <Route path="admin/assign" element={<AssignWorker/>} />
    </Routes>
  )
}
