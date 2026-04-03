import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  {
    id: 'track',
    label: 'Track Everything',
    title: 'All your assets. One beautiful view.',
    desc: 'Track crypto, stocks, ETFs and cash in a unified portfolio. Real-time mock prices update automatically. See your net worth grow with stunning 3D asset visualization.',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800',
    mockMore: 'Deep integration natively matches assets against API-driven bounds safely offline. Supported globally across tier-1 brokerages using completely zero-knowledge protocols.'
  },
  {
    id: 'insights',
    label: 'Understand Spending',
    title: 'Your money, decoded.',
    desc: 'Spending patterns, savings rate, and month-over-month comparisons delivered in elegant charts. Know exactly where every dollar goes without lifting a finger.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    mockMore: 'Advanced heuristic engines auto-categorize roughly 95% of incoming transactions immediately. Generate smart weekly digests that natively capture any sudden deviations in expenditure.'
  },
  {
    id: 'control',
    label: 'Stay in Control',
    title: 'Your vault. Your rules.',
    desc: 'Admin or Viewer mode. Add, edit and manage transactions with full control. Share a read-only view with partners or advisors. Role-based access built in.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
    mockMore: 'Viewer links degrade completely after exactly 48 hours for extreme privacy. External partners strictly access compiled PDFs while you retain full root-level logic controls.'
  },
]

const easeOut = { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }

export default function FeatureTabs() {
  const [active, setActive] = useState(0)
  const [openLearn, setOpenLearn] = useState(false)
  const tab = tabs[active]

  useEffect(() => setOpenLearn(false), [active])

  return (
    <section className="py-28 px-8 md:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gold-400 text-xs font-mono mb-4"
        >
          — what you get
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={easeOut}
          className="font-display text-4xl md:text-5xl font-700 mb-12 max-w-xl leading-tight headline-tight"
        >
          Everything you need to understand your money
        </motion.h2>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className="relative px-5 py-2.5 rounded-full text-sm font-body font-500 transition-all duration-300"
              style={{
                background: active === i ? 'rgba(245,200,66,0.12)' : 'rgba(255,255,255,0.04)',
                color: active === i ? '#F5C842' : 'rgba(248,244,237,0.5)',
                border: `1px solid ${active === i ? 'rgba(245,200,66,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {active === i && (
                <motion.div
                  layoutId="tab-highlight"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(245,200,66,0.08)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={easeOut}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Text side */}
            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-700 leading-tight headline-tight">
                {tab.title}
              </h3>
              <p className="font-body text-base leading-relaxed" style={{ color: 'rgba(248,244,237,0.55)' }}>
                {tab.desc}
              </p>
              <button 
                onClick={() => setOpenLearn(!openLearn)}
                className="flex items-center gap-2 text-gold-400 text-sm font-mono hover:text-gold-300 transition-colors"
              >
                <div className="relative w-6 h-4 flex items-center justify-center">
                   <span className="absolute w-6 h-px bg-gold-400" />
                   <span className={`absolute w-6 h-px bg-gold-400 transition-transform duration-300 ${openLearn ? 'rotate-90 opacity-100' : 'rotate-0 opacity-0'}`} />
                </div>
                {openLearn ? 'Collapse details' : 'Learn more'}
              </button>

              <AnimatePresence>
                {openLearn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <p className="font-mono text-[13px] leading-relaxed pl-6 border-l border-gold-400/30" style={{ color: 'rgba(248,244,237,0.45)' }}>
                      {tab.mockMore}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Image side */}
            <div className="glass overflow-hidden" style={{ borderRadius: 20 }}>
              <motion.img
                src={tab.image}
                alt={tab.title}
                className="w-full h-72 md:h-80 object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
