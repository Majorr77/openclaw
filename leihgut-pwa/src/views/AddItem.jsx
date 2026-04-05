import { useState } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'
import ToolLibrary from './ToolLibrary'

const CATS = [
  { value: 'tool',        label: '🔧 Werkzeug'  },
  { value: 'garden',      label: '🌿 Garten'    },
  { value: 'vehicle',     label: '🚗 Fahrzeug'  },
  { value: 'electronics', label: '⚡ Elektronik' },
  { value: 'other',       label: '📦 Sonstiges'  },
]

export default function AddItem({ onClose }) {
  const s = useAppStore()
  const [name,        setName]        = useState('')
  const [category,    setCategory]    = useState('tool')
  const [notes,       setNotes]       = useState('')
  const [showLibrary, setShowLibrary] = useState(false)

  function save() {
    if (!name.trim()) return
    s.addItem({ name: name.trim(), category, notes })
    onClose()
  }

  // Wird aufgerufen wenn der Nutzer ein Gerät aus der Bibliothek auswählt
  function handleLibrarySelect(data) {
    setName(data.name)
    setCategory(data.category)
    setNotes(data.notes || '')
  }

  if (showLibrary) {
    return (
      <ToolLibrary
        onClose={() => setShowLibrary(false)}
        onSelect={data => {
          handleLibrarySelect(data)
          setShowLibrary(false)
        }}
      />
    )
  }

  return (
    <Sheet title="Werkzeug hinzufügen" onClose={onClose}>
      <div className="form">

        {/* Bibliotheks-Button */}
        <button
          onClick={() => setShowLibrary(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(10,132,255,0.1))',
            border: '1px solid rgba(255,107,0,0.35)',
            borderRadius: 16,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 4,
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 28, lineHeight: 1 }}>🏭</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              Aus Makita-Katalog wählen
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>
              200+ Geräte · LXT 18V · XGT 40V · und mehr
            </div>
          </div>
          <span style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}>›</span>
        </button>

        {/* Trennlinie */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          color: 'var(--sub)', fontSize: 12, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '.5px',
          marginBottom: 4,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          oder manuell eingeben
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" placeholder="z.B. Bohrmaschine" value={name}
            onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Kategorie</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notizen (optional)</label>
          <textarea className="form-textarea" placeholder="Zustand, Modell…" value={notes}
            onChange={e => setNotes(e.target.value)} />
        </div>
        <button className="save-btn" onClick={save} disabled={!name.trim()}>Speichern</button>
      </div>
    </Sheet>
  )
}
