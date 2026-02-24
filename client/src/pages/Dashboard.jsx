import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import IssueCard from '../components/IssueCard'
import issueService from '../services/issueService'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    console.log('[Dashboard] Loading issues...')
    setLoading(true)
    issueService.list()
      .then(data => {
        if (!mounted) return
        console.log('[Dashboard] Issues loaded:', data)
        setIssues(data || [])
      })
      .catch(err => {
        console.error('[Dashboard] Error loading issues:', err)
        if (!mounted) return
        setError(err)
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
          console.log('[Dashboard] Loading complete')
        }
      })

    return () => { mounted = false }
  }, [])

  const openCount = issues.filter(i => i.status === 'open' || i.status === 'pending').length
  const inProgressCount = issues.filter(i => i.status === 'in_progress' || i.status === 'assigned').length
  const closedCount = issues.filter(i => i.status === 'closed' || i.status === 'resolved').length

  const statCards = [
    { label: 'Open', value: openCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: '🔓', border: 'border-amber-200/60' },
    { label: 'In Progress', value: inProgressCount, color: 'text-navy-600', bg: 'bg-navy-50', icon: '⚙️', border: 'border-navy-200/60' },
    { label: 'Resolved', value: closedCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅', border: 'border-emerald-200/60' },
  ]

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
          Welcome back{user ? `, ${user.name || 'Member'}` : ''} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">Here's what's happening in your community today.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {statCards.map((stat, i) => (
          <Card key={i} hover={false} className={`p-5 border ${stat.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-900">Recent Issues</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{issues.length} total</span>
        </div>

        {loading && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        )}

        {error && (
          <Card className="p-6 border-red-200 bg-red-50">
            <p className="text-sm text-red-600 font-medium">Failed to load issues</p>
            <p className="text-xs text-red-400 mt-1">{error.message}</p>
          </Card>
        )}

        {!loading && !error && (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {issues.slice(0, 6).map(issue => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
            {issues.length === 0 && (
              <Card className="col-span-full p-10 text-center" hover={false}>
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm font-medium text-slate-500">No issues reported yet</p>
                <p className="text-xs text-slate-400 mt-1">Encourage your community to start reporting problems.</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
