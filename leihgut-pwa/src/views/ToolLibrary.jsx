import { useState, useMemo, useCallback } from 'react'
import { useAppStore } from '../App'
import Sheet from '../components/Sheet'
import { MAKITA_PRODUCTS, MAKITA_CATEGORIES, searchMakitaProducts } from '../data/makitaProducts'

// Kategorie-Mapping: Makita-Kategorie → App-Kategorie
const CATEGORY_MAP = {
  akku_lxt18:  'tool',
  akku_xgt40:  'tool',
  akku_cxt12:  'tool',
  bohren:      'tool',
  beton:       'tool',
  metall:      'tool',
  holz:        'tool',
  garten:      'garden',
  staubsauger: 'tool',
  nagler:      'tool',
  sonstiges:   'other',
}

// Spannung → Badge-Farbe
function VoltageBadge({ voltage }) {
  const colors = {
    '18V':        { bg: 'rgba(10,132,255,0.15)', color: '#0A84FF', border: 'rgba(10,132,255,0.3)' },
    '40V':        { bg: 'rgba(255,107,0,0.15)',  color: '#FF6B00', border: 'rgba(255,107,0,0.3)'  },
    '12V':        { bg: 'rgba(0,200,83,0.15)',   color: '#00C853', border: 'rgba(0,200,83,0.3)'   },
    '230V':       { bg: 'rgba(191,90,242,0.15)', color: '#BF5AF2', border: 'rgba(191,90,242,0.3)' },
    'Druckluft':  { bg: 'rgba(100,100,100,0.15)',color: '#888',    border: 'rgba(100,100,100,0.3)' },
  }
  const style = colors[voltage] || colors['230V']
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 8,
      background: style.bg, color: style.color,
      border: `1px solid ${style.border}`, whiteSpace: 'nowrap',
    }}>
      {voltage}
    </span>
  )
}

export default function ToolLibrary({ onClose, onSelect }) {
  const [query,      setQuery]      = useState('')
  const [catFilter,  setCatFilter]  = useState('')
  const [selected,   setSelected]   = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const results = useMemo(
    () => searchMakitaProducts(query, catFilter).slice(0, 80),
    [query, catFilter]
  )

  function handleSelect(product) {
    setSelected(product)
    setShowConfirm(true)
  }

  function handleConfirm() {
    if (!selected) return
    onSelect({
      name:     selected.name,
      category: CATEGORY_MAP[selected.category] || 'tool',
      notes:    `Makita ${selected.code} · ${selected.subcategory} · ${selected.voltage}`,
    })
    onClose()
  }

  if (showConfirm && selected) {
    return (
      <Sheet title="Werkzeug übernehmen?" onClose={() => setShowConfirm(false)}>
        <div className="form">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-row">
              <div className="row-icon icon-blue" style={{ fontSize: 26 }}>🔧</div>
              <div className="row-main">
                <div className="row-title" style={{ fontSize: 15 }}>{selected.name}</div>
                <div className="row-sub" style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <VoltageBadge voltage={selected.voltage} />
                  <span style={{ color: 'var(--sub)', fontSize: 12 }}>{selected.subcategory}</span>
                </div>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
            Dieses Gerät wird deiner Werkzeugsammlung hinzugefügt. Du kannst Name und Notizen danach noch bearbeiten.
          </p>
          <button className="save-btn" onClick={handleConfirm}>✓ Hinzufügen</button>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              marginTop: 10, width: '100%', background: 'var(--card2)',
              border: '1px solid var(--border)', borderRadius: 14,
              padding: '14px 20px', fontSize: 16, fontWeight: 600,
              color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Zurück zur Suche
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet title="Makita Werkzeugbibliothek" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>

        {/* Suchfeld */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, opacity: 0.5, pointerEvents: 'none',
          }}>🔍</span>
          <input
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Modell oder Bezeichnung suchen…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Kategorie-Filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          <button
            onClick={() => setCatFilter('')}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: !catFilter ? 'var(--accent)' : 'var(--card2)',
              color: !catFilter ? '#fff' : 'var(--text)',
              border: `1px solid ${!catFilter ? 'var(--accent)' : 'var(--border)'}`,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            Alle
          </button>
          {MAKITA_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id === catFilter ? '' : cat.id)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: catFilter === cat.id ? 'var(--accent)' : 'var(--card2)',
                color: catFilter === cat.id ? '#fff' : 'var(--text)',
                border: `1px solid ${catFilter === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Ergebnisanzahl */}
        <div style={{ fontSize: 12, color: 'var(--sub)', paddingLeft: 4 }}>
          {results.length === 80
            ? `80+ Ergebnisse – Suche verfeinern`
            : `${results.length} Gerät${results.length !== 1 ? 'e' : ''} gefunden`}
        </div>

        {/* Produktliste */}
        {results.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '32px 16px', color: 'var(--sub)',
            background: 'var(--card)', borderRadius: 18, border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Keine Geräte gefunden</div>
            <div style={{ fontSize: 13 }}>Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie.</div>
          </div>
        ) : (
          <div className="card">
            {results.map((product, idx) => (
              <div
                key={product.code}
                className="card-row"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelect(product)}
              >
                <div className="row-icon icon-blue" style={{ fontSize: 20, flexShrink: 0 }}>🔧</div>
                <div className="row-main">
                  <div className="row-title" style={{ fontSize: 15 }}>{product.name}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <VoltageBadge voltage={product.voltage} />
                    <span style={{ fontSize: 12, color: 'var(--sub)' }}>{product.subcategory}</span>
                  </div>
                </div>
                <div style={{ color: 'var(--accent)', fontSize: 20, flexShrink: 0 }}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  )
}
