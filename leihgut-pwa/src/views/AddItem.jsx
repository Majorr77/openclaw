import { useState } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'
import ToolLibrary from './ToolLibrary'

const CATS = [
  { value: 'tool',        label: '🔧 Werkzeug'   },
  { value: 'garden',      label: '🌿 Garten'     },
  { value: 'vehicle',     label: '🚗 Fahrzeug'   },
  { value: 'electronics', label: '⚡ Elektronik'  },
  { value: 'other',       label: '📦 Sonstiges'   },
]

export default function AddItem({ onClose }) {
  const s = useAppStore()
  const [name,        setName]        = useState('')
  const [category,    setCategory]    = useState('tool')
  const [notes,       setNotes]       = useState('')
  const [showLibrary, setShowLibrary] = useState(false)

  function pickFromLibrary(tool) {
    setName(tool.name)
    setCategory(tool.category)
    setShowLibrary(false)
  }

  function save() {
    if (!name.trim()) return
    s.addItem({ name: name.trim(), category, notes })
    onClose()
  }

  if (showLibrary) {
    return <ToolLibrary onSelect={pickFromLibrary} onClose={() => setShowLibrary(false)} />
  }

  return (
    <Sheet title="Werkzeug hinzufügen" onClose={onClose}>
      <div className="form">

        {/* Library button */}
        <button
          onClick={() => setShowLibrary(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'linear-gradient(135deg, rgba(255,107,0,.2), rgba(255,154,60,.1))',
            border: '1.5px solid rgba(255,107,0,.4)',
            borderRadius: 14, padding: '14px 16px',
            color: 'var(--accent)', fontWeight: 700, fontSize: 15,
            cursor: 'pointer', fontFamily: 'inherit', width: '100%',
          }}
        >
          <span style={{ fontSize: 22 }}>📚</span>
          Aus Katalog wählen
          <span style={{ fontSize: 13, opacity: .7, fontWeight: 500 }}>150+ Maschinen</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--sub)', fontSize: 12, fontWeight: 600 }}>ODER MANUELL</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            placeholder="z.B. Bohrmaschine"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kategorie</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notizen (optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Zustand, Modell, Seriennummer…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <button className="save-btn" onClick={save} disabled={!name.trim()}>
          Speichern
        </button>
      </div>
    </Sheet>
  )
}
