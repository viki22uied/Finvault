import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Dashboard from '../pages/Dashboard'
import Transactions from '../pages/Transactions'
import Portfolio from '../pages/Portfolio'
import Insights from '../pages/Insights'
import Settings from '../pages/Settings'
import { useStore } from '../store/useStore'

const pageComponents = {
  dashboard: Dashboard,
  transactions: Transactions,
  portfolio: Portfolio,
  insights: Insights,
  settings: Settings,
}

const ease = [0.25, 0.46, 0.45, 0.94]

function getGreeting() {
  const h = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' })
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getMarketStatus() {
  const d = new Date()
  const dFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
  const parts = dFormat.formatToParts(d)
  
  let day = '', h = 0, m = 0
  for (let p of parts) {
    if (p.type === 'weekday') day = p.value
    if (p.type === 'hour') h = parseInt(p.value)
    if (p.type === 'minute') m = parseInt(p.value)
  }

  if (day === 'Sat' || day === 'Sun') return { label: 'Market Closed', color: 'bg-red-500' }
  
  const timeNum = h * 60 + m
  const openTime = 9 * 60 + 15  // 9:15 AM
  const closeTime = 15 * 60 + 30 // 3:30 PM
  
  if (timeNum < openTime) return { label: 'Pre-Market', color: 'bg-[#FF9933]' }
  if (timeNum >= openTime && timeNum <= closeTime) return { label: 'Market Open', color: 'bg-[#138808]' }
  return { label: 'Market Closed', color: 'bg-white/30' }
}

export default function AppShell() {
  const [active, setActive] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, role } = useStore()
  const Page = pageComponents[active]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="flex h-screen overflow-hidden bg-[#050507]"
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        mobile={{ open: mobileOpen }}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-[56px] px-8 flex items-center justify-between flex-shrink-0 bg-transparent">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            </button>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-body font-normal text-[14px] text-white/50">
                  {getGreeting()},{' '}
                  <span className="text-white font-medium">{user?.name || 'Guest'}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[12px] font-mono text-white/25">
                    {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                  <div className="w-px h-[10px] bg-white/[0.08]" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${getMarketStatus().color}`} />
                    <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest">{getMarketStatus().label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page area with premium transitions */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col min-h-full"
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
