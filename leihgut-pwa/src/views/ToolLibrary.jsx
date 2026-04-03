import { useState, useMemo } from 'react'
import { TOOL_LIBRARY, GROUPS } from '../toolLibrary'

const CATS = {
  tool:        { icon: '🔧' },
  garden:      { icon: '🌿' },
  vehicle:     { icon: '🚗' },
  electronics: { icon: '⚡' },
  other:       { icon: '📦' },
}

export default function ToolLibrary({ onSelect, onClose }) {
  const [search,      setSearch]      = useState('')
  const [activeGroup, setActiveGroup] = useState(null)

  const filtered = useMemo(() => {
    let list = TOOL_LIBRARY
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q))
    }
    if (activeGroup) {
      list = list.filter(t => t.group === activeGroup)
    }
    return list
  }, [search, activeGroup])

  const groups = useMemo(() => {
    if (search.trim()) return [...new Set(filtered.map(t => t.group))]
    return GROUPS
  }, [search, filtered])

  const byGroup = useMemo(() => {
    const map = {}
    for (const t of filtered) {
      if (!map[t.group]) map[t.group] = []
      map[t.group].push(t)
    }
    return map
  }, [filtered])

  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet" style={{ maxHeight: '95vh' }}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <span className="sheet-title">Werkzeug-Katalog</span>
          <button className="sheet-close" onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: '0 16px 8px' }}>
          <input
            className="form-input"
            placeholder="🔍  Suchen… (z.B. Säge, Schleifer)"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveGroup(null) }}
            autoFocus
          />
        </div>

        {/* Group filter chips */}
        {!search.trim() && (
          <div className="filter-bar" style={{ paddingTop: 0, paddingBottom: 8 }}>
            <button
              className={`filter-chip${!activeGroup ? ' active' : ''}`}
              onClick={() => setActiveGroup(null)}
            >
              Alle ({TOOL_LIBRARY.length})
            </button>
            {groups.map(g => (
              <button
                key={g}
                className={`filter-chip${activeGroup === g ? ' active' : ''}`}
                onClick={() => setActiveGroup(g === activeGroup ? null : g)}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div style={{ overflowY: 'auto', padding: '0 16px 32px' }}>
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: '40px 20px' }}>
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Nichts gefunden</div>
              <div className="empty-sub">Versuche einen anderen Suchbegriff oder füge es manuell hinzu.</div>
            </div>
          ) : (
            Object.entries(byGroup).map(([group, tools]) => (
              <div key={group}>
                <div className="section-hd" style={{ paddingTop: 14 }}>{group}</div>
                <div className="card">
                  {tools.map((tool, i) => (
                    <div
                      key={i}
                      className="card-row"
                      onClick={() => onSelect(tool)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`row-icon ${tool.category === 'garden' ? 'bg-green' : tool.category === 'vehicle' ? 'bg-blue' : tool.category === 'electronics' ? 'bg-orange' : 'bg-gray'}`}>
                        {CATS[tool.category]?.icon ?? '📦'}
                      </div>
                      <div className="row-main">
                        <div className="row-title">{tool.name}</div>
                        <div className="row-sub">{tool.group}</div>
                      </div>
                      <span style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}>+</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
