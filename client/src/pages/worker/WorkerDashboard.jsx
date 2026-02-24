import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import issueService from '../../services/issueService'
import Button from '../../components/ui/Button'

const statusConfig = {
  assigned: { label: 'Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  in_progress: { label: 'In Progress', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
  resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
}

export default function WorkerDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  useEffect(() => { loadTasks() }, [])

  async function loadTasks() {
    setLoading(true)
    try {
      const all = await issueService.list()
      const mine = (all || []).filter(i =>
        i.assignedTo === user?._id || i.assignedTo === user?.id ||
        i.assignedTo?._id === user?._id || i.assignedTo?._id === user?.id
      )
      setIssues(mine)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    setProcessing(id)
    try {
      await issueService.update(id, { status })
      await loadTasks()
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setProcessing(null)
    }
  }

  const activeCount = issues.filter(i => i.status !== 'resolved').length
  const resolvedCount = issues.filter(i => i.status === 'resolved').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Worker Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your assigned tasks and update progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card hover={false} className="p-5 border-amber-200/50">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Tasks</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{activeCount}</p>
        </Card>
        <Card hover={false} className="p-5 border-emerald-200/50">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
        </Card>
        <Card hover={false} className="p-5 border-navy-200/50 hidden lg:block">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Assigned</p>
          <p className="text-3xl font-bold text-navy-700 mt-1">{issues.length}</p>
        </Card>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
          My Tasks
          <Button variant="ghost" size="sm" onClick={loadTasks}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </Button>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : issues.length === 0 ? (
          <Card hover={false} className="p-12 text-center border-dashed">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm font-medium text-slate-500">No tasks assigned</p>
            <p className="text-xs text-slate-400 mt-1">Check back later for new assignments.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {issues.map(issue => {
              const sc = statusConfig[issue.status] || { label: issue.status, bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' }
              return (
                <Card key={issue._id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-bold text-slate-800">{issue.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{issue.category} • {issue.location || 'No location'}</p>
                      <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {issue.status === 'assigned' && (
                        <Button size="sm" variant="primary" onClick={() => updateStatus(issue._id, 'in_progress')} disabled={processing === issue._id}>
                          Start
                        </Button>
                      )}
                      {issue.status === 'in_progress' && (
                        <Button size="sm" variant="success" onClick={() => updateStatus(issue._id, 'resolved')} disabled={processing === issue._id}>
                          Resolve
                        </Button>
                      )}
                      {issue.status === 'resolved' && (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Done ✓</span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
