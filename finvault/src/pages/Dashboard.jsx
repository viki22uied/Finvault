import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { useStore } from '../store/useStore'
import { getStockSummary } from '../data/nseLoader'
import { formatINR } from '../utils/format'

const balanceData = [
  { month: 'Jan', balance: 1820000 }, { month: 'Feb', balance: 1980000 },
  { month: 'Mar', balance: 1890000 }, { month: 'Apr', balance: 2140000 },
  { month: 'May', balance: 2210000 }, { month: 'Jun', balance: 2483150 },
]

const ease = [0.25, 0.46, 0.45, 0.94]

function useSpringCountUp(target, duration = 1.2) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 4) // strong ease out
      setVal(target * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    tick()
  }, [target, duration])
  return val
}

const TickerItem = ({ sym, price, changePct }) => {
  const isUp = changePct >= 0
  const digits = price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('')
  
  return (
    <div className="flex items-center gap-[12px] flex-shrink-0">
      <span className="text-white/40 font-mono text-[11px]">{sym}</span>
      <div className="flex text-[13px] font-mono text-white h-[15px] items-center">
        <span className="mr-[4px]">{isUp ? <span className="text-[#138808]">↑</span> : <span className="text-red-400">↓</span>}</span>
        <span className="flex overflow-hidden relative">
          {digits.map((digit, i) => (
            <div key={`${digit}-${i}`} className="relative" style={{ width: digit === ',' || digit === '.' ? '5px' : '8px' }}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={`${digit}-${i}`}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="absolute left-0"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </span>
      </div>
    </div>
  )
}

function LiveTicker() {
  const { nseData } = useStore()
  const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICIBANK', 'WIPRO', 'TATAMOTORS', 'SBIN', 'BAJFINANCE', 'HCLTECH']
  const [dataFlow, setDataFlow] = useState([])

  useEffect(() => {
    if (!nseData.length) return
    const formatted = symbols.map(sym => getStockSummary(nseData, sym)).filter(Boolean)
    
    // Add crypto mock back
    const cryptoMock = [
      { symbol: 'BTC', close: 5642000, changePct: 1.2 },
      { symbol: 'ETH', close: 289250, changePct: 0.8 },
      { symbol: 'SOL', close: 14230, changePct: -2.1 }
    ]
    setDataFlow([...formatted, ...cryptoMock])

    const interval = setInterval(() => {
      setDataFlow(prev => prev.map(item => ({
        ...item,
        close: item.close + (Math.random() - 0.45) * item.close * 0.005
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [nseData])

  if (!dataFlow.length) return null

  return (
    <div className="bg-[#0c0c10] border-y border-white/[0.06] py-[14px] overflow-hidden -mx-6 md:-mx-12 px-6 md:px-12 mb-[24px]">
      <div className="flex gap-[36px] overflow-x-auto scrollbar-none items-center whitespace-nowrap">
        <div className="flex items-center gap-[6px] mr-[12px] flex-shrink-0">
          <div className="w-[6px] h-[6px] rounded-full bg-[#FF9933]" />
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">NSE / CRYPTO</span>
        </div>
        
        {dataFlow.map((stock, idx) => {
          const isCrypto = ['BTC','ETH','SOL'].includes(stock.symbol)
          return (
            <div key={stock.symbol} className="flex items-center gap-[36px]">
              <TickerItem sym={stock.symbol} price={stock.close} changePct={stock.changePct} />
              {idx < dataFlow.length - 1 && (
                <div className={`w-[4px] h-[4px] rounded-full ${isCrypto ? 'bg-[#F5C842]/60' : 'bg-[#FF9933]/60'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#131318] border border-white/[0.06] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white/50 text-[10px] font-mono mb-1">{payload[0].payload.month}</p>
      <p className="text-white text-[13px] font-mono">{formatINR(payload[0].value)}</p>
    </div>
  )
}

export default function Dashboard() {
  const { transactions } = useStore()
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 155000
  const expenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)) || 54198
  const saved = income - expenses
  const wealth = 2483150

  const animatedWealth = useSpringCountUp(wealth)
  const animatedIncome = useSpringCountUp(income)
  const animatedExp = useSpringCountUp(expenses)
  const animatedSaved = useSpringCountUp(saved)
  const animatedRate = useSpringCountUp((saved / income) * 100)

  // Sub data
  const topSpentCat = "Housing"
  const topSpentVal = 25000
  const animatedTop = useSpringCountUp(topSpentVal)

  return (
    <div className="flex-1 overflow-x-hidden p-6 md:p-12 space-y-[36px] pb-24 max-w-6xl">
      
      {/* The Wealth Number */}
      <motion.div 
        initial={{ opacity: 0, y: 6 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease }}
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/30 mb-[12px]">Total wealth</p>
        <p className="font-display font-[700] text-[56px] md:text-[80px] leading-[0.95] text-[#F5C842]" style={{ letterSpacing: '-0.04em' }}>
          {formatINR(animatedWealth)}
        </p>
        <p className="font-body text-[14px] text-[#138808] mt-[12px]">+₹23,410 this month</p>
        <div className="w-full h-px bg-[#F5C842] opacity-15 mt-[24px]" />
      </motion.div>

      {/* Live Ticker */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <LiveTicker />
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        
        {/* Cell 1: Sparkline (Span 2) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.11] transition-colors rounded-2xl relative overflow-hidden md:col-span-2 h-[220px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(245,200,66,0.03),_transparent_60%)]" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">Balance Trend</span>
          </div>
          <div className="absolute inset-0 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C842" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F5C842" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="natural" dataKey="balance" stroke="#F5C842" strokeWidth={2} fillOpacity={1} fill="url(#colorBal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cell 2: This month (Tall) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.11] transition-colors rounded-2xl p-6 md:row-span-2 flex flex-col justify-between min-h-[460px] gap-6"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/30 mb-2">This month</span>
          
          <div className="flex-1 flex flex-col gap-[36px] justify-center">
            <div>
              <p className="font-mono text-[11px] text-white/40 mb-1 tracking-wider uppercase">Income</p>
              <p className="font-display font-[700] text-[20px] text-[#138808] mb-[12px]">{formatINR(animatedIncome)}</p>
              <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-[#138808] w-full" />
              </div>
            </div>
            <div>
              <p className="font-mono text-[11px] text-white/40 mb-1 tracking-wider uppercase">Expenses</p>
              <p className="font-display font-[700] text-[20px] text-red-500 mb-[12px]">{formatINR(animatedExp)}</p>
              <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(expenses/income)*100}%` }} />
              </div>
            </div>
            <div>
              <p className="font-mono text-[11px] text-white/40 mb-1 tracking-wider uppercase">Saved</p>
              <p className="font-display font-[700] text-[20px] text-[#F5C842] mb-[12px]">{formatINR(animatedSaved)}</p>
              <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-[#F5C842]" style={{ width: `${(saved/income)*100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cell 3: Square */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.11] transition-colors rounded-2xl p-6 relative overflow-hidden aspect-square flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(230,126,34,0.04),_transparent_80%)]" />
          <p className="font-display font-[700] text-[32px] text-white leading-none tracking-tight mb-2">{topSpentCat}</p>
          <p className="font-mono text-[16px] text-[#F5C842] mb-[24px]">{formatINR(animatedTop)}</p>
          <p className="font-body text-[12px] text-white/30">Your biggest expense this month.</p>
        </motion.div>

        {/* Cell 5: Square Savings Ring */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.11] transition-colors rounded-2xl relative aspect-square flex flex-col items-center justify-center p-6"
        >
          <div className="relative w-[140px] h-[140px] flex items-center justify-center mb-[18px]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="#F5C842" strokeWidth="3" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - animatedRate / 100)} className="transition-all duration-1000 ease-out" />
            </svg>
            <span className="font-display font-[700] text-[36px] text-white">{Math.round(animatedRate)}%</span>
          </div>
          <span className="font-mono text-[11px] text-white/30 tracking-widest uppercase">savings rate</span>
        </motion.div>

        {/* Cell 4: Span 2 Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-[#0c0c10] border border-white/[0.06] hover:border-white/[0.11] transition-colors rounded-2xl p-6 md:col-span-2 overflow-hidden flex flex-col h-[220px]"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/30 mb-[24px]">Recent Transactions</span>
          
          <div className="flex gap-[18px] overflow-x-auto scrollbar-none pb-4">
            {transactions.slice(0, 4).map((t, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] bg-[#131318] border border-white/[0.06] rounded-xl p-[18px] flex flex-col justify-between">
                <div>
                  <p className="font-body text-[14px] text-white mb-1 truncate">{t.merchant}</p>
                  <p className="font-mono text-[11px] text-white/30">{t.category}</p>
                </div>
                <p className={`font-mono text-[15px] mt-[24px] ${t.amount > 0 ? 'text-[#138808]' : 'text-white'}`}>
                  {t.amount > 0 ? '+' : ''}{formatINR(t.amount)}
                </p>
              </div>
            ))}
            <div className="flex-shrink-0 w-[140px] flex items-center justify-center border border-white/[0.06] rounded-xl p-[18px] hover:bg-[#131318] transition-colors cursor-pointer group">
              <span className="font-body text-[13px] text-white/50 group-hover:text-white transition-colors">View all →</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
