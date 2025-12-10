export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-blue-200",
    outline: "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-600 bg-transparent hover:bg-slate-100 shadow-none",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-200"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
