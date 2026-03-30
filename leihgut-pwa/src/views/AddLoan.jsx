import { useState } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'

export default function AddLoan({ onClose, preselectedItem = null, preselectedPersonId = null }) {
  const s = useAppStore()

  const availableItems = s.items.filter(i => !s.isLent(i))

  const [itemId,      setItemId]      = useState(preselectedItem?.id ?? (availableItems[0]?.id ?? ''))
  const [personMode,  setPersonMode]  = useState(preselectedPersonId ? 'existing' : (s.people.length ? 'existing' : 'new'))
  const [personId,    setPersonId]    = useState(preselectedPersonId ?? (s.people[0]?.id ?? ''))
  const [newName,     setNewName]     = useState('')
  const [lentOn,      setLentOn]      = useState(new Date().toISOString().slice(0,10))
  const [hasDue,      setHasDue]      = useState(false)
  const [dueDate,     setDueDate]     = useState('')
  const [notes,       setNotes]       = useState('')

  const canSave = itemId &&
    (personMode === 'existing' ? !!personId : !!newName.trim())

  function save() {
    if (!canSave) return
    let pid = personId
    if (personMode === 'new') pid = s.ensurePerson(newName)
    s.addLoan({ itemId, personId: pid, lentOn, dueDate: hasDue && dueDate ? dueDate : null, notes })
    onClose()
  }

  const itemsToShow = preselectedItem ? [preselectedItem] : availableItems

  return (
    <Sheet title="Verleihung eintragen" onClose={onClose}>
      <div className="form">

        <div className="form-group">
          <label className="form-label">Werkzeug</label>
          {itemsToShow.length === 0 ? (
            <div style={{ color: 'var(--sub)', fontSize: 14, padding: '10px 0' }}>
              Keine verfügbaren Werkzeuge. Lege zuerst ein Werkzeug an.
            </div>
          ) : (
            <select className="form-select" value={itemId} onChange={e => setItemId(e.target.value)}>
              {itemsToShow.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Person</label>
          <div className="seg" style={{ marginBottom: 8 }}>
            <button className={`seg-btn${personMode==='existing'?' active':''}`}
              onClick={() => setPersonMode('existing')} disabled={s.people.length === 0}>
              Gespeichert
            </button>
            <button className={`seg-btn${personMode==='new'?' active':''}`}
              onClick={() => setPersonMode('new')}>
              Neu
            </button>
          </div>
          {personMode === 'existing' ? (
            <select className="form-select" value={personId} onChange={e => setPersonId(e.target.value)}>
              {s.people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          ) : (
            <input className="form-input" placeholder="Name der Person" value={newName}
              onChange={e => setNewName(e.target.value)} />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Verliehen am</label>
          <input className="form-input" type="date" value={lentOn} onChange={e => setLentOn(e.target.value)} />
        </div>

        <div className="form-toggle">
          <label>Rückgabedatum</label>
          <label className="toggle">
            <input type="checkbox" checked={hasDue} onChange={e => setHasDue(e.target.checked)} />
            <div className="toggle-track" />
            <div className="toggle-thumb" />
          </label>
        </div>

        {hasDue && (
          <div className="form-group">
            <label className="form-label">Fällig am</label>
            <input className="form-input" type="date" value={dueDate}
              min={lentOn} onChange={e => setDueDate(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Notizen (optional)</label>
          <textarea className="form-textarea" placeholder="…" value={notes}
            onChange={e => setNotes(e.target.value)} />
        </div>

        <button className="save-btn" onClick={save} disabled={!canSave || itemsToShow.length === 0}>
          Speichern
        </button>
      </div>
    </Sheet>
  )
}
