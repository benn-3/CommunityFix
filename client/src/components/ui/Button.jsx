export default function Button({ children, onClick, type = 'button', className = '', disabled = false, ariaLabel }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cf-btn ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
