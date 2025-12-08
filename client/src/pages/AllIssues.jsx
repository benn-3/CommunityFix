import IssueCard from '../components/IssueCard'
import { useEffect, useState } from 'react'
import issueService from '../services/issueService'

const placeholder = [
  {
    _id: '1',
    title: 'Broken streetlight at Pine St',
    category: 'Infrastructure',
    status: 'open',
    description: 'The streetlight next to the corner of Pine St is flickering and DANGEROUS at night.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Overflowing drain near Maple Park',
    category: 'Sanitation',
    status: 'in_progress',
    description: 'Water constantly pools causing hazard. Needs cleaning/repair.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Graffiti on community center',
    category: 'Maintenance',
    status: 'closed',
    description: 'Graffiti has been reported and cleaned previously.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Pothole on 5th street',
    category: 'Infrastructure',
    status: 'open',
    description: 'Large pothole causing damage to cars.',
    createdAt: new Date().toISOString()
  },
]

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
        {(issues.length ? issues : placeholder).map(issue => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </div>
  )
}
