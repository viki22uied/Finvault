import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing'
import AppShell from './components/AppShell'
import { useStore } from './store/useStore'
import { loadNSEData } from './data/nseLoader'

export default function App() {
  const { user, setUser, setRole } = useStore()
  const [entered, setEntered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('fv_user') || 'null')
    if (stored && user) setEntered(true)
    
    // Load NSE dataset
    loadNSEData('/data/nse_data.csv').then(data => {
      useStore.getState().setNSEData(data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const handleEnter = (userData) => {
    setUser(userData)
    setRole(userData.role || 'viewer')
    setEntered(true)
  }

  useEffect(() => {
    const unsub = useStore.subscribe(
      s => s.user,
      u => { if (!u) setEntered(false) }
    )
    return unsub
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
        className="font-display text-gold-400 text-2xl font-800">FIN<span className="text-white">VAULT</span></motion.div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <Landing onEnter={handleEnter} />
        </motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-screen">
          <AppShell />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
