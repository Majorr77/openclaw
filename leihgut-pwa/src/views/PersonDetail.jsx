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
  const allDebts    = s.debts.filter(d => d.personId === personId)

  const totalTheyOwe = activeDebts.filter(d=>d.direction==='theyOweMe').reduce((a,d)=>a+ +d.amount,0)
  const totalIOwe    = activeDebts.filter(d=>d.direction==='iOweThem').reduce((a,d)=>a+ +d.amount,0)

  return (
    <>
      <div className="nav-header">
        <button className="back-btn" onClick={onBack}>‹ Zurück</button>
        <span className="nav-title">{person.name}</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="content">
        {/* Header */}
        <div className="card">
          <div className="card-row">
            <Avatar name={person.name} size={54} />
            <div className="row-main">
              <div className="row-title" style={{ fontSize: 20, fontWeight: 700 }}>{person.name}</div>
              {person.phone && <div className="row-sub">📞 {person.phone}</div>}
            </div>
          </div>
        </div>

        {/* Summary */}
        {(activeLoans.length > 0 || totalTheyOwe > 0 || totalIOwe > 0) && (
          <div className="card">
            {activeLoans.length > 0 && (
              <div className="card-row">
                <span style={{ fontSize: 20 }}>🔧</span>
                <div className="row-main">
                  <div className="row-title">{activeLoans.length} Gegenstand{activeLoans.length !== 1 ? '"e' : ''} verliehen</div>
                </div>
              </div>
            )}
            {totalTheyOwe > 0 && (
              <div className="card-row">
                <span style={{ fontSize: 20 }}>📥</span>
                <div className="row-main">
                  <div className="row-title c-green">Schuldet mir {fmtMoney(totalTheyOwe)}</div>
                </div>
              </div>
            )}
            {totalIOwe > 0 && (
              <div className="card-row">
                <span style={{ fontSize: 20 }}>📤</span>
                <div className="row-main">
                  <div className="row-title c-red">Ich schulde {fmtMoney(totalIOwe)}</div>
                </div>
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
                    <div className="row-main">
                      <div className="row-title">{item?.name ?? '—'}</div>
                      <div className="row-sub">Seit {fmtDate(loan.lentOn)}</div>
                      {loan.dueDate && (
                        <div className="row-sub" style={{ color: loan.isOverdue ? 'var(--red)' : undefined }}>
                          Fällig: {fmtDate(loan.dueDate)}
                        </div>
                      )}
                    </div>
                    <button className="save-btn" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
                      onClick={() => s.markReturned(loan.id)}>✓ Zurück</button>
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
                  <div className="row-main">
                    <div className="row-title">{debt.description}</div>
                    <div className="row-sub">{fmtDate(debt.createdAt)}</div>
                  </div>
                  <div className="row-right">
                    <div className="bold" style={{ color: debt.direction==='theyOweMe' ? 'var(--green)' : 'var(--red)' }}>
                      {fmtMoney(debt.amount)}
                    </div>
                    <button onClick={() => s.markPaid(debt.id)}
                      style={{ fontSize: 12, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      ✓ Bezahlt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* History */}
        {allLoans.filter(l=>l.isReturned).length > 0 && (
          <>
            <div className="section-hd">Zurückgegeben</div>
            <div className="card">
              {allLoans.filter(l=>l.isReturned).map(loan => {
                const item = s.item(loan.itemId)
                return (
                  <div key={loan.id} className="card-row">
                    <div className="row-main" style={{ opacity: .5 }}>
                      <div className="row-title">{item?.name ?? '—'}</div>
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
        <div className="card">
          <div className="card-row" style={{ cursor: 'pointer' }} onClick={() => setShowLoan(true)}>
            <div className="row-icon bg-blue"><span>↔️</span></div>
            <div className="row-main"><div className="row-title">Weiteres verleihen</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="card-row" style={{ cursor: 'pointer' }} onClick={() => setShowMoney(true)}>
            <div className="row-icon bg-green"><span>💶</span></div>
            <div className="row-main"><div className="row-title">Schulden eintragen</div></div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {showLoan  && <AddLoan  onClose={() => setShowLoan(false)}  preselectedPersonId={personId} />}
      {showMoney && <AddMoney onClose={() => setShowMoney(false)} preselectedPersonId={personId} />}
    </>
  )
}
