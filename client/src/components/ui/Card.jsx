export default function Card({ children, className = '', ...props }) {
  return (
    <div
      role="region"
      aria-label="card"
      className={`cf-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
