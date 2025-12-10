import Card from '../components/ui/Card'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-16 lg:gap-8 lg:grid-cols-2 items-center">

          {/* Left Column: Text & CTA */}
          <div className="space-y-8 animated-fade-in-up">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-bold text-sm rounded-full mb-2 tracking-wide border border-blue-100">
              🚀 The #1 Hyper-local Issue Tracker
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Fix Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Community</span> Today
            </h1>

            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Report neighborhood issues fast. Potholes, streetlights, or sanitation – we help you track and resolve infrastructure problems in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/report" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                ✏️ Report an Issue
              </Link>
              <Link to="/issues" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all hover:border-slate-300 hover:-translate-y-1 shadow-sm">
                📖 Browse Issues
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 13}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p>Trusted by 2,000+ residents</p>
            </div>
          </div>

          {/* Right Column: Stats Cards */}
          <div className="grid gap-6 items-center lg:pl-10">

            <Card className="p-6 border border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm transform transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Reports</p>
                  </div>
                  <p className="text-5xl font-extrabold text-slate-900 tracking-tight">24</p>
                  <p className="text-slate-500 text-sm mt-1">Issues requiring attention</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                  🚨
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm transform transition-all hover:scale-[1.02] ml-0 lg:ml-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avg. Response Time</p>
                  <p className="text-5xl font-extrabold text-slate-900 tracking-tight">2<span className="text-2xl text-slate-500 font-normal ml-1">days</span></p>
                  <p className="text-slate-500 text-sm mt-1">Faster than last month</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                  ⚡
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm transform transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Community Members</p>
                  <p className="text-5xl font-extrabold text-slate-900 tracking-tight">2,847</p>
                  <p className="text-slate-500 text-sm mt-1">Residents making a change</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                  👥
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
