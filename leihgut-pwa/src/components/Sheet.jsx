export default function Sheet({ title, onClose, children }) {
  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-header">
          <span className="sheet-title">{title}</span>
          <button className="sheet-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
