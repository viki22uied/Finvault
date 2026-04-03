import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { LandingScene } from './ThreeScene'
import CoinHero from './CoinHero'
import AuthModal from './AuthModal'
import { Header } from '@/components/ui/header-2'
import FeatureTabs from './FeatureTabs'
import SectionWithMockup from './SectionWithMockup'
import Footer from '@/components/ui/animated-footer'

const ease = [0.25, 0.46, 0.45, 0.94]

const stats = [
  { value: 24000000, label: '₹ tracked', suffix: 'Cr' },
  { value: 98.7, label: 'Platform uptime', suffix: '%' },
  { value: 10000, label: 'Investors across India', suffix: '+' },
]

function CountUp({ target, suffix, duration = 2 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = (Date.now() - start) / 1000
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setVal(target * eased)
          if (progress < 1) requestAnimationFrame(tick)
        }
        tick()
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])
  const display = target >= 10000000
    ? (val / 10000000).toFixed(1)
    : target % 1 !== 0
      ? val.toFixed(1)
      : Math.round(val).toLocaleString('en-IN')
  return <span ref={ref} className="tabular">{display}{suffix}</span>
}

const ticker = ['RELIANCE ₹2,950', 'TCS ₹3,892', 'INFY ₹1,650', 'HDFC ₹1,450', 'ICICIBANK ₹1,080', 'WIPRO ₹480', 'TATAMOTORS ₹980', 'SBIN ₹760', 'BTC ₹56,42,000', 'ETH ₹2,89,250', 'SOL ₹14,230']

