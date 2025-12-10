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

  const openCount = issues.filter(i => i.status === 'open').length
  const inProgressCount = issues.filter(i => i.status === 'in_progress').length
  const closedCount = issues.filter(i => i.status === 'closed').length

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back{user ? `, ${user.name || 'Member'}` : ''}</h1>
        <p className="text-lg text-slate-600 mt-2">Here's what's happening in your community today.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 mb-8">
        <Card className="text-center p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Open issues</p>
          <div className="text-3xl font-bold text-slate-900 mt-3">{openCount}</div>
          <p className="text-sm text-slate-500 mt-2">Needs attention</p>
        </Card>

        <Card className="text-center p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">In progress</p>
          <div className="text-3xl font-bold text-amber-600 mt-3">{inProgressCount}</div>
          <p className="text-sm text-slate-500 mt-2">Being handled</p>
        </Card>

        <Card className="text-center p-6">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Resolved</p>
          <div className="text-3xl font-bold text-green-600 mt-3">{closedCount}</div>
          <p className="text-sm text-slate-500 mt-2">Completed issues</p>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent issues</h2>
        <div className="text-sm text-slate-500">{issues.length} total</div>
      </div>

      {loading && <div className="text-slate-500">Loading recent issues…</div>}
      {error && (
        <div className="text-red-600">
          Failed to load issues
          <div className="text-xs mt-1">{error.message}</div>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {issues.slice(0, 6).map(issue => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
        {!loading && issues.length === 0 && (
          <div className="col-span-full">
            <Card className="p-6">
              <p className="text-slate-600">No issues yet — encourage your community to report problems.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

