import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export default function Settings() {
  const { user, setUser, role, setRole, transactions, logout } = useStore()
  const [name, setName] = useState(user?.name || '')

  // auto-save name after 500ms of no typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (name !== user?.name) setUser({ ...user, name })
    }, 500)
    return () => clearTimeout(t)
  }, [name, setUser, user])

  const exportCSV = () => {
    const rows = [
      ['Date', 'Merchant', 'Category', 'Type', 'Amount'],
      ...transactions.map((t) => [t.date, t.merchant, t.category, t.type, t.amount]),
    ]
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'finvault-export.csv'
    a.click()
  }

  return (
    <div className="flex-1 overflow-x-hidden p-6 md:p-12 max-w-4xl mx-auto w-full min-h-full pb-24">
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-[64px]">
        <h1 className="font-display font-[700] text-[36px] text-white tracking-tight">Settings</h1>
      </motion.div>

      <div className="flex flex-col gap-[64px]">
        
        {/* Profile Group */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h2 className="font-mono text-[11px] text-white/30 tracking-widest uppercase mb-[16px]">Profile</h2>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-[20px] border-b border-white/[0.06] gap-[16px]">
              <span className="font-body text-[14px] text-white/50">Display Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-transparent border-b border-transparent focus:border-[#F5C842] outline-none text-[14px] font-body text-white w-full md:w-[240px] md:text-right pb-1 transition-colors"
                spellCheck="false"
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between py-[20px] border-b border-white/[0.06] gap-[16px]">
              <span className="font-body text-[14px] text-white/50">Access Role</span>
              <div className="flex items-center gap-[8px] justify-start md:justify-end">
                <span className="font-body text-[14px] text-white">
                  You are currently {role === 'admin' ? 'an Admin' : 'a Viewer'}.
                </span>
                <button 
                  onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
                  className="font-body text-[14px] text-white/30 hover:text-[#F5C842] transition-colors"
                >
                  Switch to {role === 'admin' ? 'Viewer' : 'Admin'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Group */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="font-mono text-[11px] text-white/30 tracking-widest uppercase mb-[16px]">Data</h2>
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-[20px] border-b border-white/[0.06] gap-[16px]">
              <span className="font-body text-[14px] text-white/50">Export Transactions</span>
              <button 
                onClick={exportCSV}
                className="font-body text-[14px] text-white/40 hover:text-white transition-colors text-left md:text-right"
              >
                Export transactions as CSV →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Account Group */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="mt-8 flex justify-start">
            <button 
              onClick={logout}
              className="font-body text-[14px] text-white/20 hover:text-[#FF6B6B] transition-colors"
            >
              Sign out of FinVault
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
