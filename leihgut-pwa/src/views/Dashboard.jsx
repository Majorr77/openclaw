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

  return (
    <>
      <div className="nav-header">
        <span className="nav-title-lg">Leihgut</span>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => setModal('menu')} title="Hinzufügen">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
      </div>

      <div className="content">
        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-val">{s.items.length}</div>
            <div className="stat-lbl">{s.activeLoans.length} verliehen</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">↔️</div>
            <div className="stat-val">{s.activeLoans.length}</div>
            <div className="stat-lbl">offene Verleihungen</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📥</div>
            <div className="stat-val c-green">{fmtMoney(s.totalTheyOweMe)}</div>
            <div className="stat-lbl">schulden mir</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-val c-red">{fmtMoney(s.totalIOweThem)}</div>
            <div className="stat-lbl">ich schulde</div>
          </div>
        </div>

        {/* Active people */}
        {s.activePeople.length > 0 ? (
          <>
            <div className="section-hd">Was noch aussteht</div>
            <div className="card">
              {s.activePeople.map((p, i) => {
                const loans = s.loansFor(p.id)
                const debts = s.debtsFor(p.id)
                const owes  = debts.filter(d => d.direction === 'theyOweMe').reduce((a,d) => a + +d.amount, 0)
                return (
                  <div key={p.id} className="card-row" style={{ cursor: 'pointer' }}
                    onClick={() => s.setDetail({ type: 'person', id: p.id })}>
                    <Avatar name={p.name} />
                    <div className="row-main">
                      <div className="row-title">{p.name}</div>
                      <div className="row-sub">
                        {loans.length > 0 && `${loans.length} Gegenstand${loans.length > 1 ? '\"e' : ''}`}
                        {loans.length > 0 && owes > 0 && ' · '}
                        {owes > 0 && <span className="c-green">{fmtMoney(owes)}</span>}
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
            <div className="empty-title">Alles zurück!</div>
            <div className="empty-sub">Keine offenen Verleihungen und keine Schulden.</div>
          </div>
        )}

        {/* Quick add buttons */}
        <div className="card">
          <div className="card-row" style={{ cursor: 'pointer' }} onClick={() => setModal('item')}>
            <div className="row-icon bg-orange"><span className="c-orange">🔧</span></div>
            <div className="row-main"><div className="row-title">Werkzeug hinzufügen</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="card-row" style={{ cursor: 'pointer' }} onClick={() => setModal('loan')}>
            <div className="row-icon bg-blue"><span className="c-blue">↔️</span></div>
            <div className="row-main"><div className="row-title">Verleihung eintragen</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="card-row" style={{ cursor: 'pointer' }} onClick={() => setModal('money')}>
            <div className="row-icon bg-green"><span className="c-green">💶</span></div>
            <div className="row-main"><div className="row-title">Schulden eintragen</div></div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {modal === 'item'  && <AddItem  onClose={() => setModal(null)} />}
      {modal === 'loan'  && <AddLoan  onClose={() => setModal(null)} />}
      {modal === 'money' && <AddMoney onClose={() => setModal(null)} />}
    </>
  )
}
