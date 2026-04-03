# FinVault — Cinematic Financial Intelligence

![FinVault Hero](/public/finvault_hero.png)

## 🌌 The Vision
**FinVault** is not just another personal finance tracker. It is a high-fidelity, cinematic experience designed for the modern investor. Built with a focus on **visual excellence**, it transforms mundane financial data into a live, interactive landscape of wealth.

Whether you're tracking the **Nifty 50**, monitoring **Sensex** performance, or managing your **Crypto** and **Mutual Funds**, FinVault provides a premium dashboard that feels "alive."

## ✨ Core Features

### 🏛️ Cinematic Dashboard
- **3D Hero Scene**: Experience a photorealistic financial environment with metallic coin animations and glassmorphic UI elements.
- **Dynamic Market Status**: Real-time indicators of Indian market hours (Pre-market, Open, Closed) based on IST.
- **Fluid Transitions**: Every interaction is powered by `framer-motion` for buttery-smooth animations.

### 📈 Indian Market Data (NSE/BSE)
- **Live Ticker**: Track major Indian stocks (RELIANCE, TCS, HDFC, etc.) and global assets (BTC, ETH) in a sleek marquee.
- **NSE Dataset Integration**: Comprehensive support for tracking NSE-specific tickers and market movements.
- **Currency Intelligence**: Full support for Indian Rupee (INR) formatting, including Lakhs and Crores.

### 🛡️ Portfolio Management
- **Transaction Tracking**: Add, edit, and categorize your income and expenses with ease.
- **Insightful Visualization**: View your spending habits through elegant bar charts and glassmorphic summary cards.
- **Role-Based Views**: Toggle between 'Admin' (full edit access) and 'Viewer' (read-only) modes dynamically.

## 🛠️ Technical Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Charting**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/viki22uied/Finvault.git
   ```
2. Install dependencies:
   ```bash
   cd finvault/finvault
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
finvault/
├── src/
│   ├── components/       # Reusable UI components & 3D scenes
│   ├── pages/            # Main application views (Dashboard, Portfolio, etc.)
│   ├── store/            # Zustand state management
│   ├── data/             # Market data loaders & static assets
│   ├── lib/              # Utility functions (cn, formatting)
│   └── App.jsx           # Main application entry point
├── public/               # Static assets & market CSVs
└── tailwind.config.js    # Design system configuration
```

## 💎 Design System
FinVault uses a curated color palette and typography system:
- **Colors**: `Gold-400 (#F5C842)`, `Void (#050507)`, `Cream (#F8F4ED)`.
- **Typography**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for a premium architectural feel.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with 💛 for the Indian investment community.
