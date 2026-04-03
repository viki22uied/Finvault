import Papa from 'papaparse'

export const loadNSEData = async (csvPath) => {
  const response = await fetch(csvPath)
  const text = await response.text()
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  return result.data
}

export const getStockSummary = (data, symbol) => {
  const stock = data.filter(row => row.Symbol === symbol)
  if (!stock.length) return null
  const latest = stock[stock.length - 1]
  const prev = stock[stock.length - 2] || latest
  
  // Calculate 52 week high/low from all history
  const allCloses = stock.map(s => s.Close)
  const min52 = Math.min(...allCloses)
  const max52 = Math.max(...allCloses)

  return {
    symbol,
    close: latest.Close,
    open: latest.Open,
    high: latest.High,
    low: latest.Low,
    volume: latest.Volume,
    change: latest.Close - prev.Close,
    changePct: ((latest.Close - prev.Close) / prev.Close * 100).toFixed(2),
    history: stock.map(d => ({ date: d.Date, close: d.Close })),
    min52,
    max52
  }
}

export const getTopMovers = (data, count = 5) => {
  const symbols = [...new Set(data.map(d => d.Symbol))]
  return symbols
    .map(s => getStockSummary(data, s))
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, count)
}
