import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import issueService from '../../services/issueService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('issues')
  const [stats, setStats] = useState(null)

  // Data
  const [issues, setIssues] = useState([])
  const [workers, setWorkers] = useState([])
  const [categories, setCategories] = useState([])

  // Loading states
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)

  // Inputs
  const [newCategory, setNewCategory] = useState('')
  const [assignWorkerId, setAssignWorkerId] = useState('')
  const [assignIssueId, setAssignIssueId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      console.log('[AdminDashboard] Loading data...')

      // Load issues first (most important)
      try {
        const issuesData = await issueService.list()
        console.log('[AdminDashboard] Issues loaded:', issuesData)
        setIssues(issuesData || [])
      } catch (err) {
        console.error('[AdminDashboard] Issues failed:', err)
      }

      // Load workers
      try {
        const workersData = await adminService.getWorkers()
        console.log('[AdminDashboard] Workers loaded:', workersData)
        setWorkers(workersData || [])
      } catch (err) {
        console.error('[AdminDashboard] Workers failed:', err)
      }

      // Load categories
      try {
        const categoriesData = await issueService.getCategories()
        console.log('[AdminDashboard] Categories loaded:', categoriesData)
        setCategories(categoriesData || [])
      } catch (err) {
        console.error('[AdminDashboard] Categories failed:', err)
      }

      // Load analytics (optional)
      try {
        const analyticsData = await adminService.getAnalytics()
        console.log('[AdminDashboard] Analytics loaded:', analyticsData)
        setStats(analyticsData)
      } catch (err) {
        console.error('[AdminDashboard] Analytics failed:', err)
      }

    } catch (err) {
      console.error('[AdminDashboard] Critical error:', err)
    } finally {
      setLoading(false)
      console.log('[AdminDashboard] Loading complete')
    }
  }

  // Issue Actions
  async function handleIssueAction(id, action, payload = {}) {
    console.log('[AdminDashboard] handleIssueAction:', { id, action, payload })

    if (!confirm(`Are you sure you want to ${action} this issue?`)) return

    setProcessing(id)
    try {
      let updateData = {}

      if (action === 'approve') {
        updateData = { status: 'approved' }
      } else if (action === 'reject') {
        updateData = { status: 'closed' }
      } else if (action === 'assign') {
        if (!payload.workerId) {
          alert('Please select a worker first')
          setProcessing(null)
          return
        }
        updateData = {
          status: 'assigned',
          assignedTo: payload.workerId,
          priority: payload.priority || 'medium'
        }
      }

      console.log('[AdminDashboard] Updating issue with:', updateData)
      await issueService.update(id, updateData)
      alert(`Issue ${action}ed successfully!`)

      // Reload data
      await loadData()
      setAssignIssueId(null)
      setAssignWorkerId('')
    } catch (err) {
      console.error('[AdminDashboard] Action failed:', err)
      alert(err?.response?.data?.message || 'Action failed')
    } finally {
      setProcessing(null)
    }
  }

  // Worker Actions
  async function deleteWorker(id) {
    if (!confirm('Delete this worker?')) return
    setProcessing(id)
    try {
      await adminService.deleteWorker(id)
      setWorkers(workers.filter(w => w._id !== id))
      alert('Worker deleted successfully')
    } catch (err) {
      console.error('[AdminDashboard] Delete worker failed:', err)
      alert('Failed to delete worker')
    } finally {
      setProcessing(null)
    }
  }

  // Category Actions
  async function addCategory(e) {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      await issueService.createCategory({ name: newCategory })
      setNewCategory('')
      await loadData()
      alert('Category added successfully')
    } catch (err) {
      console.error('[AdminDashboard] Add category failed:', err)
      alert('Failed to add category')
    }
  }

  async function deleteCategory(id) {
    if (!confirm('Delete category?')) return
    try {
      await issueService.deleteCategory(id)
      setCategories(categories.filter(c => c._id !== id))
      alert('Category deleted successfully')
    } catch (err) {
      console.error('[AdminDashboard] Delete category failed:', err)
      alert('Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="text-slate-500">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Oversee community issues and manage resources.</p>
        </div>
        <Button variant="outline" onClick={loadData}>Refresh Data</Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {['issues', 'workers', 'categories'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Issues Tab */}
      {activeTab === 'issues' && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No issues found. Citizens can report issues to get started.
                    </td>
                  </tr>
                ) : (
                  issues.map(issue => (
                    <tr key={issue._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{issue.title}</div>
                        <div className="text-sm text-slate-500">{issue.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${issue.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                            issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {issue.assignedTo ? (issue.assignedTo.name || issue.assignedTo.email) : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 relative">
                          {issue.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleIssueAction(issue._id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                                disabled={processing === issue._id}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleIssueAction(issue._id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                                disabled={processing === issue._id}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {(issue.status === 'approved' || issue.status === 'pending') && (
                            <button
                              onClick={() => {
                                setAssignIssueId(issue._id)
                                setAssignWorkerId('')
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Assign
                            </button>
                          )}

                          {/* Assignment Popup */}
                          {assignIssueId === issue._id && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-lg p-4 z-50">
                              <h4 className="font-bold text-sm mb-2 text-slate-700">Assign Worker</h4>
                              <select
                                className="w-full text-sm border-slate-300 rounded-md mb-3 p-2 border"
                                value={assignWorkerId}
                                onChange={(e) => {
                                  console.log('[AdminDashboard] Worker selected:', e.target.value)
                                  setAssignWorkerId(e.target.value)
                                }}
                              >
                                <option value="">Select Worker</option>
                                {workers.map(w => (
                                  <option key={w._id} value={w._id}>
                                    {w.name || w.email}
                                  </option>
                                ))}
                              </select>
                              {!assignWorkerId && (
                                <p className="text-xs text-orange-600 mb-2">⚠️ Please select a worker</p>
                              )}
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setAssignIssueId(null)
                                    setAssignWorkerId('')
                                  }}
                                  className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleIssueAction(issue._id, 'assign', { workerId: assignWorkerId })}
                                  disabled={!assignWorkerId || processing === issue._id}
                                  className={`text-xs px-3 py-1 rounded ${!assignWorkerId || processing === issue._id
                                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                  {processing === issue._id ? 'Assigning...' : 'Confirm'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workers Tab */}
      {activeTab === 'workers' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Worker
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                No workers found. Add workers to assign tasks.
              </div>
            ) : (
              workers.map(worker => (
                <Card key={worker._id} className="p-6 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{worker.name || 'Worker'}</div>
                    <div className="text-sm text-slate-500">{worker.email}</div>
                    <div className="text-xs text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-1 rounded font-mono uppercase">
                      {worker.role}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWorker(worker._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                    disabled={processing === worker._id}
                  >
                    🗑️
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <Card className="p-6 bg-slate-50 border-dashed border-2 border-slate-300">
            <form onSubmit={addCategory} className="flex gap-4">
              <Input
                placeholder="New Category Name..."
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add Category</Button>
            </form>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                No categories found. Add categories for issue classification.
              </div>
            ) : (
              categories.map(cat => (
                <div
                  key={cat._id}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center group"
                >
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
