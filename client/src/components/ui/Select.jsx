export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>}
      <select className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${className}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </label>
  )
}
