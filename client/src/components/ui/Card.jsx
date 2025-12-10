export default function Card({ children, className = '', ...props }) {
  return (
    <div
      role="region"
      aria-label="card"
      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
