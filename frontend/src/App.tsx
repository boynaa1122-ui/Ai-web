import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarketOverview } from './components/MarketOverview';
import { ChartSection } from './components/ChartSection';
import { SignalCard } from './components/SignalCard';
import { NewsSection } from './components/NewsSection';
import { AiAnalysisCard } from './components/AiAnalysisCard';
import { BottomTables } from './components/BottomTables';
import { Modals } from './components/Modals';
import { Footer } from './components/Footer';
import { api } from './services/api';
import {
  MarketTicker,
  Candle,
  SignalAnalysis,
  NewsItem,
  AiMarketAnalysis,
  FeaturedData,
  PriceAlert,
  PortfolioItem
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT');
  const [timeframe, setTimeframe] = useState<string>('1h');

  // Data States
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [currentTicker, setCurrentTicker] = useState<MarketTicker | undefined>();
  const [candles, setCandles] = useState<Candle[]>([]);
  const [signal, setSignal] = useState<SignalAnalysis | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AiMarketAnalysis | null>(null);
  const [featuredData, setFeaturedData] = useState<FeaturedData | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  // Modals
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadOverviewData = async () => {
      const [m, n, ai, f, al, pf] = await Promise.all([
        api.getMarkets(),
        api.getNews(),
        api.getAiAnalysis(),
        api.getFeaturedData(),
        api.getAlerts(),
        api.getPortfolio()
      ]);
      setTickers(m);
      setNews(n);
      setAiAnalysis(ai);
      setFeaturedData(f);
      setAlerts(al);
      setPortfolio(pf);
    };
    loadOverviewData();

    // Auto refresh tickers every 10 seconds
    const interval = setInterval(async () => {
      const m = await api.getMarkets();
      setTickers(m);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // When symbol or timeframe changes, load chart and signal
  useEffect(() => {
    const loadSymbolData = async () => {
      const [t, ch, sig] = await Promise.all([
        api.getTicker(selectedSymbol),
        api.getChartCandles(selectedSymbol, timeframe),
        api.getSignal(selectedSymbol)
      ]);
      setCurrentTicker(t);
      setCandles(ch.candles);
      setIsDemo(ch.isDemo);
      setSignal(sig);
    };
    loadSymbolData();
  }, [selectedSymbol, timeframe]);

  // Live price tick simulation (makes numbers and chart move in real-time)
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setCurrentTicker((prev) => {
        if (!prev) return prev;
        const deltaPct = (Math.random() - 0.49) * 0.0012;
        const newPrice = Number((prev.price * (1 + deltaPct)).toFixed(prev.price < 10 ? 4 : 2));
        const newChange = Number((prev.change + (newPrice - prev.price)).toFixed(2));
        const newChangePercent = Number((prev.changePercent + deltaPct * 100).toFixed(2));
        return {
          ...prev,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice)
        };
      });

      setCandles((prevCandles) => {
        if (!prevCandles || prevCandles.length === 0) return prevCandles;
        const last = { ...prevCandles[prevCandles.length - 1] };
        const delta = (Math.random() - 0.49) * last.close * 0.0006;
        last.close = Number((last.close + delta).toFixed(2));
        last.high = Number((Math.max(last.high, last.close)).toFixed(2));
        last.low = Number((Math.min(last.low, last.close)).toFixed(2));
        return [...prevCandles.slice(0, prevCandles.length - 1), last];
      });
    }, 1500);

    return () => clearInterval(tickInterval);
  }, [selectedSymbol]);

  // Handle activeTab triggers
  useEffect(() => {
    if (activeTab === 'alerts') {
      setAlertsModalOpen(true);
    } else if (activeTab === 'portfolio') {
      setPortfolioModalOpen(true);
    } else if (activeTab === 'settings') {
      setSettingsModalOpen(true);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onSearch={(query) => setSelectedSymbol(query.toUpperCase())}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          overviewTickers={tickers}
          onOpenAiReport={() => setAiModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2.5 sm:space-y-4 pb-20 md:pb-6">
          {/* 1. Top Market Ticker Strip (5 items) */}
          <MarketOverview
            tickers={tickers}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />

          {/* 2. Middle Grid: Left Chart (65%), Right Signal & News (35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chart Area */}
            <div className="lg:col-span-8 flex flex-col">
              <ChartSection
                symbol={selectedSymbol}
                ticker={currentTicker}
                candles={candles}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                isDemo={isDemo}
              />
            </div>

            {/* Signal Card */}
            <div className="lg:col-span-4 flex flex-col">
              {signal && (
                <SignalCard
                  signal={signal}
                  onEditSymbol={() => {
                    const next = selectedSymbol.includes('BTC') ? 'ETH/USDT' : 'BTC/USDT';
                    setSelectedSymbol(next);
                  }}
                />
              )}
            </div>
          </div>

          {/* 3. News & AI Analysis Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7">
              <NewsSection
                news={news}
                onViewAll={() => setActiveTab('news')}
                onSelectNews={(item) => setSelectedSymbol(item.category.includes('BTC') ? 'BTC/USDT' : 'NVDA')}
              />
            </div>
            <div className="lg:col-span-5">
              {aiAnalysis && (
                <AiAnalysisCard
                  analysis={aiAnalysis}
                  onOpenFullReport={() => setAiModalOpen(true)}
                />
              )}
            </div>
          </div>

          {/* 4. Bottom 3-Column Tables */}
          {featuredData && (
            <BottomTables
              data={featuredData}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer isDemo={isDemo} />

      {/* Modals & Popovers */}
      {aiAnalysis && (
        <Modals
          aiModalOpen={aiModalOpen}
          setAiModalOpen={setAiModalOpen}
          aiAnalysis={aiAnalysis}
          settingsModalOpen={settingsModalOpen}
          setSettingsModalOpen={setSettingsModalOpen}
          alertsModalOpen={alertsModalOpen}
          setAlertsModalOpen={setAlertsModalOpen}
          alerts={alerts}
          onAddAlert={async (newAlert) => {
            const added = await api.addAlert(newAlert);
            setAlerts([...alerts, added]);
          }}
          onDeleteAlert={async (id) => {
            await api.deleteAlert(id);
            setAlerts(alerts.filter((a) => a.id !== id));
          }}
          portfolioModalOpen={portfolioModalOpen}
          setPortfolioModalOpen={setPortfolioModalOpen}
          portfolio={portfolio}
          onAddPortfolio={async (item) => {
            const added = await api.addPortfolioItem(item);
            const updated = await api.getPortfolio();
            setPortfolio(updated);
          }}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
        />
      )}
    </div>
  );
}

export default App;
