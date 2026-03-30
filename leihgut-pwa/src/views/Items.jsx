import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate } from '../store'
import SwipeRow from '../components/SwipeRow'
import AddItem from './AddItem'
import AddLoan from './AddLoan'

const CATS = {
  tool:        { icon: '🔧', label: 'Werkzeug' },
  garden:      { icon: '🌿', label: 'Garten' },
  vehicle:     { icon: '🚗', label: 'Fahrzeug' },
  electronics: { icon: '⚡', label: 'Elektronik' },
  other:       { icon: '📦', label: 'Sonstiges' },
}

export default function Items() {
  const s = useAppStore()
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [lendItem, setLendItem] = useState(null) // item to create loan for
  const [detail, setDetail]     = useState(null) // item detail

  const filtered = s.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  if (detail) return <ItemDetail item={detail} onBack={() => setDetail(null)} onLend={it => { setDetail(null); setLendItem(it) }} />

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Werkzeuge</span>
        <button className="icon-btn" onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div style={{ padding: '10px 16px 0' }}>
        <input
          className="form-input" placeholder="🔍 Suchen…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="content">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔧</div>
            <div className="empty-title">Keine Werkzeuge</div>
            <div className="empty-sub">Tippe auf + um dein erstes Gerät hinzuzufügen.</div>
          </div>
        ) : (
          <div className="card">
            {filtered.map(item => {
              const lent = s.isLent(item)
              const loan = s.currentLoan(item)
              const person = loan ? s.person(loan.personId) : null
              const cat = CATS[item.category] || CATS.other

              return (
                <SwipeRow key={item.id} actions={[
                  lent ? null : { icon: '↔️', label: 'Verleihen', color: 'var(--blue)', onClick: () => setLendItem(item) },
                  { icon: '🗑', label: 'Löschen', color: 'var(--red)', onClick: () => { if(confirm(`"${item.name}" löschen?`)) s.deleteItem(item.id) } }
                ].filter(Boolean)}>
                  <div className="card-row" onClick={() => setDetail(item)} style={{ cursor: 'pointer' }}>
                    <div className="row-icon" style={{ background: 'rgba(255,107,0,.1)', fontSize: 20 }}>
                      {cat.icon}
                    </div>
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
                        <span className="badge badge-green">✓ Verfügbar</span>
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
  const s = useAppStore()
  const lent = s.isLent(item)
  const loan = s.currentLoan(item)
  const person = loan ? s.person(loan.personId) : null
  const cat = CATS[item.category] || CATS.other
  const history = s.loans.filter(l => l.itemId === item.id).sort((a,b) => new Date(b.lentOn)-new Date(a.lentOn))

  return (
    <>
      <div className="nav-header">
        <button className="back-btn" onClick={onBack}>‹ Zurück</button>
        <span className="nav-title">{item.name}</span>
        <div style={{ width: 60 }} />
      </div>
      <div className="content">
        <div className="card">
          <div className="card-row">
            <div style={{ fontSize: 40 }}>{cat.icon}</div>
            <div className="row-main">
              <div className="row-title" style={{ fontSize: 20, fontWeight: 700 }}>{item.name}</div>
              <div className="row-sub">{cat.label}</div>
            </div>
          </div>
          {item.notes && <div className="card-row"><div style={{ color: 'var(--sub)' }}>{item.notes}</div></div>}
        </div>

        {lent && loan && person ? (
          <div className="card">
            <div className="section-hd" style={{ padding: '12px 16px 6px' }}>Aktuell verliehen an</div>
            <div className="card-row">
              <div className="row-main">
                <div className="row-title">{person.name}</div>
                <div className="row-sub">Seit {fmtDate(loan.lentOn)}</div>
                {loan.dueDate && <div className="row-sub" style={{ color: loan.isOverdue ? 'var(--red)' : undefined }}>
                  Fällig: {fmtDate(loan.dueDate)}
                </div>}
              </div>
              <button className="save-btn" style={{ width: 'auto', padding: '8px 16px', fontSize: 14 }}
                onClick={() => s.markReturned(loan.id)}>Zurück ✓</button>
            </div>
          </div>
        ) : (
          <button className="save-btn" onClick={() => onLend(item)}>↔ Verleihen</button>
        )}

        {history.length > 0 && (
          <div className="card">
            <div className="section-hd" style={{ padding: '12px 16px 6px' }}>Verlauf</div>
            {history.map(l => {
              const p = s.person(l.personId)
              return (
                <div key={l.id} className="card-row">
                  <div className="row-main">
                    <div className="row-title" style={{ opacity: l.isReturned ? .5 : 1 }}>{p?.name ?? '–'}</div>
                    <div className="row-sub">{fmtDate(l.lentOn)}</div>
                  </div>
                  {l.isReturned
                    ? <span className="badge badge-green">✓ Zurück</span>
                    : <span className="badge badge-orange">Offen</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
