import { useState, useRef } from 'react'

export default function SwipeRow({ children, actions = [] }) {
  const [open, setOpen] = useState(false)
  const startX = useRef(null)

  function onTouchStart(e) { startX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (startX.current === null) return
    const dx = startX.current - e.changedTouches[0].clientX
    if (dx > 40) setOpen(true)
    if (dx < -20) setOpen(false)
    startX.current = null
  }

  const totalW = actions.length * 76

  return (
    <div className="swipe-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ transform: open ? `translateX(-${totalW}px)` : 'translateX(0)', transition: 'transform .2s', background: 'var(--card)' }}>
        {children}
      </div>
      {open && (
        <div className="swipe-actions">
          {actions.map((a, i) => (
            <button key={i} className="swipe-action" style={{ background: a.color }}
              onClick={() => { setOpen(false); a.onClick() }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
