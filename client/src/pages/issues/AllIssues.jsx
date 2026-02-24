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

  useEffect(() => {
    let result = [...issues]

    if (searchTerm) {
      result = result.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (categoryFilter !== 'all') {
      result = result.filter(issue => issue.category === categoryFilter)
    }
    if (statusFilter !== 'all') {
      result = result.filter(issue => issue.status === statusFilter)
    }
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'upvotes') {
      result.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0))
    }

    setFilteredIssues(result)
  }, [searchTerm, categoryFilter, statusFilter, sortBy, issues])

  const categories = [...new Set(issues.map(i => i.category))]

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">All Issues</h2>
          <p className="text-sm text-slate-400 mt-0.5">Browse and search community reports</p>
        </div>
        <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-3 py-1.5 rounded-full border border-navy-100">
          {filteredIssues.length} of {issues.length}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="md:col-span-2"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            }
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Sort:</span>
          {[
            { value: 'recent', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'upvotes', label: 'Most Voted' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${sortBy === option.value
                  ? 'bg-navy-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      )}

      {error && (
        <div className="p-6 text-center bg-red-50 rounded-2xl border border-red-200">
          <p className="text-sm text-red-600 font-medium">Failed to load issues</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <IssueCard key={issue._id} issue={issue} onUpdate={() => issueService.list().then(setIssues)} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-sm font-medium text-slate-500">No issues found</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Be the first to report one!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
