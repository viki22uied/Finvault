import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const links = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'insights', label: 'Insights' },
  { id: 'settings', label: 'Settings' },
]

export default function Sidebar({ active, setActive, mobile, onClose }) {
  const { user, role, setRole, logout } = useStore()

  const handleRoleSwitch = (newRole) => {
    if (setRole) setRole(newRole)
  }

  const content = (
    <div className="flex flex-col h-full py-8 px-5">
      <div className="mb-12">
        <div className="font-display font-800 text-[16px] tracking-tight select-none">
          <span className="text-white">FIN</span><span className="text-[#F5C842]">VAULT</span>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => { setActive(l.id); onClose?.() }}
            className={`w-full flex items-center text-left text-[13px] font-body transition-colors duration-150 relative
              ${active === l.id ? 'text-white' : 'text-white/[0.35] hover:text-white/60'}`}
          >
            {active === l.id && (
              <motion.div
                layoutId="sidebar-active-border"
                className="absolute -left-5 top-0 bottom-0 w-[2px] bg-[#F5C842]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span>{l.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div>
          <p className="text-[13px] font-body text-white mb-1">{user?.name || 'Guest'}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleRoleSwitch('admin')}
              className={`text-[11px] font-mono transition-colors duration-150 ${role === 'admin' ? 'text-[#F5C842]' : 'text-white/20 hover:text-white/40'}`}
            >
              Admin
            </button>
            <span className="text-white/10 text-[10px]">/</span>
            <button 
              onClick={() => handleRoleSwitch('viewer')}
              className={`text-[11px] font-mono transition-colors duration-150 ${role === 'viewer' ? 'text-[#F5C842]' : 'text-white/20 hover:text-white/40'}`}
            >
              Viewer
            </button>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="text-left text-[13px] text-white/20 hover:text-red-500 transition-colors duration-150 font-body w-max inline-block"
        >
          sign out
        </button>
      </div>
    </div>
  )

  if (mobile) {
    return (
      <AnimatePresence>
        {mobile.open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[200px] z-50 border-r border-white/[0.06] bg-[#050507] md:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop sidebar
  return (
    <div className="w-[200px] h-full border-r border-white/[0.06] flex-shrink-0 bg-[#050507]">
      {content}
    </div>
  )
}
