import Card from './ui/Card'
import { Link } from 'react-router-dom'

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  approved: { label: 'Approved', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  assigned: { label: 'Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  in_progress: { label: 'In Progress', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
  resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  closed: { label: 'Closed', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

function PriorityIndicator({ priority }) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-amber-400',
    low: 'bg-emerald-400'
  }
  return <span className={`w-1 h-8 rounded-full ${colors[priority] || colors.medium}`} />
}

export default function IssueCard({ issue }) {
  return (
    <Link to={`/issues/${issue._id}`} className="group">
      <Card className="flex h-full p-0 overflow-hidden">
        <PriorityIndicator priority={issue.priority} />
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-navy-700 transition-colors truncate">
                {issue.title}
              </h3>
              <p className="text-xs font-medium text-teal-600 mt-0.5 uppercase tracking-wide">{issue.category}</p>
            </div>
            <StatusBadge status={issue.status} />
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{issue.description}</p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {issue.upvotes && issue.upvotes.length > 0 && (
                <span className="flex items-center gap-1 text-navy-600 font-semibold">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                  {issue.upvotes.length}
                </span>
              )}
              {issue.comments && issue.comments.length > 0 && (
                <span className="flex items-center gap-1">
                  💬 {issue.comments.length}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
