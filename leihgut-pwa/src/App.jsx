import { useState, createContext, useContext } from 'react'
import { useStore } from './store'
import Dashboard from './views/Dashboard'
import Items from './views/Items'
import Loans from './views/Loans'
import Money from './views/Money'

const StoreCtx = createContext(null)
export const useAppStore = () => useContext(StoreCtx)

const TABS = [
  { id: 'dashboard', label: 'Übersicht', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
  )},
  { id: 'items', label: 'Werkzeuge', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>
  )},
  { id: 'loans', label: 'Verliehen', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 21H2V9l5.5-5.5L9 5l-4 4v10.5H9l-.5 1.5zm9 0h5.5V9L16.5 3.5 15 5l4 4V19h-3.5l-.5 2zm-4.5 0h2l.5-2h-3l.5 2zM12 3l-1.5 1.5L12 6l1.5-1.5L12 3zm0 6l-3 3h6l-3-3z"/><path d="M6 12h12v2H6z"/></svg>
  )},
  { id: 'money', label: 'Geld', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21c1.44 0 2.8-.31 4.03-.87l-.95-1.54C13.71 18.83 12.63 19 11.5 19c-4.14 0-7.5-3.36-7.5-7.5S7.36 4 11.5 4s7.5 3.36 7.5 7.5c0 .71-.1 1.39-.27 2.05l1.74.47c.21-.82.33-1.66.33-2.52C21 6.26 16.74 2 11.5 2zm1 5h-1.5v5.25l4.38 2.63.75-1.23-3.63-2.14V7zm8.71 7.29l-3.54 3.54-1.41-1.41-1.06 1.06 2.47 2.47L22.28 15.4l-1.07-1.11z"/></svg>
  )},
]

export default function App() {
  const store = useStore()
  const [tab, setTab] = useState('dashboard')
  const [detail, setDetail] = useState(null) // {type:'person', id}

  return (
    <StoreCtx.Provider value={{ ...store, setDetail }}>
      <div className="app">
        <div className="view">
          {detail ? (
            <PersonDetail personId={detail.id} onBack={() => setDetail(null)} />
          ) : (
            <>
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'items'     && <Items />}
              {tab === 'loans'     && <Loans />}
              {tab === 'money'     && <Money />}
            </>
          )}
        </div>

        <nav className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn${tab === t.id && !detail ? ' active' : ''}`}
              onClick={() => { setDetail(null); setTab(t.id) }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </StoreCtx.Provider>
  )
}

// ── inline PersonDetail to avoid circular import ──────────
import PersonDetail from './views/PersonDetail'
