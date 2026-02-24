export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      role="region"
      aria-label="card"
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-card ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5' : ''} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
