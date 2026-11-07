# AuraPulse — Market Data & Paper-Trading Studio

**Author:** Pooya Goodarzi  
**Live demo:** [Open AuraPulse](https://pooya16pg-spec.github.io/aurapulse/)  
**Repository:** [pooya-labs/aurapulse](https://github.com/pooya-labs/aurapulse)

AuraPulse is a browser-based market dashboard and paper-trading workspace. It combines a read-only public quote feed with an independent local simulator so the data source and simulated trading activity remain clearly separated.

## What is included

- **Market quotes:** public 24-hour Binance ticker data for BTC, ETH, and SOL when the browser can reach the API and all three symbols return valid data.
- **Market overview:** a quick view of the supported demo instruments, with direct navigation to the selected chart.
- **Charts:** responsive SVG candlesticks or area view, selectable intervals, EMA, Bollinger Bands, RSI, volume, and illustrative demo markers.
- **Order book panel:** generated depth levels and buy/sell pressure for interface exploration. These are simulated, not Binance Level 2 data.
- **Paper account:** local buy/sell calculations, average entry prices, cash balance, position valuation, realized and unrealized P&L, and an illustrative 0.10% fee.
- **Scenario lab:** local bullish/bearish price shocks and an optional 1x paper auto-buy demonstration.
- **Persistence:** paper balance, positions, average entries, and recent order history are saved in this browser's `localStorage`.

## Data and trading boundaries

AuraPulse does **not** connect to a brokerage account, store exchange credentials, or send real orders. Binance is used only as a public read-only ticker source for BTC, ETH, and SOL.

The following are illustrative: seeded chart history, generated candles when live quotes are unavailable, order-book depth, pressure/whale metrics, AI-style markers, risk scores, and the NVDA/AI synthetic demo instrument. The Scenario Lab is not a trained AI model or a historical backtester. Its auto-buy option only creates local paper orders.

The paper account belongs to this browser profile. Clearing site data or opening the demo in another browser/device creates a separate account. Use **Reset demo account** to restore the starter portfolio.

## Getting started

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Next.js. Before submitting changes, run:

```bash
npm run typecheck
npm run build
```

## Deployment

The project uses Next.js static export and is deployed to GitHub Pages from `main` through GitHub Actions. Pull requests run validation without deploying a preview; pushes to `main` build and publish the production site.

The published project is a portfolio/demo experience, not a financial service or a real-money trading platform.
