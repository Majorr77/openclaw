import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate, fmtMoney } from '../store'
import Avatar from '../components/Avatar'
import SwipeRow from '../components/SwipeRow'
import AddMoney from './AddMoney'

export default function Money() {
  const s = useAppStore()
  const [filter, setFilter] = useState('active')
  const [showAdd, setShowAdd] = useState(false)

  const list = (filter === 'active' ? s.activeDebts : s.debts)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))

  const theyOweMe = list.filter(d => d.direction === 'theyOweMe')
  const iOweThem  = list.filter(d => d.direction === 'iOweThem')

  const totalOwedActive = s.activeDebts.filter(d=>d.direction==='theyOweMe').reduce((a,d)=>a+ +d.amount,0)
  const totalIOweActive = s.activeDebts.filter(d=>d.direction==='iOweThem').reduce((a,d)=>a+ +d.amount,0)

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Geld</span>
        <button className="icon-btn" onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip${filter==='active'?' active':''}`} onClick={() => setFilter('active')}>Offen</button>
        <button className={`filter-chip${filter==='all'?' active':''}`} onClick={() => setFilter('all')}>Alle</button>
      </div>

      <div className="content">
        {/* Summary */}
        {(totalOwedActive > 0 || totalIOweActive > 0) && (
          <div className="stat-grid">
            {totalOwedActive > 0 && (
              <div className="stat-card">
                <div className="stat-icon">📥</div>
                <div className="stat-val c-green">{fmtMoney(totalOwedActive)}</div>
                <div className="stat-lbl">schulden mir</div>
              </div>
            )}
            {totalIOweActive > 0 && (
              <div className="stat-card">
                <div className="stat-icon">📤</div>
                <div className="stat-val c-red">{fmtMoney(totalIOweActive)}</div>
                <div className="stat-lbl">ich schulde</div>
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
                <div className="section-hd" style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>📥 Sie schulden mir</span>
                  <span className="c-green">{fmtMoney(theyOweMe.reduce((a,d)=>a+ +d.amount,0))}</span>
                </div>
                <div className="card">
                  {theyOweMe.map(debt => <DebtRow key={debt.id} debt={debt} />)}
                </div>
              </>
            )}
            {iOweThem.length > 0 && (
              <>
                <div className="section-hd" style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>📤 Ich schulde</span>
                  <span className="c-red">{fmtMoney(iOweThem.reduce((a,d)=>a+ +d.amount,0))}</span>
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
  const s = useAppStore()
  const person = s.person(debt.personId)
  const isThey = debt.direction === 'theyOweMe'

  return (
    <SwipeRow actions={[
      !debt.isPaid && { icon: '✓', label: 'Bezahlt', color: 'var(--green)', onClick: () => s.markPaid(debt.id) },
      { icon: '🗑', label: 'Löschen', color: 'var(--red)', onClick: () => { if(confirm('Schulden löschen?')) s.deleteDebt(debt.id) } }
    ].filter(Boolean)}>
      <div className="card-row">
        {person && <Avatar name={person.name} size={36} />}
        <div className="row-main">
          <div className={`row-title${debt.isPaid?' strike':''}`}>{person?.name ?? '—'}</div>
          <div className={`row-sub${debt.isPaid?' strike':''}`}>{debt.description}</div>
          <div className="row-sub">{fmtDate(debt.createdAt)}</div>
        </div>
        <div className="row-right">
          <div className={`bold${debt.isPaid?' strike':''}`}
            style={{ color: debt.isPaid ? 'var(--sub)' : isThey ? 'var(--green)' : 'var(--red)' }}>
            {fmtMoney(debt.amount)}
          </div>
          {debt.isPaid && <div className="row-sub">Bezahlt</div>}
        </div>
      </div>
    </SwipeRow>
  )
}
