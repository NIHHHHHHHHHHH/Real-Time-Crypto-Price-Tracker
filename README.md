# 💹 Real-Time Crypto Price Tracker

A fully responsive **React + Redux Toolkit** web application that simulates real-time crypto price tracking similar to CoinMarketCap. Prices, volume, and percentage changes are dynamically updated using a mocked WebSocket simulation.

🔗 **Live Demo**: [Real-Time Crypto Tracker](https://nihhhhhhhhhhh.github.io/Real-Time-Crypto-Price-Tracker/)

---


## 🧰 Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **State Management**: Redux Toolkit (`createSlice`, `configureStore`)
- **Real-Time Updates**: Simulated WebSocket using `setInterval`
- **Charts**: Static 7-day mini charts (SVG/image)
- **Deployment**: GitHub Pages

---

## 🛠️ Features

### 📊 Crypto Table

| Feature               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| Asset Info            | #, Logo, Name, Symbol                                                       |
| Price Metrics         | Real-time simulated Price, 1h %, 24h %, 7d %                                |
| Market Metrics        | Market Cap, 24h Volume, Circulating Supply, Max Supply                     |
| Mini Chart            | Static 7-day chart for each asset                                          |
| Color Coding          | Positive % → Green, Negative % → Red                                       |
| Responsive Design     | Fully responsive layout for mobile, tablet, and desktop                    |

---

### 🔄 Real-Time Simulation

- Price, % changes, and volume are updated every **1–2 seconds** using a mocked WebSocket system.
- Updates are **randomly generated** but realistic.
- All state is managed via **Redux**—no local component state for asset data.

---

### 🧠 State Management

- Built using **Redux Toolkit**
- `createSlice` for reducers and actions
- Centralized store via `configureStore`
- Optimized using **selectors** for minimal re-renders

---

## 🚀 Potential Improvements

- 🔌 Integrate real WebSocket data (e.g., from Binance API)
- 🔍 Add filters & sorting (Top gainers, 24h movers, etc.)
- 💾 Store user preferences with `localStorage`
- 📈 Replace static charts with live charting libraries (e.g., Recharts, Chart.js)

---

## 🧪 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/nihhhhhhhhhhh/Real-Time-Crypto-Price-Tracker.git
cd Real-Time-Crypto-Price-Tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
