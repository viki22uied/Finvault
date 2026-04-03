import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'
import { getStockSummary } from '../data/nseLoader'
import { formatINR } from '../utils/format'

export default function Portfolio() {
  const { nseData } = useStore()
  const [equities, setEquities] = useState({ 
    total: 0, change: 0, holdings: [] 
  })

  useEffect(() => {
    if (!nseData || !nseData.length) return
    const eqSymbols = [
      { id: 'RELIANCE', name: 'Reliance Industries', units: 5 },
      { id: 'TCS', name: 'Tata Consultancy Svcs', units: 3 },
      { id: 'INFY', name: 'Infosys Ltd', units: 10 },
      { id: 'HDFC', name: 'HDFC Bank', units: 8 },
    ]

    let total = 0
    let prevTotal = 0
    const holdings = eqSymbols.map(sym => {
      const info = getStockSummary(nseData, sym.id)
      if (!info) return null
      const value = info.close * sym.units
      const prevValue = (info.close - info.change) * sym.units
      total += value
      prevTotal += prevValue
      return {
        id: sym.id,
        name: sym.name,
        amount: sym.units,
        value,
        isUp: info.change >= 0,
        change: info.changePct,
        spark: info.history.map(h => ({ v: h.close })),
        min52: info.min52,
        max52: info.max52,
        current: info.close
      }
    }).filter(Boolean)

    setEquities({
      total,
      change: (((total - prevTotal) / prevTotal) * 100).toFixed(2),
      holdings
    })
  }, [nseData])

  const assets = [
    {
      class: 'Equities',
      color: '#FF9933',
      total: equities.total || 42560,
      change: equities.change || 1.8,
      holdings: equities.holdings.length ? equities.holdings : [
        { id: 'RELIANCE', name: 'Reliance Ind.', amount: 5, value: 14750, isUp: true, change: 1.2, spark: [], min52: 2400, max52: 3100, current: 2950 }
      ],
    },
    {
      class: 'Mutual Funds',
      color: '#138808',
      total: 120000,
      change: 2.15,
      holdings: [
        { id: 'MIRAELC', name: 'Mirae Asset Large Cap', amount: '5000 units', value: 50000, isUp: true, spark: [{v:100},{v:101},{v:100},{v:102},{v:103},{v:102},{v:104}], min52: null },
        { id: 'AXISBC', name: 'Axis Bluechip Fund', amount: '2100 units', value: 40000, isUp: true, spark: [{v:80},{v:82},{v:81},{v:83},{v:85},{v:84},{v:86}], min52: null },
        { id: 'SBISC', name: 'SBI Small Cap Fund', amount: '580 units', value: 30000, isUp: false, spark: [{v:50},{v:48},{v:49},{v:46},{v:47},{v:45},{v:42}], min52: null },
      ],
    },
    {
      class: 'Crypto',
      color: '#F5C842',
      total: 1109000,
      change: +8.34,
      holdings: [
        { id: 'BTC', name: 'Bitcoin', amount: 0.18, value: 1008000, isUp: true, spark: [{v:1},{v:2},{v:3},{v:2},{v:4},{v:3},{v:5}], min52: null },
        { id: 'ETH', name: 'Ethereum', amount: 0.18, value: 58000, isUp: true, spark: [{v:2},{v:1},{v:3},{v:4},{v:3},{v:5},{v:6}], min52: null },
        { id: 'SOL', name: 'Solana', amount: 0.23, value: 43000, isUp: false, spark: [{v:5},{v:4},{v:6},{v:4},{v:3},{v:2},{v:1}], min52: null },
      ],
    },
  ]

  const totalValue = assets.reduce((s, a) => s + parseFloat(a.total), 0)

  return (
    <div className="flex-1 overflow-x-hidden p-6 md:p-12 max-w-6xl mx-auto space-y-[36px] w-full min-h-full">
      
      {/* Top Strip */}
      <motion.div 
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-[#0c0c10] border border-white/[0.06] rounded-xl flex flex-col md:flex-row overflow-hidden"
      >
        {assets.map((asset, i) => (
          <div key={asset.class} className={`flex-1 p-[24px] ${i !== assets.length - 1 ? 'md:border-r border-b md:border-b-0 border-white/[0.06]' : ''}`}>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/30 mb-[12px]">{asset.class}</p>
            <div className="flex items-baseline gap-[12px]">
              <p className="font-display font-[700] text-[28px] text-white leading-none">
                {formatINR(asset.total)}
              </p>
              <p className={`font-mono text-[13px] ${asset.change > 0 ? 'text-[#138808]' : 'text-red-500'}`}>
                {asset.change > 0 ? '+' : ''}{asset.change}%
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-[36px]">
        {/* Left Panel: Holdings */}
        <div className="w-full xl:w-[65%] flex flex-col">
          {assets.map((asset, assetIdx) => (
            <div key={asset.class} className="flex flex-col mb-4">
              {asset.holdings.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: (assetIdx * 3 + i) * 0.04, duration: 0.4 }}
                  className="group flex flex-col md:flex-row md:items-center py-[16px] px-4 -mx-4 border-l-2 border-transparent hover:border-l-2 hover:bg-white/[0.015] transition-all cursor-default"
                  style={{ '--hover-border': asset.color }}
                >
                  <style>{`.group:hover { border-left-color: var(--hover-border); }`}</style>
                  
                  <div className="flex items-center gap-[16px] md:gap-[24px] flex-1 mb-4 md:mb-0">
                    <span className="font-mono text-[13px] w-[60px]" style={{ color: asset.color }}>{h.id}</span>
                    <span className="font-body text-[14px] text-white flex-1 truncate">{h.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-[16px] md:gap-[36px] flex-wrap md:flex-nowrap">
                    
                    {/* Range Bar */}
                    {h.min52 && h.max52 ? (
                      <div className="flex flex-col gap-1 w-[80px]">
                        <div className="flex justify-between text-[8px] font-mono text-white/30">
                          <span>{formatINR(h.min52).slice(1).split('.')[0]}</span>
                          <span>{formatINR(h.max52).slice(1).split('.')[0]}</span>
                        </div>
                        <div className="relative h-[2px] bg-white/[0.06] rounded-full">
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full" 
                            style={{ background: asset.color, left: `${((h.current - h.min52) / (h.max52 - h.min52)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-[80px]" />
                    )}

                    <span className="font-mono text-[12px] text-white/40 w-[60px] text-right">{h.amount}</span>
                    <span className="font-mono text-[14px] text-white w-[100px] text-right">{formatINR(h.value)}</span>
                    <div className="w-[60px] h-[20px] hidden md:block">
                      <ResponsiveContainer width={60} height={20}>
                        <LineChart data={h.spark}>
                          <Line type="monotone" dataKey="v" stroke={h.isUp ? '#138808' : '#ef4444'} strokeWidth={1} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              ))}
              {assetIdx !== assets.length - 1 && <div className="h-px w-full bg-white/[0.06] my-2" />}
            </div>
          ))}
        </div>

        {/* Right Panel: Allocation */}
        <div className="w-full xl:w-[35%] flex justify-center xl:justify-end mt-12 xl:mt-0 pt-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex gap-[36px] items-stretch h-[300px]"
          >
            {/* The single vertical bar */}
            <div className="w-[8px] h-full rounded-full overflow-hidden flex flex-col bg-white/[0.06]">
              {assets.map(a => (
                <div key={a.class} style={{ height: `${(a.total / totalValue) * 100}%`, background: a.color }} />
              ))}
            </div>
            
            <div className="flex flex-col justify-between py-2">
              {assets.map(a => (
                <div key={a.class}>
                  <p className="font-display font-[700] text-[20px] text-white mb-1">
                    {((a.total / totalValue) * 100).toFixed(1)}%
                  </p>
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[2px]" style={{ background: a.color }} />
                    <p className="font-mono text-[11px] uppercase tracking-widest text-white/30">{a.class}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
