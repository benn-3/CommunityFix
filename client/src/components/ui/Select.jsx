export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>}
      <select className={`cf-input ${className}`} {...props}>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </label>
  )
}
