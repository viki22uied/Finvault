import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function SpringNumber({ value, prefix = "", suffix = "", color = "#fff", delay = 0 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const duration = 1.2
    const num = parseFloat(value.toString().replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return setVal(value)

    const tick = () => {
      const p = Math.min((Date.now() - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(num * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    setTimeout(tick, delay * 1000)
  }, [value, delay])

  const displayVal = typeof val === 'number' ? (val % 1 !== 0 ? val.toFixed(1) : Math.round(val)) : val
  return <span style={{ color }}>{prefix}{displayVal}{suffix}</span>
}

export default function Insights() {
  const { transactions } = useStore()
  
  // Real dynamic insights
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 155000
  const foodSpending = Math.abs(transactions.filter(t => t.category.toLowerCase().includes('food')).reduce((s, t) => s + t.amount, 0))
  const foodPct = income > 0 ? (foodSpending / income * 100).toFixed(1) : 0
  
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)) || 54198
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expenses) / income) * 100)) : 0

  const insights = [
    {
      headline: `Your SIP of ₹10,000/month will grow to ₹23.4L in 10 years at 12% CAGR.`,
      context: "Compound interest is working in your favor. If you increase this by just ₹2k next year, you cut a full year off your timeline.",
      value: 23.4,
      prefix: "₹",
      suffix: "L",
      color: "#138808" // Indian Green
    },
    {
      headline: `You spent ₹${foodSpending.toLocaleString('en-IN')} on food delivery this month — that is ${foodPct}% of your income.`,
      context: "Swiggy and Zomato accounted for the majority of these orders. Consider a Swiggy One or Zomato Gold subscription to offset delivery fees.",
      value: foodPct,
      prefix: "",
      suffix: "%",
      color: "#FF6B6B"
    },
    {
      headline: "RELIANCE gained 3.2% this week. Your holding is now worth ₹1,24,500.",
      context: "Reliance Industries has broken out of its short term consolidation zone. You are up 12% all time.",
      value: "1.24",
      prefix: "₹",
      suffix: "L",
      color: "#F5C842"
    },
    {
      headline: `Your savings rate of ${savingsRate}% ${savingsRate > 29 ? 'beats' : 'is near'} the Indian average of 29%.`,
      context: "You are successfully preserving wealth despite inflationary pressures in the metro areas.",
      value: savingsRate,
      prefix: "",
      suffix: "%",
      color: "#4ECDC4"
    },
    {
      headline: "At current pace you will reach your ₹10L emergency fund goal in 4 months.",
      context: "You are currently banking an average of ₹48,000 every month strictly towards emergency savings in your flexi-FD.",
      value: 4,
      prefix: "",
      suffix: "mo",
      color: "#FF9933" // Saffron
    }
  ]

  const specificInsights = [
    {
      headline: "SIP Tracker",
      context: "Active SIPs: Mirae Asset Large Cap (₹10,000), SBI Small Cap (₹5,000), Axis Bluechip (₹8,000). Total invested: ₹6.4L. Current Value: ₹8.2L.",
      value: 28,
      prefix: "+",
      suffix: "%",
      color: "#138808"
    }
  ]

  const allInsights = [...insights, ...specificInsights]

  const categories = [
    { name: "Housing", current: 85, prev: 85, color: "#8B9EFF" },
    { name: "Food", current: 65, prev: 45, color: "#F5C842" },
    { name: "Transport", current: 30, prev: 35, color: "#4ECDC4" },
    { name: "Shopping", current: 40, prev: 20, color: "#FF6B6B" },
    { name: "SIPs", current: 50, prev: 50, color: "#138808" }
  ]

  return (
    <div className="flex-1 overflow-x-hidden p-6 md:p-12 max-w-4xl mx-auto w-full min-h-full pb-24">
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-[48px]">
        <h1 className="font-display font-[700] text-[36px] text-white tracking-tight">Insights</h1>
        <p className="font-body text-[14px] text-white/50 mt-1">Data journalism for your finances.</p>
      </motion.div>

      <div className="flex flex-col">
        {allInsights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="py-[36px] border-b border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-[24px]"
          >
            <div className="max-w-xl">
              <h2 className="font-display font-[700] text-[24px] text-white leading-tight tracking-tight mb-[12px]">
                {insight.headline}
              </h2>
              <p className="font-body text-[14px] text-white/50 leading-relaxed">
                {insight.context}
              </p>
            </div>
            <div className="font-display font-[700] text-[48px] leading-none text-right flex-shrink-0">
              <SpringNumber value={insight.value} prefix={insight.prefix} suffix={insight.suffix} color={insight.color} delay={i * 0.1} />
            </div>
          </motion.div>
        ))}

        {/* Month over Month Bars */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: allInsights.length * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="py-[36px] flex flex-col gap-[36px]"
        >
          <div className="max-w-xl">
            <h2 className="font-display font-[700] text-[24px] text-white leading-tight tracking-tight mb-[12px]">
              Month-over-month category breakdown.
            </h2>
            <p className="font-body text-[14px] text-white/50 leading-relaxed mb-[24px]">
              Compare your exact spending density across major categories natively. The top bar is this month, the bottom bar is last month.
            </p>
          </div>

          <div className="flex flex-col gap-[24px] max-w-2xl">
            {categories.map((cat, i) => (
              <div key={cat.name} className="flex gap-[24px] items-start">
                <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest w-[80px] pt-[2px]">
                  {cat.name}
                </span>
                <div className="flex-1 flex flex-col gap-[6px] justify-center mt-[4px]">
                  <div className="h-[4px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${cat.current}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="h-full rounded-full"
                      style={{ background: cat.color }}
                    />
                  </div>
                  <div className="h-[4px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${cat.prev}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="h-full rounded-full bg-white/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

    </div>
  )
}
