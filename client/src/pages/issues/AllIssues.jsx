import IssueCard from '../../components/IssueCard'
import { useEffect, useState } from 'react'
import issueService from '../../services/issueService'



export default function AllIssues() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    issueService.list()
      .then(data => {
        if (!mounted) return
        setIssues(data || [])
      })
      .catch(err => {
        console.error(err)
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">All Issues</h2>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{issues.length} results</div>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading issues…</div>}
      {error && <div className="text-sm text-red-600">Failed to load issues</div>}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {issues.length > 0 ? (
          issues.map(issue => (
            <IssueCard key={issue._id} issue={issue} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-lg">No issues found.</p>
            <p className="text-sm mt-1">Be the first to report one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
