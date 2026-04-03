import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtDate, fmtMoney } from '../store'
import Avatar from '../components/Avatar'
import AddLoan from './AddLoan'
import AddMoney from './AddMoney'

export default function PersonDetail({ personId, onBack }) {
  const s = useAppStore()
  const [showLoan,  setShowLoan]  = useState(false)
  const [showMoney, setShowMoney] = useState(false)

  const person = s.person(personId)
  if (!person) return null

  const activeLoans = s.loansFor(personId)
  const activeDebts = s.debtsFor(personId)
  const allLoans    = s.loans.filter(l => l.personId === personId)

  const totalTheyOwe = activeDebts.filter(d => d.direction === 'theyOweMe').reduce((a, d) => a + +d.amount, 0)
  const totalIOwe    = activeDebts.filter(d => d.direction === 'iOweThem').reduce((a, d) => a + +d.amount, 0)

  return (
    <>
      <div className="nav-header">
        <button className="back-btn" onClick={onBack}>‹ Zurück</button>
        <span className="nav-title">{person.name}</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="content" style={{ paddingTop: 16 }}>
        {/* Person header */}
        <div className="person-card">
          <Avatar name={person.name} size={60} />
          <div className="person-card-info">
            <div className="person-card-name">{person.name}</div>
            {person.phone && <div className="person-card-sub">📞 {person.phone}</div>}
          </div>
        </div>

        {/* Balance summary */}
        {(activeLoans.length > 0 || totalTheyOwe > 0 || totalIOwe > 0) && (
          <div className="stat-grid">
            {activeLoans.length > 0 && (
              <div className="stat-card stat-card-blue">
                <div className="stat-icon-bg bg-blue">🔧</div>
                <div className="stat-val c-blue">{activeLoans.length}</div>
                <div className="stat-lbl">Gegenstände</div>
              </div>
            )}
            {totalTheyOwe > 0 && (
              <div className="stat-card stat-card-green">
                <div className="stat-icon-bg bg-green">📥</div>
                <div className="stat-val c-green">{fmtMoney(totalTheyOwe)}</div>
                <div className="stat-lbl">Schuldet mir</div>
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

        {/* Active loans */}
        {activeLoans.length > 0 && (
          <>
            <div className="section-hd">Verliehene Gegenstände</div>
            <div className="card">
              {activeLoans.map(loan => {
                const item = s.item(loan.itemId)
                return (
                  <div key={loan.id} className="card-row">
                    <div className="row-icon bg-orange" style={{ fontSize: 20 }}>🔧</div>
                    <div className="row-main">
                      <div className="row-title">{item?.name ?? '–'}</div>
                      <div className="row-sub">Seit {fmtDate(loan.lentOn)}</div>
                      {loan.dueDate && (
                        <div className="row-sub" style={{ color: loan.isOverdue ? 'var(--red)' : undefined }}>
                          Fällig: {fmtDate(loan.dueDate)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => s.markReturned(loan.id)}
                      style={{ background: 'rgba(0,200,83,.2)', color: 'var(--green)', border: 'none',
                               borderRadius: 12, padding: '8px 14px', fontWeight: 700,
                               fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                      ✓ Zurück
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Active debts */}
        {activeDebts.length > 0 && (
          <>
            <div className="section-hd">Offene Schulden</div>
            <div className="card">
              {activeDebts.map(debt => (
                <div key={debt.id} className="card-row">
                  <div className={`row-icon ${debt.direction === 'theyOweMe' ? 'bg-green' : 'bg-red'}`}>
                    {debt.direction === 'theyOweMe' ? '📥' : '📤'}
                  </div>
                  <div className="row-main">
                    <div className="row-title">{debt.description}</div>
                    <div className="row-sub">{fmtDate(debt.createdAt)}</div>
                  </div>
                  <div className="row-right">
                    <div className="bold" style={{ color: debt.direction === 'theyOweMe' ? 'var(--green)' : 'var(--red)' }}>
                      {fmtMoney(debt.amount)}
                    </div>
                    <button onClick={() => s.markPaid(debt.id)}
                      style={{ fontSize: 12, color: 'var(--green)', background: 'none',
                               border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: 4 }}>
                      ✓ Bezahlt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Returned history */}
        {allLoans.filter(l => l.isReturned).length > 0 && (
          <>
            <div className="section-hd">Zurückgegeben</div>
            <div className="card">
              {allLoans.filter(l => l.isReturned).map(loan => {
                const item = s.item(loan.itemId)
                return (
                  <div key={loan.id} className="card-row" style={{ opacity: .5 }}>
                    <div className="row-main">
                      <div className="row-title">{item?.name ?? '–'}</div>
                      <div className="row-sub">{fmtDate(loan.lentOn)} → {fmtDate(loan.returnedOn)}</div>
                    </div>
                    <span className="badge badge-green">✓</span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Quick actions */}
        <div className="quick-row">
          <button className="quick-btn" onClick={() => setShowLoan(true)}>
            <span className="quick-btn-icon">↔️</span>
            Verleihen
          </button>
          <button className="quick-btn" onClick={() => setShowMoney(true)}>
            <span className="quick-btn-icon">💶</span>
            Schulden
          </button>
        </div>
      </div>

      {showLoan  && <AddLoan  onClose={() => setShowLoan(false)}  preselectedPersonId={personId} />}
      {showMoney && <AddMoney onClose={() => setShowMoney(false)} preselectedPersonId={personId} />}
    </>
  )
}
