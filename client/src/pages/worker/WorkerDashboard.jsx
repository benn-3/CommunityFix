
import React from 'react'

export default function WorkerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Worker Dashboard</h1>
        <p className="text-slate-600 mt-2">View your assigned tasks and update their status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-2 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">My Assigned Tasks</h3>
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
            <p className="text-slate-500">No tasks assigned currently.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="font-semibold text-slate-700 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Completed</span>
              <span className="font-bold text-green-600">14</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending</span>
              <span className="font-bold text-orange-600">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
