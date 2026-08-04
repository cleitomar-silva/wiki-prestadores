import { useEffect } from 'react'

const styles = {
  success: { bg: 'bg-deep-teal', icon: 'check_circle' },
  error: { bg: 'bg-error', icon: 'error' },
  info: { bg: 'bg-primary', icon: 'info' },
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [])

  const s = styles[toast.type] ?? styles.info

  return (
    <div
      className={`${s.bg} text-white px-6 py-4 rounded shadow-lg flex items-start gap-3 min-w-[320px] max-w-md`}
      role="alert"
    >
      <span className="material-symbols-outlined">{s.icon}</span>
      <div className="flex-1">
        {toast.title && (
          <p className="font-bold text-sm">{toast.title}</p>
        )}
        <p className="text-sm opacity-90">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Fechar"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  )
}

export default Toast