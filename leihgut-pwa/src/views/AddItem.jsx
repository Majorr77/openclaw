import { useState } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'

const CATS = [
  { value: 'tool',        label: '🔧 Werkzeug'  },
  { value: 'garden',      label: '🌿 Garten'    },
  { value: 'vehicle',     label: '🚗 Fahrzeug'  },
  { value: 'electronics', label: '⚡ Elektronik' },
  { value: 'other',       label: '📦 Sonstiges'  },
]

export default function AddItem({ onClose }) {
  const s = useAppStore()
  const [name,     setName]     = useState('')
  const [category, setCategory] = useState('tool')
  const [notes,    setNotes]    = useState('')

  function save() {
    if (!name.trim()) return
    s.addItem({ name: name.trim(), category, notes })
    onClose()
  }

  return (
    <Sheet title="Werkzeug hinzufügen" onClose={onClose}>
      <div className="form">
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
