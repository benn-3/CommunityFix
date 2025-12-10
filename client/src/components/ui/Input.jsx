import { useId } from 'react'

export default function Input({ label, error, className = '', id, ...props }) {
  const autoId = useId()
  const inputId = id || `input-${autoId}`

  return (
    <label className="block text-sm" htmlFor={inputId}>
      {label && <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </label>
  )
}
