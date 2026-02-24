import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import issueService from '../../services/issueService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const statusConfig = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  approved: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  in_progress: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
  resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('issues')
  const [stats, setStats] = useState(null)
  const [issues, setIssues] = useState([])
  const [workers, setWorkers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [assignWorkerId, setAssignWorkerId] = useState('')
  const [assignIssueId, setAssignIssueId] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      try { const d = await issueService.list(); setIssues(d || []) } catch (e) { console.error(e) }
      try { const d = await adminService.getWorkers(); setWorkers(d || []) } catch (e) { console.error(e) }
      try { const d = await issueService.getCategories(); setCategories(d || []) } catch (e) { console.error(e) }
      try { const d = await adminService.getAnalytics(); setStats(d) } catch (e) { console.error(e) }
    } finally { setLoading(false) }
  }

  async function handleIssueAction(id, action, payload = {}) {
    if (!confirm(`Are you sure you want to ${action} this issue?`)) return
    setProcessing(id)
    try {
      let updateData = {}
      if (action === 'approve') updateData = { status: 'approved' }
      else if (action === 'reject') updateData = { status: 'closed' }
      else if (action === 'assign') {
        if (!payload.workerId) { alert('Please select a worker first'); setProcessing(null); return }
        updateData = { status: 'assigned', assignedTo: payload.workerId, priority: payload.priority || 'medium' }
      }
      await issueService.update(id, updateData)
      await loadData()
      setAssignIssueId(null)
      setAssignWorkerId('')
    } catch (err) {
      alert(err?.response?.data?.message || 'Action failed')
    } finally { setProcessing(null) }
  }

  async function deleteWorker(id) {
    if (!confirm('Delete this worker?')) return
    setProcessing(id)
    try {
      await adminService.deleteWorker(id)
      setWorkers(workers.filter(w => w._id !== id))
    } catch (err) { alert('Failed to delete worker') }
    finally { setProcessing(null) }
  }

  async function addCategory(e) {
    e.preventDefault()
    if (!newCategory.trim()) return
    try {
      await issueService.createCategory({ name: newCategory })
      setNewCategory('')
      await loadData()
    } catch (err) { alert('Failed to add category') }
  }

  async function deleteCategory(id) {
    if (!confirm('Delete category?')) return
    try {
      await issueService.deleteCategory(id)
      setCategories(categories.filter(c => c._id !== id))
    } catch (err) { alert('Failed to delete category') }
  }

  const tabs = [
    { key: 'issues', label: 'Issues', count: issues.length },
    { key: 'workers', label: 'Workers', count: workers.length },
    { key: 'categories', label: 'Categories', count: categories.length },
  ]

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-10 w-64 rounded-lg" />
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="skeleton h-64 w-full rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage issues, workers, and categories</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${activeTab === tab.key
                  ? 'border-navy-700 text-navy-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? 'bg-navy-50 text-navy-700' : 'bg-slate-100 text-slate-400'}`}>{tab.count}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Issues Tab */}
      {activeTab === 'issues' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Issue</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.length === 0 ? (
                <tr><td colSpan="4" className="px-5 py-12 text-center text-sm text-slate-400">No issues found</td></tr>
              ) : issues.map(issue => {
                const sc = statusConfig[issue.status] || statusConfig.pending
                return (
                  <tr key={issue._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px]">{issue.title}</p>
                      <p className="text-xs text-slate-400">{issue.category}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {issue.assignedTo ? (issue.assignedTo.name || issue.assignedTo.email) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5 relative">
                        {issue.status === 'pending' && (
                          <>
                            <button onClick={() => handleIssueAction(issue._id, 'approve')} disabled={processing === issue._id}
                              className="px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer">Approve</button>
                            <button onClick={() => handleIssueAction(issue._id, 'reject')} disabled={processing === issue._id}
                              className="px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">Reject</button>
                          </>
                        )}
                        {(issue.status === 'approved' || issue.status === 'pending') && (
                          <button onClick={() => { setAssignIssueId(issue._id); setAssignWorkerId('') }}
                            className="px-2.5 py-1 text-xs font-medium text-navy-600 hover:bg-navy-50 rounded-lg transition-colors cursor-pointer">Assign</button>
                        )}
                        {assignIssueId === issue._id && (
                          <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50">
                            <h4 className="font-bold text-xs text-slate-700 mb-2">Assign Worker</h4>
                            <select className="w-full text-sm border border-slate-200 rounded-lg mb-2 p-2 bg-slate-50 focus:outline-none focus:border-navy-500"
                              value={assignWorkerId} onChange={(e) => setAssignWorkerId(e.target.value)}>
                              <option value="">Select Worker</option>
                              {workers.map(w => <option key={w._id} value={w._id}>{w.name || w.email}</option>)}
                            </select>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setAssignIssueId(null); setAssignWorkerId('') }}
                                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer">Cancel</button>
                              <button onClick={() => handleIssueAction(issue._id, 'assign', { workerId: assignWorkerId })}
                                disabled={!assignWorkerId || processing === issue._id}
                                className={`text-xs px-3 py-1 rounded-lg font-medium cursor-pointer ${!assignWorkerId ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-navy-700 text-white hover:bg-navy-800'}`}>
                                {processing === issue._id ? 'Assigning…' : 'Confirm'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Workers Tab */}
      {activeTab === 'workers' && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link to="/register">
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Worker
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.length === 0 ? (
              <div className="col-span-full text-center py-16 text-slate-400">
                <p className="text-3xl mb-2">👷</p>
                <p className="text-sm font-medium">No workers found</p>
              </div>
            ) : workers.map(worker => (
              <Card key={worker._id} className="p-5 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    {worker.name?.[0]?.toUpperCase() || 'W'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{worker.name || 'Worker'}</p>
                    <p className="text-xs text-slate-400">{worker.email}</p>
                  </div>
                </div>
                <button onClick={() => deleteWorker(worker._id)} disabled={processing === worker._id}
                  className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-5">
          <Card className="p-5 border-dashed border-2 border-slate-200 bg-slate-50/50" hover={false}>
            <form onSubmit={addCategory} className="flex gap-3">
              <Input placeholder="New category name…" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="flex-1" />
              <Button type="submit" variant="accent" size="sm">Add</Button>
            </form>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-16 text-slate-400">
                <p className="text-3xl mb-2">🏷️</p>
                <p className="text-sm font-medium">No categories yet</p>
              </div>
            ) : categories.map(cat => (
              <div key={cat._id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center group hover:shadow-card transition-all">
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                <button onClick={() => deleteCategory(cat._id)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
