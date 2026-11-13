"use client";

import React, { useEffect } from "react";
import { useAuraStore, AssetSymbol, BinanceMarketUpdate } from "../store/useAuraStore";
import TopNav from "../components/TopNav";
import LiveCanvasChart from "../components/LiveCanvasChart";
import OrderBookPanel from "../components/OrderBookPanel";
import TradeTicketPanel from "../components/TradeTicketPanel";
import PortfolioPositions from "../components/PortfolioPositions";
import CommandPaletteModal from "../components/CommandPaletteModal";
import SmartAssetImage from "../components/SmartAssetImage";
import { Cpu, ExternalLink, Flame, Terminal } from "lucide-react";

type BinanceTickerRow = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  quoteVolume: string;
};

export default function AuraPulseTerminalPage() {
  const {
    tickMarket,
    lang,
    theme,
    workspace,
    assets,
    setSelectedSymbol,
    setWorkspace,
    aiLogs,
    triggerMarketShock,
    applyBinanceTickerData,
    setBinanceConnected,
    hydratePaperAccount,
    isAutoBotActive,
    toggleAutoBot,
    isBinanceConnected,
  } = useAuraStore();

  // Public Binance 24h tickers are read-only; order placement remains local paper trading.
  useEffect(() => {
    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    hydratePaperAccount();
    let active = true;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let simulationTimer: ReturnType<typeof setInterval> | undefined;
    let controller: AbortController | null = null;

    const fetchMarketData = async () => {
      const requestController = new AbortController();
      controller = requestController;
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22SOLUSDT%22%5D",
          { signal: requestController.signal, cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Binance returned HTTP ${res.status}`);

        const rows = (await res.json()) as BinanceTickerRow[];
        const updates: Partial<Record<AssetSymbol, BinanceMarketUpdate>> = {};
        rows.forEach((row) => {
          const mapping: Record<string, AssetSymbol> = {
            BTCUSDT: "BTC/USD",
            ETHUSDT: "ETH/USD",
            SOLUSDT: "SOL/USD",
          };
          const symbol = mapping[row.symbol];
          const price = Number(row.lastPrice);
          const change24h = Number(row.priceChangePercent);
          const high24h = Number(row.highPrice);
          const low24h = Number(row.lowPrice);
          const quoteVolume = Number(row.quoteVolume);
          if (
            symbol &&
            Number.isFinite(price) && price > 0 &&
            Number.isFinite(change24h) &&
            Number.isFinite(high24h) && Number.isFinite(low24h)
          ) {
            updates[symbol] = {
              price,
              change24h,
              high24h,
              low24h,
              volume24h: Number.isFinite(quoteVolume)
                ? `${quoteVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : "—",
            };
          }
        });

        const hasCompleteFeed =
          updates["BTC/USD"] !== undefined &&
          updates["ETH/USD"] !== undefined &&
          updates["SOL/USD"] !== undefined;

        if (active) {
          if (hasCompleteFeed) applyBinanceTickerData(updates);
          setBinanceConnected(hasCompleteFeed);
        }
      } catch (error) {
        if (active && !(error instanceof DOMException && error.name === "AbortError")) {
          setBinanceConnected(false);
        }
      } finally {
        if (active && !document.hidden && controller === requestController) {
          pollTimer = setTimeout(fetchMarketData, 10000);
        }
      }
    };

    const pauseBackgroundWork = () => {
      if (pollTimer) clearTimeout(pollTimer);
      pollTimer = undefined;
      if (simulationTimer) clearInterval(simulationTimer);
      simulationTimer = undefined;
      controller?.abort();
    };

    const resumeBackgroundWork = () => {
      if (document.hidden) return;
      if (!simulationTimer) simulationTimer = setInterval(tickMarket, 1400);
      if (!pollTimer && !controller) void fetchMarketData();
      else if (!pollTimer && controller?.signal.aborted) void fetchMarketData();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pauseBackgroundWork();
      else resumeBackgroundWork();
    };

    resumeBackgroundWork();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      pauseBackgroundWork();
    };
  }, [tickMarket, applyBinanceTickerData, setBinanceConnected, hydratePaperAccount]);

  const themeClass =
    theme === "PURPLE"
      ? "spatial-bg-purple"
      : theme === "GOLD"
      ? "spatial-bg-gold"
      : "spatial-bg-emerald";

  const symbols = Object.keys(assets) as AssetSymbol[];

  return (
    <div className={`aurapulse-page min-h-[100svh] min-h-[100dvh] ${themeClass} flex flex-col overflow-x-clip`}>
      <TopNav />

      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 space-y-4 sm:space-y-5 min-w-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {workspace === "TERMINAL" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 items-stretch">
              <div className="sm:col-span-2 lg:col-span-6 min-w-0">
                <LiveCanvasChart />
              </div>
              <div className="min-w-0 lg:col-span-3">
                <OrderBookPanel />
              </div>
              <div className="lg:col-span-3 min-w-0">
                <TradeTicketPanel />
              </div>
            </div>
            <PortfolioPositions />
          </>
        )}

        {workspace === "HEATMAP" && (
          <div
            dir={lang === "fa" ? "rtl" : "ltr"}
            className="cyber-card rounded-2xl border border-white/15 p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  {lang === "fa"
                    ? "نمای کلی بازار"
                    : "Market Overview"}
                </h2>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                {isBinanceConnected
                  ? "BINANCE LIVE: BTC / ETH / SOL • NVDA/AI: SYNTHETIC"
                  : "SIMULATED FALLBACK • WAITING FOR BINANCE"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {symbols.map((sym) => {
                const a = assets[sym];
                const up = a.change24h >= 0;
                return (
                  <div
                    key={sym}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      setWorkspace("TERMINAL");
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                      up
                        ? "bg-gradient-to-br from-emerald-500/25 via-[#050B14] to-cyan-500/15 border-emerald-400/50"
                        : "bg-gradient-to-br from-rose-500/25 via-[#050B14] to-amber-500/15 border-rose-400/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-lg text-white">
                        {sym}
                      </span>
                      <span
                        dir="ltr"
                        className={`font-mono text-xs px-2.5 py-1 rounded-full font-bold ${
                          up
                            ? "bg-emerald-400 text-slate-950"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {up ? "+" : ""}
                        {a.change24h}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {a.name[lang]}
                    </div>
                    <div className="text-2xl font-mono font-black text-white mt-4">
                      ${a.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>
            <PortfolioPositions />
          </div>
        )}

        {workspace === "AILAB" && (
          <div
            dir={lang === "fa" ? "rtl" : "ltr"}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            <div className="lg:col-span-7 cyber-card rounded-2xl border border-white/15 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-white">
                    {lang === "fa"
                      ? "آزمایشگاه سناریوهای محلی بازار"
                      : "Local Market Scenario Lab"}
                  </h2>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PAPER TRADING ENGINE
                </span>
              </div>

              <p className="text-xs leading-6 text-slate-400">
                {lang === "fa"
                  ? "این بخش فقط سناریوهای ساختگی را روی قیمت‌های نمایشی و حساب آزمایشی محلی اجرا می‌کند. مدل هوش مصنوعی، بک‌تست تاریخی یا سفارش واقعی به صرافی در کار نیست."
                  : "This lab applies illustrative price scenarios to the local demo workspace only. It does not train an AI model, backtest historical market data, or send real exchange orders."}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => triggerMarketShock("PUMP")}
                  className="btn-cyber-active px-4 py-2.5 rounded-xl font-mono text-xs font-bold"
                >
                  {lang === "fa" ? "شبیه‌سازی جهش قیمت" : "Simulate Bullish Move"}
                </button>
                <button
                  onClick={() => triggerMarketShock("CRASH")}
                  className="btn-cyber-danger px-4 py-2.5 rounded-xl font-mono text-xs font-bold"
                >
                  {lang === "fa" ? "شبیه‌سازی ریزش قیمت" : "Simulate Market Drop"}
                </button>
                <button
                  type="button"
                  onClick={toggleAutoBot}
                  className="btn-cyber px-4 py-2.5 rounded-xl font-mono text-xs font-bold"
                  aria-pressed={isAutoBotActive}
                >
                  {lang === "fa"
                    ? isAutoBotActive ? "توقف خرید خودکار آزمایشی" : "فعال‌سازی خرید خودکار آزمایشی"
                    : isAutoBotActive ? "Pause Demo Auto-Buy" : "Start Demo Auto-Buy"}
                </button>
                <button
                  onClick={() => setWorkspace("TERMINAL")}
                  className="btn-cyber px-4 py-2.5 rounded-xl font-mono text-xs font-bold"
                >
                  {lang === "fa" ? "بازگشت به ترمینال" : "Return to Terminal"}
                </button>
              </div>
              {isAutoBotActive && (
                <p className="text-[11px] leading-5 text-amber-200/90">
                  {lang === "fa"
                    ? "خرید خودکار روشن است: شبیه‌ساز هر حدود ۱۴ ثانیه یک سفارش خرید آزمایشی ۴۰۰ دلاری با اهرم ۱ ثبت می‌کند تا وقتی موجودی کافی باشد. برای توقف از همین دکمه استفاده کن."
                    : "Auto-buy is active: the local simulator attempts a $400, 1x paper BUY about every 14 seconds while cash is available. Use this button to stop it."}
                </p>
              )}
            </div>

            <div className="lg:col-span-5 cyber-card rounded-2xl border border-white/15 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    {lang === "fa"
                      ? "گزارش فعالیت شبیه‌ساز محلی"
                      : "Local Simulator Activity"}
                  </h3>
                </div>
              </div>
              <div
                dir="ltr"
                className="space-y-2 font-mono text-xs bg-[#020408] p-3.5 rounded-xl border border-white/10 max-h-[260px] overflow-y-auto"
              >
                {aiLogs.map((log, i) => (
                  <div key={i} className="text-emerald-300/90 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {workspace === "ARCHITECT" && (
          <div
            dir={lang === "fa" ? "rtl" : "ltr"}
            className="cyber-card rounded-2xl border border-emerald-400/40 p-5 sm:p-6 space-y-6 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 border-b border-white/10 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  style={{ width: 88, height: 88, minWidth: 88, maxWidth: 88 }}
                  className="rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg bg-slate-900 shrink-0 flex items-center justify-center"
                >
                  <SmartAssetImage
                    baseName="pooya-fintech"
                    alt="Pooya Goodarzi"
                    style={{
                      width: "88px",
                      height: "88px",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                    fallback={
                      <span className="font-mono font-black text-2xl text-emerald-400">
                        PG
                      </span>
                    }
                  />
                </div>
                <div className="text-center sm:text-start min-w-0">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    LEAD SYSTEM ARCHITECT • PORTFOLIO #2
                  </span>
                  <h2 className="text-lg md:text-2xl font-black text-white mt-2">
                    {lang === "fa"
                      ? "پویا گودرزی — مهندس کامپیوتر و معمار سیستم‌های فین‌تک"
                      : "Pooya Goodarzi — Computer Engineer & FinTech Architect"}
                  </h2>
                </div>
              </div>

              <a
                href="https://pooya-labs.github.io/pooya-os/"
                target="_blank"
                rel="noreferrer"
                className="btn-cyber-active flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shrink-0"
              >
                <span>
                  {lang === "fa"
                    ? "مشاهده پروژه اول (Pooya.OS)"
                    : "Launch Project #1: Pooya.OS"}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </main>

      <footer
        dir={lang === "fa" ? "rtl" : "ltr"}
        className="relative mt-auto border-t border-white/10 bg-[#03080D]/95 px-4 sm:px-6 lg:px-8 py-7 sm:py-9"
      >
        <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-2">
              <img
                src="https://raw.githubusercontent.com/pooya-labs/pooya-labs-platform/main/apps/platform/public/brand/pooya-monogram.webp"
                alt="Pooya Labs"
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {lang === "fa" ? "ساخته‌شده توسط پویا گودرزی" : "Built by Pooya Goodarzi"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {lang === "fa" ? "بخشی از اکوسیستم Pooya Labs" : "Part of the Pooya Labs ecosystem"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/pooya-labs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-white"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.31-3.76-1.31-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.52.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://pooya-labs.github.io/pooya-labs-platform/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-3.5 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-300/15"
            >
              <img src="https://raw.githubusercontent.com/pooya-labs/pooya-labs-platform/main/apps/platform/public/brand/pooya-monogram.webp" alt="" className="h-4 w-4 object-contain" loading="lazy" />
              Pooya Labs Platform
            </a>
          </div>
        </div>
      </footer>

      <CommandPaletteModal />
    </div>
  );
}
