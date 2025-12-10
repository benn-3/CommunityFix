import Card from './ui/Card'
import { Link } from 'react-router-dom'

function StatusChip({ status }) {
  const map = {
    pending: 'text-orange-700 bg-orange-100',
    approved: 'text-blue-700 bg-blue-100',
    assigned: 'text-indigo-700 bg-indigo-100',
    in_progress: 'text-amber-700 bg-amber-100',
    resolved: 'text-green-700 bg-green-100',
    closed: 'text-slate-700 bg-slate-100'
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'text-slate-600 bg-slate-100'}`}>{status.replace('_', ' ')}</span>
}

export default function IssueCard({ issue }) {
  return (
    <Link to={`/issues/${issue._id}`}>
      <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 p-6 cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{issue.title}</h3>
              <p className="text-xs font-medium text-blue-600 mt-1 uppercase tracking-wide">{issue.category}</p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <StatusChip status={issue.status} />
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">{issue.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-slate-500">Reported:</span>
              <span className="text-xs text-slate-600 font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            {issue.upvotes && issue.upvotes.length > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <span className="text-sm">👍</span>
                <span className="text-xs font-bold">{issue.upvotes.length}</span>
              </div>
            )}
          </div>
          <span className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">View Details →</span>
        </div>
      </Card>
    </Link>
  )
}
