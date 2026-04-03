import { useState } from 'react'
import { useAppStore } from '../App'
import { fmtMoney } from '../store'
import Avatar from '../components/Avatar'
import AddItem from './AddItem'
import AddLoan from './AddLoan'
import AddMoney from './AddMoney'

export default function Dashboard() {
  const s = useAppStore()
  const [modal, setModal] = useState(null)

  const totalBalance = s.totalTheyOweMe - s.totalIOweThem

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Leihgut</span>
        <button className="icon-btn" onClick={() => setModal('menu')}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-label">Gesamtbilanz</div>
        <div className="hero-amount">{fmtMoney(Math.abs(totalBalance))}</div>
        <div className="hero-row">
          <div className="hero-stat">
            <div className="hero-stat-val">{s.activeLoans.length}</div>
            <div className="hero-stat-lbl">Verliehen</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{fmtMoney(s.totalTheyOweMe)}</div>
            <div className="hero-stat-lbl">Schulden an mich</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-val">{fmtMoney(s.totalIOweThem)}</div>
            <div className="hero-stat-lbl">Ich schulde</div>
          </div>
        </div>
      </div>

      <div className="content">
        {/* Quick actions */}
        <div className="quick-row">
          <button className="quick-btn" onClick={() => setModal('item')}>
            <span className="quick-btn-icon">🔧</span>
            Werkzeug
          </button>
          <button className="quick-btn" onClick={() => setModal('loan')}>
            <span className="quick-btn-icon">↔️</span>
            Verleihen
          </button>
          <button className="quick-btn" onClick={() => setModal('money')}>
            <span className="quick-btn-icon">💶</span>
            Schulden
          </button>
        </div>

        {/* Active people */}
        {s.activePeople.length > 0 ? (
          <>
            <div className="section-hd">Offene Posten</div>
            <div className="card">
              {s.activePeople.map(p => {
                const loans = s.loansFor(p.id)
                const debts = s.debtsFor(p.id)
                const owes  = debts.filter(d => d.direction === 'theyOweMe').reduce((a, d) => a + +d.amount, 0)
                const iOwe  = debts.filter(d => d.direction === 'iOweThem').reduce((a, d) => a + +d.amount, 0)
                return (
                  <div key={p.id} className="card-row" onClick={() => s.setDetail({ type: 'person', id: p.id })}>
                    <Avatar name={p.name} size={44} />
                    <div className="row-main">
                      <div className="row-title">{p.name}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        {loans.length > 0 && (
                          <span className="badge badge-blue">🔧 {loans.length}</span>
                        )}
                        {owes > 0 && (
                          <span className="badge badge-green">↓ {fmtMoney(owes)}</span>
                        )}
                        {iOwe > 0 && (
                          <span className="badge badge-red">↑ {fmtMoney(iOwe)}</span>
                        )}
                      </div>
                    </div>
                    <span className="chevron">›</span>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="empty">
            <div className="empty-icon">✅</div>
            <div className="empty-title">Alles beglichen!</div>
            <div className="empty-sub">Keine offenen Verleihungen oder Schulden.</div>
          </div>
        )}

        {/* Stats */}
        <div className="section-hd">Übersicht</div>
        <div className="stat-grid">
          <div className="stat-card stat-card-orange">
            <div className="stat-icon-bg bg-orange">🔧</div>
            <div className="stat-val c-orange">{s.items.length}</div>
            <div className="stat-lbl">Werkzeuge</div>
          </div>
          <div className="stat-card stat-card-blue">
            <div className="stat-icon-bg bg-blue">↔️</div>
            <div className="stat-val c-blue">{s.activeLoans.length}</div>
            <div className="stat-lbl">Verliehen</div>
          </div>
          <div className="stat-card stat-card-green">
            <div className="stat-icon-bg bg-green">📥</div>
            <div className="stat-val c-green">{fmtMoney(s.totalTheyOweMe)}</div>
            <div className="stat-lbl">Schulden an mich</div>
          </div>
          <div className="stat-card stat-card-red">
            <div className="stat-icon-bg bg-red">📤</div>
            <div className="stat-val c-red">{fmtMoney(s.totalIOweThem)}</div>
            <div className="stat-lbl">Ich schulde</div>
          </div>
        </div>
      </div>

      {modal === 'item'  && <AddItem  onClose={() => setModal(null)} />}
      {modal === 'loan'  && <AddLoan  onClose={() => setModal(null)} />}
      {modal === 'money' && <AddMoney onClose={() => setModal(null)} />}
    </>
  )
}
