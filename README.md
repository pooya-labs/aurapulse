# AuraPulse — Market Data & Paper-Trading Studio

**Author:** Pooya Goodarzi  
**Live demo:** [Open AuraPulse](https://pooya-labs.github.io/aurapulse/)  
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


---

## Latest project update — 8 November 2026

The latest interface pass completed the AuraPulse brand mark, browser favicon, and navigation identity, and connected the footer ownership mark to the Pooya Labs Platform. The paper-trading account and its local-only persistence remain simulated; the public Binance feed remains read-only and availability-dependent.

## Project ownership

<p align="center"><a href="https://pooya-labs.github.io/pooya-labs-platform/"><img src="https://raw.githubusercontent.com/pooya-labs/pooya-labs-platform/main/apps/platform/public/brand/pooya-monogram-tile.svg" alt="Pooya Labs Platform monogram" width="96" /></a></p>

**Owned and maintained by [Pooya Labs Platform](https://pooya-labs.github.io/pooya-labs-platform/).** Project direction and engineering: **Pooya Goodarzi**.

## راهنمای فارسی

### معرفی

**AuraPulse** یک داشبورد مرور داده‌های بازار و محیط تمرینی معامله‌گری است. این پروژه برای نمایش تجربهٔ مهندسی رابط کاربری، نمودارهای مالی و شبیه‌سازی محلی طراحی شده و یک کارگزاری یا سرویس مالی واقعی نیست.

### امکانات

- نمایش قیمت‌های عمومی ۲۴ ساعتهٔ بیت‌کوین، اتریوم و سولانا از API عمومی بایننس، در صورت دسترسی مرورگر و دریافت دادهٔ معتبر.
- نمودارهای کندلی و ناحیه‌ای واکنش‌گرا با بازه‌های زمانی قابل انتخاب.
- ابزارهای تحلیلی EMA، باندهای بولینگر، RSI و حجم معاملات.
- پنل دفتر سفارش و شاخص‌های فشار خریدوفروش برای تجربهٔ رابط؛ این داده‌ها شبیه‌سازی‌شده‌اند و دفتر سفارش واقعی بایننس نیستند.
- حساب Paper Trading برای ثبت خریدوفروش فرضی، محاسبهٔ میانگین ورود، موجودی و سودوزیان.
- آزمایشگاه سناریو برای بررسی رفتار نمونه‌ها؛ خروجی آن مدل هوش مصنوعی آموزش‌دیده یا بک‌تست تاریخی محسوب نمی‌شود.

### مرزهای داده و معامله

هیچ سفارش واقعی، پرداخت یا اتصال به حساب معاملاتی انجام نمی‌شود. تاریخچهٔ نمودار نمونه، کندل‌های جایگزین هنگام نبود دادهٔ زنده، عمق دفتر سفارش، امتیازهای ریسک و نشانگرهای تحلیلی نمایشی هستند. حساب تمرینی در حافظهٔ محلی مرورگر نگهداری می‌شود و بین دستگاه‌ها همگام‌سازی نمی‌شود.

### اجرای محلی

به Node.js نسخهٔ ۲۲ و npm نیاز دارید:

```bash
npm ci
npm run dev
```

برای بررسی پیش از ثبت تغییرات:

```bash
npm run typecheck
npm run build
```

### انتشار

نسخهٔ استاتیک با GitHub Actions از شاخهٔ `main` ساخته و روی GitHub Pages منتشر می‌شود. این پروژه صرفاً یک نمونهٔ مهندسی و آموزشی است و توصیهٔ سرمایه‌گذاری ارائه نمی‌کند.

### آخرین تغییرات — ۸ نوامبر ۲۰۲۶

در آخرین به‌روزرسانی، نشان اختصاصی AuraPulse، آیکون تب مرورگر و هویت بصری ناوبری تکمیل شد و نشان مالکیت در فوتر به پلتفرم پویا لبز پیوند خورد. حساب معامله‌گری همچنان کاملاً آزمایشی و محلی است؛ داده‌های عمومی بایننس فقط خواندنی‌اند و به دسترسی API وابسته‌اند.

### مالکیت و نگه‌داری

<p align="center"><a href="https://pooya-labs.github.io/pooya-labs-platform/"><img src="https://raw.githubusercontent.com/pooya-labs/pooya-labs-platform/main/apps/platform/public/brand/pooya-monogram-tile.svg" alt="نشان مونوگرام پویا لبز" width="96" /></a></p>

**مالک و نگه‌دارنده: [پلتفرم پویا لبز](https://pooya-labs.github.io/pooya-labs-platform/)** · طراحی و توسعه: **پویا گودرزی**.
