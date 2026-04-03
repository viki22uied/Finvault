import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { formatINR } from '../utils/format'

const categories = ['All', 'Income', 'Entertainment', 'Groceries', 'Transport',
  'Shopping', 'Food & Drink', 'Health', 'Housing', 'Utilities']

function TransactionModal({ tx, onClose, onSave }) {
  const [form, setForm] = useState(
    tx || { date: '', merchant: '', category: 'Shopping', amount: '', type: 'expense' }
  )
  const submit = (e) => {
    e.preventDefault()
    if (!form.date || !form.merchant || !form.amount) return
    onSave({
      ...form,
      amount: form.type === 'expense'
        ? -Math.abs(+form.amount)
        : +Math.abs(+form.amount),
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      {/* Modal remains mostly similar functionally but skinned to fit */}
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        className="bg-[#0c0c10] border border-white/[0.06] rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-display font-700 text-white mb-5">
          {tx ? 'Edit transaction' : 'Add transaction'}
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {[
            { label: 'Date', key: 'date', type: 'date' },
            { label: 'Merchant', key: 'merchant', type: 'text' },
            { label: 'Amount', key: 'amount', type: 'number' },
          ].map(({ label, key, type }) => (
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/30">{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                className="bg-transparent border-b border-white/[0.06] focus:border-[#F5C842] outline-none text-[14px] font-body text-white py-1 transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </label>
          ))}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/30">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-[#0c0c10] border border-white/[0.06] rounded-lg px-3 py-2 text-[13px] font-body text-white outline-none focus:border-[#F5C842]"
            >
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-widest transition-colors ${form.type === t ? 'text-[#F5C842]' : 'text-white/30 hover:text-white/50'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onClose}
              className="flex-1 text-left text-[14px] font-body text-white/40 hover:text-white/70 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="text-right text-[14px] font-body text-[#F5C842] hover:text-[#fff] transition-colors">
              {tx ? 'Save changes' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function Dropdown({ options, selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[14px] font-body text-white/70 hover:text-white transition-colors h-full"
      >
        {selected} <span className="text-[10px] opacity-50">▼</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className="absolute top-full right-0 mt-2 bg-[#131318] border border-white/[0.06] rounded-xl py-2 min-w-[140px] shadow-2xl z-20 max-h-[300px] overflow-y-auto"
          >
            {options.map(opt => (
              <button 
                key={opt}
                onClick={() => { onSelect(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-[13px] font-body ${selected === opt ? 'text-[#F5C842]' : 'text-white/50 hover:text-white hover:bg-white/[0.03]'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, role } = useStore()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = transactions.filter((t) => {
    const matchCat = filter === 'All' || t.category === filter ||
      (filter === 'Income' && t.type === 'income')
    const matchSearch = !search ||
      t.merchant.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSave = (data) => {
    if (data.id) updateTransaction(data.id, data)
    else addTransaction(data)
  }

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-[36px] w-full min-h-full">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="font-display font-[700] text-[36px] text-white tracking-tight">Transactions</h1>
          <p className="font-mono text-[13px] text-white/30">
            {transactions.length} entries
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setModal('add')}
            className="text-[14px] font-body text-white/50 hover:text-white transition-colors"
          >
            + New
          </button>
        )}
      </div>

      {/* Floating Toolbar */}
      <div 
        className="flex items-center gap-4 bg-[#0c0c10]/80 backdrop-blur-xl border border-white/[0.06] rounded-xl px-4 py-3"
      >
        <div className="flex-1 flex items-center">
          <span className="text-white/20 mr-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="search"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[14px] font-body text-white placeholder-white/30"
          />
        </div>
        <div className="h-[20px] w-px bg-white/[0.06] mx-2" />
        <Dropdown options={categories} selected={filter} onSelect={setFilter} />
      </div>

      {/* Editorial List */}
      <div>
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col justify-center items-center">
            <p className="text-[14px] font-body text-white/40">No entries match your search.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((t, i) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group flex flex-col md:flex-row md:items-center justify-between py-[20px] border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 px-2 -mx-2 rounded-lg relative"
              >
                
                {/* Left: Merchant & Date */}
                <div className="flex-1 min-w-[200px]">
                  <p className="font-body text-[15px] text-white leading-tight mb-1">{t.merchant}</p>
                  <p className="font-mono text-[11px] text-white/25">{t.date}</p>
                </div>

                {/* Center Left: Category Pill */}
                <div className="w-[180px] mt-2 md:mt-0">
                  <span className="inline-block bg-white/[0.06] border border-white/[0.1] rounded-full px-[8px] py-[2px] font-mono text-[10px] text-white/60">
                    {t.category}
                  </span>
                </div>

                {/* Center Right: Breathing room implicitly handled by flex flex-1 properties in grid or flex */}
                <div className="flex-1 hidden md:block" />

                {/* Right: Amount & Type */}
                <div className="flex items-end flex-col mt-3 md:mt-0 absolute md:static right-2 bottom-[20px]">
                  <p className="font-mono text-[9px] text-white/20 mb-0.5 tracking-widest">{t.amount > 0 ? 'INC' : 'EXP'}</p>
                  <p className={`font-mono text-[15px] ${t.amount > 0 ? 'text-[#138808]' : 'text-red-500'}`}>
                    {t.amount > 0 ? '+' : ''}{formatINR(Math.abs(t.amount))}
                  </p>
                </div>

                {/* Admin Actions */}
                {role === 'admin' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#050507]/90 px-3 py-1 backdrop-blur-sm rounded-lg md:right-[-60px]">
                    <button onClick={() => setModal(t)} className="text-[12px] font-body text-white/40 hover:text-white transition-colors">Edit</button>
                    <button onClick={() => deleteTransaction(t.id)} className="text-[12px] font-body text-white/40 hover:text-red-500 transition-colors">Delete</button>
                  </div>
                )}
                
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <TransactionModal
            tx={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
