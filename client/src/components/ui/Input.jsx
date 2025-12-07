export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>}
      <input className={`cf-input ${className}`} {...props} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  )
}
