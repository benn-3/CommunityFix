import { useId } from 'react'

export default function Input({ label, error, className = '', id, icon, ...props }) {
  const autoId = useId()
  const inputId = id || `input-${autoId}`

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200 disabled:bg-slate-100 disabled:text-slate-500 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}
