import { motion } from 'framer-motion'

const easeOut = { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }

export default function SectionWithMockup({
  title = "Intelligence, delivered to you.",
  description = "Get a personalised weekly brief on your spending, savings rate, and portfolio performance. Your virtual financial analyst, always on.",
  primaryImage = "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&h=800&fit=crop",
  secondaryImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=500&fit=crop",
}) {
  return (
    <section className="py-28 px-8 md:px-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={easeOut}
          className="space-y-6"
        >
          <p className="text-gold-400 text-xs font-mono">— insights</p>
          <h2 className="font-display text-4xl md:text-5xl font-700 leading-tight headline-tight">
            {title}
          </h2>
          <p className="font-body text-base leading-relaxed max-w-md" style={{ color: 'rgba(248,244,237,0.55)' }}>
            {description}
          </p>
          <div className="flex gap-4 pt-2">
            <div className="glass px-5 py-3 text-center" style={{ borderRadius: 16 }}>
              <p className="font-mono text-gold-400 text-2xl font-500 tabular">94%</p>
              <p className="text-xs font-body mt-1" style={{ color: 'rgba(248,244,237,0.4)' }}>Savings accuracy</p>
            </div>
            <div className="glass px-5 py-3 text-center" style={{ borderRadius: 16 }}>
              <p className="font-mono text-emerald-400 text-2xl font-500 tabular">+12%</p>
              <p className="text-xs font-body mt-1" style={{ color: 'rgba(248,244,237,0.4)' }}>Monthly growth</p>
            </div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={easeOut}
          className="relative h-96 md:h-[480px]"
        >
          {/* Primary image */}
          <motion.div
            className="absolute top-0 right-0 w-3/4 h-4/5 glass overflow-hidden"
            style={{ borderRadius: 20 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <img src={primaryImage} alt="Financial insights" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Secondary image */}
          <motion.div
            className="absolute bottom-0 left-0 w-3/5 h-1/2 glass overflow-hidden z-10"
            style={{ borderRadius: 20 }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...easeOut, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <img src={secondaryImage} alt="Portfolio performance" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>

          {/* Decorative glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
