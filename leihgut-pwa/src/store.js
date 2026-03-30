import { useState, useEffect, useCallback } from 'react'

// ── helpers ──────────────────────────────────────────────
export function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function fmtMoney(n) {
  return Number(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export function isOverdue(loan) {
  if (!loan.dueDate || loan.isReturned) return false
  return new Date(loan.dueDate) < new Date()
}

// ── persistence ───────────────────────────────────────────
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ── main store hook ───────────────────────────────────────
export function useStore() {
  const [items,  setItemsRaw]  = useState(() => load('lg_items',  []))
  const [people, setPeopleRaw] = useState(() => load('lg_people', []))
  const [loans,  setLoansRaw]  = useState(() => load('lg_loans',  []))
  const [debts,  setDebtsRaw]  = useState(() => load('lg_debts',  []))

  const setItems  = useCallback(v => { const d = typeof v === 'function' ? v(items)  : v; save('lg_items',  d); setItemsRaw(d)  }, [items])
  const setPeople = useCallback(v => { const d = typeof v === 'function' ? v(people) : v; save('lg_people', d); setPeopleRaw(d) }, [people])
  const setLoans  = useCallback(v => { const d = typeof v === 'function' ? v(loans)  : v; save('lg_loans',  d); setLoansRaw(d)  }, [loans])
  const setDebts  = useCallback(v => { const d = typeof v === 'function' ? v(debts)  : v; save('lg_debts',  d); setDebtsRaw(d)  }, [debts])

  // ── derived ──
  const activeLoans = loans.filter(l => !l.isReturned)
  const activeDebts = debts.filter(d => !d.isPaid)

  const person = id => people.find(p => p.id === id)
  const item   = id => items.find(i => i.id === id)

  const isLent = it => activeLoans.some(l => l.itemId === it.id)
  const currentLoan = it => activeLoans.find(l => l.itemId === it.id)

  const loansFor  = personId => activeLoans.filter(l => l.personId === personId)
  const debtsFor  = personId => activeDebts.filter(d => d.personId === personId)

  const activePeople = people
    .filter(p => loansFor(p.id).length > 0 || debtsFor(p.id).length > 0)
    .sort((a, b) => a.name.localeCompare(b.name))

  const totalTheyOweMe = activeDebts.filter(d => d.direction === 'theyOweMe').reduce((s, d) => s + +d.amount, 0)
  const totalIOweThem  = activeDebts.filter(d => d.direction === 'iOweThem').reduce((s, d) => s + +d.amount, 0)

  // ── mutations ──
  function addItem(data)   { setItems(p  => [...p,  { id: uuid(), createdAt: new Date().toISOString(), ...data }]) }
  function addPerson(data) { setPeople(p => [...p,  { id: uuid(), phone: '', notes: '', ...data }]); return null }
  function addLoan(data)   { setLoans(p  => [...p,  { id: uuid(), isReturned: false, returnedOn: null, ...data }]) }
  function addDebt(data)   { setDebts(p  => [...p,  { id: uuid(), createdAt: new Date().toISOString(), isPaid: false, paidOn: null, ...data }]) }

  function markReturned(loanId) {
    setLoans(p => p.map(l => l.id === loanId ? { ...l, isReturned: true, returnedOn: new Date().toISOString() } : l))
  }
  function markPaid(debtId) {
    setDebts(p => p.map(d => d.id === debtId ? { ...d, isPaid: true, paidOn: new Date().toISOString() } : d))
  }
  function deleteItem(id)  { setLoans(p => p.filter(l => l.itemId !== id));   setItems(p  => p.filter(i => i.id !== id)) }
  function deletePerson(id){ setLoans(p => p.filter(l => l.personId !== id)); setDebts(p => p.filter(d => d.personId !== id)); setPeople(p => p.filter(x => x.id !== id)) }
  function deleteLoan(id)  { setLoans(p => p.filter(l => l.id !== id)) }
  function deleteDebt(id)  { setDebts(p => p.filter(d => d.id !== id)) }

  // ensure a person exists by name, return id
  function ensurePerson(name) {
    const trimmed = name.trim()
    const existing = people.find(p => p.name.toLowerCase() === trimmed.toLowerCase())
    if (existing) return existing.id
    const id = uuid()
    setPeople(p => [...p, { id, name: trimmed, phone: '', notes: '' }])
    return id
  }

  return {
    items, people, loans, debts,
    activeLoans, activeDebts,
    activePeople,
    totalTheyOweMe, totalIOweThem,
    person, item, isLent, currentLoan,
    loansFor, debtsFor,
    addItem, addPerson, addLoan, addDebt,
    ensurePerson,
    markReturned, markPaid,
    deleteItem, deletePerson, deleteLoan, deleteDebt,
  }
}
