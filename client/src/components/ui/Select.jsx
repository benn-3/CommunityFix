export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className={`${className}`}>
      {label && <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>}
      <select
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-200 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8.825a.5.5 0 01-.354-.146l-3.5-3.5a.5.5 0 11.708-.708L6 7.618l3.146-3.147a.5.5 0 11.708.708l-3.5 3.5A.5.5 0 016 8.825z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '2.5rem' }}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}
