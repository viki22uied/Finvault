import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useStore } from '../store/useStore'

const ease = [0.25, 0.46, 0.45, 0.94]

// Minimal star background consistent with landing page
function StarBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ alpha: true }}
    >
      <Stars radius={100} depth={50} count={3000} factor={3} fade speed={0.4} />
    </Canvas>
  )
}

export default function AuthModal({ mode, setMode, onClose, onSuccess }) {
  // Multi-step flow: 'email' → 'code' → 'success'
  const [step, setStep] = useState('email')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const codeRefs = useRef([])

  const setUser = useStore(s => s.setUser)
  const setRole = useStore(s => s.setRole)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email) { setError('Email is required.'); return }
    if (mode === 'signup' && !form.name) { setError('Name is required.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setStep('code')
  }

  const handleCodeChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...code]
    next[i] = val
    setCode(next)
    if (val && i < 5) codeRefs.current[i + 1]?.focus()
  }

  const handleCodeKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus()
    }
  }

  const handleCodeSubmit = async (e) => {
    e?.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length < 6) { setError('Enter the 6-digit code.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)

    if (mode === 'signin') {
      const stored = JSON.parse(localStorage.getItem('fv_user') || 'null')
      if (!stored || stored.email !== form.email) {
        setError('Account not found. Sign up first.')
        setStep('email')
        return
      }
      const user = { name: stored.name, email: stored.email, role: 'admin' }
      setUser(user); setRole('admin')
      setStep('success')
      setTimeout(() => onSuccess(user), 1500)
    } else {
      const user = { name: form.name, email: form.email, role: 'admin' }
      localStorage.setItem('fv_user', JSON.stringify(user))
      setUser(user); setRole('admin')
      setStep('success')
      setTimeout(() => onSuccess(user), 1500)
    }
  }

  // Auto-submit when all 6 digits entered
  const codeStr = code.join('')
  if (codeStr.length === 6 && step === 'code' && !loading) {
    // handled via useEffect-like pattern via button auto-click — just show submit
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(6,6,8,0.92)', backdropFilter: 'blur(24px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Consistent star background */}
      <StarBackground />

      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: 'rgba(7,7,10,0.95)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '40px',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 font-body text-xl leading-none transition-colors hover:text-cream"
          style={{ color: 'rgba(248,244,237,0.3)' }}
        >
          ×
        </button>

        {/* Logo */}
        <div className="font-display font-800 text-base tracking-tight mb-8">
          FIN<span className="text-gold-400">VAULT</span>
        </div>

        <AnimatePresence mode="wait">

          {/* ── STEP: EMAIL ── */}
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease }}
            >
              <h2 className="font-display font-700 text-3xl mb-1 headline-tight">
                Welcome to FinVault
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: 'rgba(248,244,237,0.45)' }}>
                Your money deserves better.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-mono block mb-2" style={{ color: 'rgba(248,244,237,0.35)' }}>FULL NAME</label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#F8F4ED',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(245,200,66,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-mono block mb-2" style={{ color: 'rgba(248,244,237,0.35)' }}>EMAIL</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#F8F4ED',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(245,200,66,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-400 text-black font-display font-700 py-3.5 rounded-xl hover:bg-gold-500 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Sending code…</span>
                    : 'Continue'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                  className="w-full text-sm font-body hover:text-cream/70 transition-colors text-center"
                  style={{ color: 'rgba(248,244,237,0.3)' }}
                >
                  {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP: CODE ── */}
          {step === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease }}
            >
              <h2 className="font-display font-700 text-3xl mb-1 headline-tight">
                Check your inbox
              </h2>
              <p className="font-body text-sm mb-2" style={{ color: 'rgba(248,244,237,0.45)' }}>
                We sent a 6-digit code to
              </p>
              <p className="font-mono text-sm text-gold-400 mb-8">{form.email}</p>

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                {/* 6-digit code inputs */}
                <div className="flex gap-3 justify-center">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => codeRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(i, e.target.value)}
                      onKeyDown={e => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-mono rounded-xl outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${digit ? 'rgba(245,200,66,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        color: '#F8F4ED',
                      }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && <p className="text-red-400 text-xs font-mono text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || codeStr.length < 6}
                  className="w-full bg-gold-400 text-black font-display font-700 py-3.5 rounded-xl hover:bg-gold-500 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Verifying…</span>
                    : 'Verify code'}
                </button>
              </form>

              <button
                onClick={() => { setStep('email'); setCode(['','','','','','']); setError('') }}
                className="w-full text-sm font-body mt-4 transition-colors text-center"
                style={{ color: 'rgba(248,244,237,0.3)' }}
              >
                ← Back
              </button>
            </motion.div>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 400, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(245,200,66,0.12)', border: '2px solid rgba(245,200,66,0.3)' }}
              >
                <span className="text-3xl text-gold-400">✓</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="font-display font-700 text-2xl mb-2"
              >
                You're in.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="font-body text-sm"
                style={{ color: 'rgba(248,244,237,0.4)' }}
              >
                Loading your vault…
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
