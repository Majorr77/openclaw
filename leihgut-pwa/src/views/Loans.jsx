import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate, isOverdue } from '../store'
import Avatar from '../components/Avatar'
import SwipeRow from '../components/SwipeRow'
import AddLoan from './AddLoan'

export default function Loans() {
  const s = useAppStore()
  const [filter, setFilter] = useState('active') // active | all
  const [showAdd, setShowAdd] = useState(false)

  const list = (filter === 'active' ? s.activeLoans : s.loans)
    .sort((a,b) => new Date(b.lentOn) - new Date(a.lentOn))

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Verliehen</span>
        <button className="icon-btn" onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      <div className="filter-bar">
        <button className={`filter-chip${filter==='active'?' active':''}`} onClick={() => setFilter('active')}>
          Offen ({s.activeLoans.length})
        </button>
        <button className={`filter-chip${filter==='all'?' active':''}`} onClick={() => setFilter('all')}>
          Alle ({s.loans.length})
        </button>
      </div>

      <div className="content">
        {list.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">↔️</div>
            <div className="empty-title">
              {filter === 'active' ? 'Alles zurück!' : 'Noch nichts verliehen'}
            </div>
            <div className="empty-sub">
              {filter === 'active'
                ? 'Keine offenen Verleihungen.'
                : 'Trage deine erste Verleihung ein.'}
            </div>
          </div>
        ) : (
          <div className="card">
            {list.map(loan => {
              const person = s.person(loan.personId)
              const item   = s.item(loan.itemId)
              const overdue = isOverdue(loan)

              return (
                <SwipeRow key={loan.id} actions={[
                  !loan.isReturned && { icon: '✓', label: 'Zurück', color: 'var(--green)', onClick: () => s.markReturned(loan.id) },
                  { icon: '🗑', label: 'Löschen', color: 'var(--red)', onClick: () => { if(confirm('Verleihung löschen?')) s.deleteLoan(loan.id) } }
                ].filter(Boolean)}>
                  <div className="card-row">
                    {person && <Avatar name={person.name} size={36} />}
                    <div className="row-main">
                      <div className={`row-title${loan.isReturned?' strike':''}`}>
                        {item?.name ?? '—'}
                      </div>
                      <div className="row-sub">
                        {person?.name ?? '—'} · {fmtDate(loan.lentOn)}
                      </div>
                      {loan.dueDate && (
                        <div className="row-sub" style={{ color: overdue ? 'var(--red)' : undefined }}>
                          Fällig: {fmtDate(loan.dueDate)}
                        </div>
                      )}
                    </div>
                    <div className="row-right">
                      {loan.isReturned
                        ? <span className="badge badge-green">✓</span>
                        : overdue
                          ? <span className="badge badge-red">⚠ Spät</span>
                          : <span className="badge badge-orange">Offen</span>}
                    </div>
                  </div>
                </SwipeRow>
              )
            })}
          </div>
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)}>+</button>
      {showAdd && <AddLoan onClose={() => setShowAdd(false)} />}
    </>
  )
}
