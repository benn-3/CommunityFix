import { useId } from 'react'

export default function Input({ label, error, className = '', id, ...props }) {
  const autoId = useId()
  const inputId = id || `input-${autoId}`

  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>}
      <input id={inputId} className={`cf-input ${className}`} {...props} />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  )
}
