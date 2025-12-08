import Card from './ui/Card'

function StatusChip({ status }){
  const map = {
    open: 'status-open',
    in_progress: 'status-in_progress',
    closed: 'status-closed'
  }
  return <span className={`chip ${map[status] ?? ''}`}>{status.replace('_', ' ')}</span>
}

export default function IssueCard({ issue }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300">
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
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-slate-500">Reported:</span>
          <span className="text-xs text-slate-600 font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
        <button aria-label={`View ${issue.title}`} className="px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200">View</button>
      </div>
    </Card>
  )
}