export default function Landing({ onEnter }) {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])

  const openAuth = (mode) => { setAuthMode(mode); setShowAuth(true) }

  return (
    <div className="min-h-screen bg-void text-cream overflow-x-hidden">

      {/* ── Ticker ── */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05]"
        style={{ background: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="overflow-hidden py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="ticker-track flex gap-16 whitespace-nowrap text-[13px] font-mono"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-[#F5C842]">▸</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="pt-8 relative z-40">
        <Header onSignIn={() => openAuth('signin')} onGetStarted={() => openAuth('signup')} />
      </div>

      {/* ── Hero ── */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10"
      >
        <LandingScene />

        <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto px-8 md:px-16 mt-20 md:mt-0">
          <div className="w-full md:w-1/2 max-w-2xl flex-shrink-0 z-20 pt-16 md:pt-0">
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
            className="text-xs font-mono mb-6 flex items-center gap-3"
            style={{ color: 'rgba(245,200,66,0.8)' }}
          >
            <span className="w-8 h-px bg-gold-400 inline-block" />
            Personal finance, reimagined
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="font-display font-800 text-6xl md:text-[88px] headline-tight mb-4"
            style={{ letterSpacing: '-0.03em', lineHeight: 0.95 }}
          >
            Your wealth.<br />
            <span className="text-gold-400" style={{ textShadow: '0 0 60px rgba(245,200,66,0.4)' }}>Visualized.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 1, ease }}
            className="font-mono text-[13px] text-white/35 mb-8"
          >
            Nifty 50 · Sensex · NSE · BSE · Crypto · Mutual Funds
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease }}
            className="font-body text-[18px] leading-relaxed max-w-md mb-10 text-white/50"
          >
            A cinematic dashboard for tracking money, assets and insights. Built different.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => openAuth('signup')}
              className="bg-gold-400 text-black font-display font-700 text-sm px-8 py-4 rounded-full hover:bg-gold-500 transition-all hover:scale-[1.03] active:scale-95 group relative"
              style={{ 
                transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)',
                boxShadow: '0 0 30px rgba(245,200,66,0.35), 0 0 60px rgba(245,200,66,0.15)'
              }}
            >
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ boxShadow: '0 0 40px rgba(245,200,66,0.5), 0 0 80px rgba(245,200,66,0.3)' }} />
              <span className="relative z-10">Start for free</span>
            </button>
            <button
              onClick={() => onEnter({ name: 'Guest', role: 'viewer' })}
              className="glass font-body text-sm px-8 py-4 rounded-full hover:border-white/20 transition-all"
              style={{ color: 'rgba(248,244,237,0.65)', transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
            >
              Continue as guest →
            </button>
          </motion.div>
          </div>
          <div className="w-full md:w-1/2 h-[50vh] md:h-[650px] relative z-10 mt-12 md:mt-0 xl:scale-110">
             <CoinHero />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'rgba(248,244,237,0.2)' }}
        >
          <span className="text-xs font-mono tracking-widest">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* ── Stats ── */}
      <section className="relative py-24 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease }}
            >
              <div className="font-display text-4xl md:text-6xl font-800 text-gold-400 headline-tight">
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <p className="font-body text-sm mt-2" style={{ color: 'rgba(248,244,237,0.3)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Feature Tabs ── */}
      <div id="features">
        <FeatureTabs />
      </div>

      {/* ── Section with Mockup ── */}
      <div id="insights">
        <SectionWithMockup />
      </div>

      {/* ── Dashboard preview ── */}
      <section id="portfolio" className="py-24 px-8 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold-400 text-xs font-mono mb-4"
          >
            — the dashboard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-4xl md:text-5xl font-700 mb-4 headline-tight"
          >
            A dashboard that feels alive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body mb-12 max-w-md mx-auto"
            style={{ color: 'rgba(248,244,237,0.4)' }}
          >
            Not just data. A visual experience that makes you want to check your finances every day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="glass max-w-2xl mx-auto overflow-hidden"
            style={{ borderRadius: 24 }}
          >
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <div className="ml-auto font-mono text-xs" style={{ color: 'rgba(248,244,237,0.2)' }}>finvault.app/dashboard</div>
            </div>

            <div className="p-5">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  ['Total Balance', '₹28,83,150.50', '#F5C842'],
                  ['Monthly Income', '₹1,55,000.00', '#138808'],
                  ['Expenses', '₹54,198.36', '#ef4444'],
                ].map(([l, v, c], i) => (
                  <div key={i} className="rounded-xl p-4 text-left" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs font-body mb-2" style={{ color: 'rgba(248,244,237,0.3)' }}>{l}</p>
                    <p className="font-mono font-500 text-lg tabular" style={{ color: c }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="rounded-xl p-4 h-28 flex items-end gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease }}
                    style={{ background: `rgba(245,200,66,${0.18 + h / 280})` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-8 md:px-16 text-center border-t border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="font-display text-5xl md:text-7xl font-800 mb-6 leading-none headline-tight">
            Ready to take<br />
            <span className="text-gold-400">control?</span>
          </h2>
          <p className="font-body mb-10 max-w-sm mx-auto" style={{ color: 'rgba(248,244,237,0.35)' }}>
            No credit card. No setup. Just your finances, finally making sense.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => openAuth('signup')}
              className="bg-gold-400 text-black font-display font-700 text-sm px-10 py-4 rounded-full hover:bg-gold-500 transition-all hover:scale-105 gold-glow"
            >
              Create free account
            </button>
            <button
              onClick={() => openAuth('signin')}
              className="glass font-body text-sm px-10 py-4 rounded-full hover:border-white/20 transition-all"
              style={{ color: 'rgba(248,244,237,0.65)' }}
            >
              Sign in
            </button>
            <button
              onClick={() => onEnter({ name: 'Guest', role: 'viewer' })}
              className="font-body text-sm px-6 py-4 hover:text-cream/60 transition-colors"
              style={{ color: 'rgba(248,244,237,0.25)' }}
            >
              Guest access →
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Animated Footer ── */}
      <Footer
        leftLinks={[
          { href: '/terms', label: 'Terms & Policies' },
          { href: '/privacy', label: 'Privacy Policy' },
        ]}
        rightLinks={[
          { href: 'https://github.com', label: 'GitHub' },
          { href: 'https://twitter.com', label: 'Twitter' },
          { href: 'https://linkedin.com', label: 'LinkedIn' },
        ]}
        copyrightText="FinVault 2025. All rights reserved."
        barCount={23}
        barColor="#F5C842"
      />

      <AnimatePresence>
        {showAuth && (
          <AuthModal
            mode={authMode}
            setMode={setAuthMode}
            onClose={() => setShowAuth(false)}
            onSuccess={onEnter}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
