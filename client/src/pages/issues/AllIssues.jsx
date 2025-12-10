import IssueCard from '../../components/IssueCard'
import { useEffect, useState } from 'react'
import issueService from '../../services/issueService'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

export default function AllIssues() {
  const [issues, setIssues] = useState([])
  const [filteredIssues, setFilteredIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    issueService.list()
      .then(data => {
        if (!mounted) return
        setIssues(data || [])
        setFilteredIssues(data || [])
      })
      .catch(err => {
        console.error(err)
        if (!mounted) return
        setError(err)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...issues]

    // Search filter
    if (searchTerm) {
      result = result.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(issue => issue.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(issue => issue.status === statusFilter)
    }

    // Sorting
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'upvotes') {
      result.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0))
    }

    setFilteredIssues(result)
  }, [searchTerm, categoryFilter, statusFilter, sortBy, issues])

  // Get unique categories from issues
  const categories = [...new Set(issues.map(i => i.category))]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">All Issues</h2>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {filteredIssues.length} of {issues.length} results
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />

          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />

          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' }
            ]}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Sort by:</span>
          <div className="flex gap-2">
            {[
              { value: 'recent', label: 'Most Recent' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'upvotes', label: 'Most Upvoted' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${sortBy === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading issues…</div>}
      {error && <div className="text-sm text-red-600">Failed to load issues</div>}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <IssueCard key={issue._id} issue={issue} onUpdate={() => issueService.list().then(setIssues)} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-lg">No issues found.</p>
            <p className="text-sm mt-1">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to report one!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
