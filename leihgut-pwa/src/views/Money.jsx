import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate, fmtMoney } from '../store'
import Avatar from '../components/Avatar'
import SwipeRow from '../components/SwipeRow'
import AddMoney from './AddMoney'

export default function Money() {
  const s = useAppStore()
  const [filter,  setFilter]  = useState('active')
  const [showAdd, setShowAdd] = useState(false)

  const list = (filter === 'active' ? s.activeDebts : s.debts)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const theyOweMe = list.filter(d => d.direction === 'theyOweMe')
  const iOweThem  = list.filter(d => d.direction === 'iOweThem')

  const totalOwed = s.activeDebts.filter(d => d.direction === 'theyOweMe').reduce((a, d) => a + +d.amount, 0)
  const totalIOwe = s.activeDebts.filter(d => d.direction === 'iOweThem').reduce((a, d) => a + +d.amount, 0)

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Geld</span>
        <button className="icon-btn" onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip${filter === 'active' ? ' active' : ''}`} onClick={() => setFilter('active')}>
          Offen · {s.activeDebts.length}
        </button>
        <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
          Alle · {s.debts.length}
        </button>
      </div>

      <div className="content" style={{ paddingTop: 12 }}>
        {/* Summary */}
        {(totalOwed > 0 || totalIOwe > 0) && (
          <div className="stat-grid">
            {totalOwed > 0 && (
              <div className="stat-card stat-card-green">
                <div className="stat-icon-bg bg-green">📥</div>
                <div className="stat-val c-green">{fmtMoney(totalOwed)}</div>
                <div className="stat-lbl">Schulden an mich</div>
              </div>
            )}
            {totalIOwe > 0 && (
              <div className="stat-card stat-card-red">
                <div className="stat-icon-bg bg-red">📤</div>
                <div className="stat-val c-red">{fmtMoney(totalIOwe)}</div>
                <div className="stat-lbl">Ich schulde</div>
              </div>
            )}
          </div>
        )}

        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💶</div>
            <div className="empty-title">Keine Schulden</div>
            <div className="empty-sub">Alle Schulden sind beglichen.</div>
          </div>
        ) : (
          <>
            {theyOweMe.length > 0 && (
              <>
                <div className="section-hd">
                  <span>📥 Sie schulden mir</span>
                  <span className="c-green">{fmtMoney(theyOweMe.reduce((a,d) => a + +d.amount, 0))}</span>
                </div>
                <div className="card">
                  {theyOweMe.map(debt => <DebtRow key={debt.id} debt={debt} />)}
                </div>
              </>
            )}
            {iOweThem.length > 0 && (
              <>
                <div className="section-hd">
                  <span>📤 Ich schulde</span>
                  <span className="c-red">{fmtMoney(iOweThem.reduce((a,d) => a + +d.amount, 0))}</span>
                </div>
                <div className="card">
                  {iOweThem.map(debt => <DebtRow key={debt.id} debt={debt} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)}>+</button>
      {showAdd && <AddMoney onClose={() => setShowAdd(false)} />}
    </>
  )
}

function DebtRow({ debt }) {
  const s      = useAppStore()
  const person = s.person(debt.personId)
  const isThey = debt.direction === 'theyOweMe'

  return (
    <SwipeRow actions={[
      !debt.isPaid && { icon: '✓', label: 'Bezahlt', color: '#00C853', onClick: () => s.markPaid(debt.id) },
      { icon: '🗑', label: 'Löschen', color: '#FF3B30', onClick: () => {
        if (confirm('Schulden löschen?')) s.deleteDebt(debt.id)
      }}
    ].filter(Boolean)}>
      <div className="card-row">
        {person && <Avatar name={person.name} size={40} />}
        <div className="row-main">
          <div className={`row-title${debt.isPaid ? ' strike' : ''}`}>{person?.name ?? '–'}</div>
          <div className={`row-sub${debt.isPaid ? ' strike' : ''}`}>{debt.description}</div>
          <div className="row-sub">{fmtDate(debt.createdAt)}</div>
        </div>
        <div className="row-right">
          <div className="bold" style={{
            color: debt.isPaid ? 'var(--sub)' : isThey ? 'var(--green)' : 'var(--red)',
            textDecoration: debt.isPaid ? 'line-through' : 'none',
            opacity: debt.isPaid ? .5 : 1,
          }}>
            {fmtMoney(debt.amount)}
          </div>
          {debt.isPaid && <div className="row-sub mt4">Bezahlt ✓</div>}
        </div>
      </div>
    </SwipeRow>
  )
}
