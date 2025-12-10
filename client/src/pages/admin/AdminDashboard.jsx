
import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage issues, approve reports, and assign workers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Pending Approvals</h3>
            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              ⚠️
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">12</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/admin/approvals" className="text-sm font-medium text-blue-600 hover:text-blue-700">View Pending &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Active Workers</h3>
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              👷
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">5</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/admin/workers" className="text-sm font-medium text-blue-600 hover:text-blue-700">Manage Workers &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Total Issues</h3>
            <span className="p-2 bg-green-100 text-green-600 rounded-lg">
              ✅
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">48</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/issues" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
