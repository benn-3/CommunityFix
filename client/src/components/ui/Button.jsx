export default function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5",
  }

  const variants = {
    primary: "text-white bg-navy-700 hover:bg-navy-800 active:bg-navy-900 focus:ring-navy-500 shadow-sm hover:shadow-md",
    accent: "text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 focus:ring-teal-400 shadow-sm hover:shadow-md",
    outline: "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-400",
    ghost: "text-slate-600 bg-transparent hover:bg-slate-100 focus:ring-slate-400 shadow-none",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-400 shadow-sm",
    success: "text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400 shadow-sm",
  }

  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
