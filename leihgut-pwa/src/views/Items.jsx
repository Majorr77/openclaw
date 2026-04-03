import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate } from '../store'
import SwipeRow from '../components/SwipeRow'
import AddItem from './AddItem'
import AddLoan from './AddLoan'

const CATS = {
  tool:        { icon: '🔧', label: 'Werkzeug',  color: 'bg-orange' },
  garden:      { icon: '🌿', label: 'Garten',     color: 'bg-green'  },
  vehicle:     { icon: '🚗', label: 'Fahrzeug',   color: 'bg-blue'   },
  electronics: { icon: '⚡', label: 'Elektronik', color: 'bg-orange' },
  other:       { icon: '📦', label: 'Sonstiges',  color: 'bg-gray'   },
}

export default function Items() {
  const s = useAppStore()
  const [search,    setSearch]    = useState('')
  const [showAdd,   setShowAdd]   = useState(false)
  const [lendItem,  setLendItem]  = useState(null)
  const [detail,    setDetail]    = useState(null)

  const filtered = s.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  if (detail) return (
    <ItemDetail item={detail} onBack={() => setDetail(null)}
      onLend={it => { setDetail(null); setLendItem(it) }} />
  )

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Werkzeuge</span>
        <button className="icon-btn" onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        <input className="form-input" placeholder="🔍  Suchen…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="content" style={{ paddingTop: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔧</div>
            <div className="empty-title">Keine Werkzeuge</div>
            <div className="empty-sub">Tippe auf + um dein erstes Gerät hinzuzufügen.</div>
          </div>
        ) : (
          <div className="card">
            {filtered.map(item => {
              const lent   = s.isLent(item)
              const loan   = s.currentLoan(item)
              const person = loan ? s.person(loan.personId) : null
              const cat    = CATS[item.category] || CATS.other

              return (
                <SwipeRow key={item.id} actions={[
                  !lent && { icon: '↔️', label: 'Verleihen', color: '#0A84FF', onClick: () => setLendItem(item) },
                  { icon: '🗑', label: 'Löschen', color: '#FF3B30', onClick: () => {
                    if (confirm(`"${item.name}" löschen?`)) s.deleteItem(item.id)
                  }}
                ].filter(Boolean)}>
                  <div className="card-row" onClick={() => setDetail(item)}>
                    <div className={`row-icon ${cat.color}`}>{cat.icon}</div>
                    <div className="row-main">
                      <div className="row-title">{item.name}</div>
                      <div className="row-sub">{cat.label}</div>
                    </div>
                    <div className="row-right">
                      {lent ? (
                        <>
                          <span className={`badge ${loan?.isOverdue ? 'badge-red' : 'badge-orange'}`}>
                            {loan?.isOverdue ? '⚠ Überfällig' : 'Verliehen'}
                          </span>
                          {person && <div className="row-sub mt4">{person.name}</div>}
                        </>
                      ) : (
                        <span className="badge badge-green">✓ Frei</span>
                      )}
                    </div>
                  </div>
                </SwipeRow>
              )
            })}
          </div>
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)}>+</button>
      {showAdd  && <AddItem onClose={() => setShowAdd(false)} />}
      {lendItem && <AddLoan onClose={() => setLendItem(null)} preselectedItem={lendItem} />}
    </>
  )
}

function ItemDetail({ item, onBack, onLend }) {
  const s    = useAppStore()
  const lent = s.isLent(item)
  const loan = s.currentLoan(item)
  const person = loan ? s.person(loan.personId) : null
  const cat  = CATS[item.category] || CATS.other
  const history = s.loans.filter(l => l.itemId === item.id)
    .sort((a, b) => new Date(b.lentOn) - new Date(a.lentOn))

  return (
    <>
      <div className="nav-header">
        <button className="back-btn" onClick={onBack}>‹ Zurück</button>
        <span className="nav-title">{item.name}</span>
        <div style={{ width: 60 }} />
      </div>
      <div className="content" style={{ paddingTop: 16 }}>
        {/* Item card */}
        <div className="card">
          <div className="card-row">
            <div className={`row-icon ${cat.color}`} style={{ width: 52, height: 52, borderRadius: 16, fontSize: 26 }}>
              {cat.icon}
            </div>
            <div className="row-main">
              <div className="row-title" style={{ fontSize: 20, fontWeight: 800 }}>{item.name}</div>
              <div className="row-sub">{cat.label}</div>
            </div>
          </div>
          {item.notes && (
            <div className="card-row">
              <div style={{ color: 'var(--sub)', fontSize: 14, lineHeight: 1.5 }}>{item.notes}</div>
            </div>
          )}
        </div>

        {/* Status */}
        {lent && loan && person ? (
          <div className="card">
            <div style={{ padding: '12px 16px 6px' }} className="section-hd">Aktuell bei</div>
            <div className="card-row">
              <div className="row-main">
                <div className="row-title">{person.name}</div>
                <div className="row-sub">Seit {fmtDate(loan.lentOn)}</div>
                {loan.dueDate && (
                  <div className="row-sub" style={{ color: loan.isOverdue ? 'var(--red)' : undefined }}>
                    Fällig: {fmtDate(loan.dueDate)}
                  </div>
                )}
              </div>
              <button onClick={() => s.markReturned(loan.id)}
                style={{ background: 'var(--green)', color: '#fff', border: 'none',
                         borderRadius: 12, padding: '10px 16px', fontWeight: 700,
                         fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                ✓ Zurück
              </button>
            </div>
          </div>
        ) : (
          <button className="save-btn" onClick={() => onLend(item)}>↔ Jetzt verleihen</button>
        )}

        {/* History */}
        {history.length > 0 && (
          <>
            <div className="section-hd">Verlauf</div>
            <div className="card">
              {history.map(l => {
                const p = s.person(l.personId)
                return (
                  <div key={l.id} className="card-row">
                    <div className="row-main">
                      <div className={`row-title${l.isReturned ? ' strike' : ''}`}>{p?.name ?? '–'}</div>
                      <div className="row-sub">{fmtDate(l.lentOn)}</div>
                    </div>
                    {l.isReturned
                      ? <span className="badge badge-green">✓ Zurück</span>
                      : <span className="badge badge-orange">Offen</span>}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}
