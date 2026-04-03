import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICIBANK', 'WIPRO', 'TATAMOTORS', 'SBIN', 'BAJFINANCE', 'HCLTECH'];
const basePrices = {
  RELIANCE: 2950, TCS: 3890, INFY: 1650, HDFC: 1450, ICICIBANK: 1080,
  WIPRO: 480, TATAMOTORS: 980, SBIN: 760, BAJFINANCE: 7100, HCLTECH: 1540
};

let output = 'Date,Symbol,Open,High,Low,Close,Volume\n';
const startDate = new Date('2026-02-15');

symbols.forEach(sym => {
  let prevClose = basePrices[sym];
  
  for (let i = 0; i < 35; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const dateStr = d.toISOString().split('T')[0];
    const change = (Math.random() - 0.48) * 0.02 * prevClose;
    
    const open = prevClose + (Math.random() - 0.5) * 0.01 * prevClose;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.01 * prevClose;
    const low = Math.min(open, close) - Math.random() * 0.01 * prevClose;
    const volume = Math.floor(Math.random() * 1000000 + 500000);
    
    output += `${dateStr},${sym},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${close.toFixed(2)},${volume}\n`;
    prevClose = close;
  }
});

const dir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(path.join(dir, 'nse_data.csv'), output);
console.log('Generated NSE data CSV in public/data/nse_data.csv');
