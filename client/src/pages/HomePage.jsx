import Card from '../components/ui/Card'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="container mt-12 mb-16">
      <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">CommunityFix</span> — report neighborhood issues fast
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">Make your neighbourhood safer — report infrastructure, sanitation and maintenance problems quickly and follow progress online.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/report" className="cf-btn text-center">✏️ Report an issue</Link>
            <Link to="/issues" className="px-6 py-3 rounded-lg border-2 border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200 text-center">📖 Browse issues</Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Open issues</p>
                <h3 className="text-4xl font-bold text-blue-600 mt-2">24</h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-600">Updated</div>
                <div className="text-xs text-slate-500 mt-1">Today</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg. response time</p>
              <h3 className="text-4xl font-bold text-green-600">2 days</h3>
              <p className="text-sm text-slate-600 mt-3">Our team responds quickly to keep your community safe</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">Community strength</p>
                <h3 className="text-3xl font-bold mt-2">2,847</h3>
                <p className="text-sm text-slate-400 mt-1">Active members</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
