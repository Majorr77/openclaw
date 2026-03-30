import { useState } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'

export default function AddMoney({ onClose, preselectedPersonId = null }) {
  const s = useAppStore()

  const [direction,  setDirection]  = useState('theyOweMe')
  const [personMode, setPersonMode] = useState(preselectedPersonId ? 'existing' : (s.people.length ? 'existing' : 'new'))
  const [personId,   setPersonId]   = useState(preselectedPersonId ?? (s.people[0]?.id ?? ''))
  const [newName,    setNewName]    = useState('')
  const [amount,     setAmount]     = useState('')
  const [desc,       setDesc]       = useState('')
  const [date,       setDate]       = useState(new Date().toISOString().slice(0,10))

  const parsedAmount = parseFloat(amount.replace(',', '.'))
  const canSave = !isNaN(parsedAmount) && parsedAmount > 0 && desc.trim() &&
    (personMode === 'existing' ? !!personId : !!newName.trim())

  function save() {
    if (!canSave) return
    let pid = personId
    if (personMode === 'new') pid = s.ensurePerson(newName)
    s.addDebt({ personId: pid, amount: parsedAmount, description: desc.trim(), direction, createdAt: date })
    onClose()
  }

  return (
    <Sheet title="Schulden eintragen" onClose={onClose}>
      <div className="form">

        <div className="form-group">
          <label className="form-label">Richtung</label>
          <div className="seg">
            <button className={`seg-btn${direction==='theyOweMe'?' active':''}`}
              onClick={() => setDirection('theyOweMe')}>📥 Sie schulden mir</button>
            <button className={`seg-btn${direction==='iOweThem'?' active':''}`}
              onClick={() => setDirection('iOweThem')}>📤 Ich schulde</button>
          </div>
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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Betrag</label>
            <div className="amount-wrap">
              <input className="form-input" type="number" inputMode="decimal" placeholder="0,00"
                value={amount} onChange={e => setAmount(e.target.value)} />
              <span className="amount-suffix">€</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Datum</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Wofür?</label>
          <input className="form-input" placeholder="z.B. Abendessen, Benzin…" value={desc}
            onChange={e => setDesc(e.target.value)} />
        </div>

        <button className="save-btn" onClick={save} disabled={!canSave}>Speichern</button>
      </div>
    </Sheet>
  )
}
