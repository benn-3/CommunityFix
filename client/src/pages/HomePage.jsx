import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute -top-16 right-1/4 w-[400px] h-[400px] bg-navy-100/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 -left-16 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 lg:py-32 max-w-7xl">
        <div className="grid gap-16 lg:gap-12 lg:grid-cols-2 items-center">
          {/* Text */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-700 font-semibold text-xs rounded-full border border-teal-200/60 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Smart Civic Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.1]">
              Fix Your <br className="hidden lg:block" />
              <span className="text-brand-gradient">Community</span> Today
            </h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Report civic issues — potholes, streetlights, sanitation — and track their resolution in real-time. Powered by transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/register" className="inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-navy-700 rounded-xl hover:bg-navy-800 hover:shadow-lg transition-all duration-300 shadow-sm">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link to="/login" className="inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm">
                Sign In
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 13}`} alt="" className="w-full h-full" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">2,000+ Residents</p>
                <p className="text-xs text-slate-400">making their community better</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 lg:pl-8">
            {[
              { label: 'Active Reports', value: '24', sub: 'Issues requiring attention', icon: '🚨', accent: 'from-red-500/10 to-orange-500/10', iconBg: 'bg-red-50 text-red-600' },
              { label: 'Avg. Response Time', value: '2', sub: 'Days — faster than last month', icon: '⚡', accent: 'from-amber-500/10 to-yellow-500/10', iconBg: 'bg-amber-50 text-amber-600', unit: 'days' },
              { label: 'Community Members', value: '2,847', sub: 'Residents driving change', icon: '👥', accent: 'from-teal-500/10 to-emerald-500/10', iconBg: 'bg-teal-50 text-teal-600' },
            ].map((stat, i) => (
              <div key={i} className={`group bg-white rounded-2xl border border-slate-200/70 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 ${i === 1 ? 'lg:ml-8' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className="text-4xl font-extrabold text-navy-900 tracking-tight">
                      {stat.value}
                      {stat.unit && <span className="text-lg text-slate-400 font-normal ml-1">{stat.unit}</span>}
                    </p>
                    <p className="text-slate-400 text-xs mt-1.5">{stat.sub}</p>
                  </div>
                  <div className={`h-11 w-11 rounded-xl ${stat.iconBg} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">How CommunityFix Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Three simple steps to make your neighborhood a better place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Report an Issue', desc: 'Snap a photo, describe the problem, and pin the location. It takes less than 30 seconds.', icon: '📸' },
              { step: '02', title: 'Track Progress', desc: 'Follow your issue through approval, assignment, and resolution — all in real-time.', icon: '📍' },
              { step: '03', title: 'See the Fix', desc: 'Workers resolve the issue and upload proof. Your community gets cleaner, safer, stronger.', icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="group relative bg-slate-50/50 rounded-2xl p-8 border border-slate-100 hover:bg-white hover:shadow-card-hover hover:border-slate-200 transition-all duration-300">
                <span className="text-5xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-teal-100 transition-colors">{item.step}</span>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-navy-800 to-navy-950">
        <div className="container mx-auto px-4 py-16 max-w-7xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to improve your neighborhood?</h2>
          <p className="text-navy-200 mb-8 max-w-lg mx-auto">Join thousands of residents who are already making a difference.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl">
            Start Reporting — It's Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
