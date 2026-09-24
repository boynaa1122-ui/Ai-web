import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MarketDataProvider } from './providers/marketData.js';
import { NewsProvider } from './providers/newsProvider.js';
import { AiAnalysisService } from './services/aiService.js';
import { analyzeMarketSignals } from './analysis/technical.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const marketData = new MarketDataProvider();
const newsProvider = new NewsProvider();
const aiService = new AiAnalysisService();

// In-Memory store for Watchlist, Alerts, and Portfolio
let watchlist: { symbol: string; name: string; price: number; change: string; addedAt: string }[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 104832.45, change: '+2.36%', addedAt: new Date().toISOString() },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 454.32, change: '+2.48%', addedAt: new Date().toISOString() },
  { symbol: 'SOL/USDT', name: 'Solana', price: 178.32, change: '+8.21%', addedAt: new Date().toISOString() }
];

let alerts: { id: string; symbol: string; targetPrice: number; condition: 'ABOVE' | 'BELOW'; enabled: boolean }[] = [
  { id: 'alt-1', symbol: 'BTC/USDT', targetPrice: 105000, condition: 'ABOVE', enabled: true },
  { id: 'alt-2', symbol: 'ETH/USDT', targetPrice: 3200, condition: 'BELOW', enabled: true }
];

let portfolio: { id: string; asset: string; quantity: number; avgPrice: number; currentPrice: number }[] = [
  { id: 'pf-1', asset: 'BTC', quantity: 0.25, avgPrice: 98000, currentPrice: 104832.45 },
  { id: 'pf-2', asset: 'NVDA', quantity: 15, avgPrice: 420.50, currentPrice: 454.32 },
  { id: 'pf-3', asset: 'ETH', quantity: 2.5, avgPrice: 3100, currentPrice: 3256.17 }
];

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'NEXUS MARKET AI Backend',
    timestamp: new Date().toISOString(),
    postgres: 'connected (in-memory fallback active)',
    redis: 'ready',
    marketProvider: 'online'
  });
});

// Markets Overview
app.get('/api/markets', async (req: Request, res: Response) => {
  try {
    const tickers = await marketData.getAllOverviewTickers();
    res.json(tickers);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch markets', details: err.message });
  }
});

// Single Market Ticker
app.get('/api/market/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = decodeURIComponent(req.params.symbol);
    const ticker = await marketData.getTicker(symbol);
    res.json(ticker);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch market ticker', details: err.message });
  }
});

app.get('/api/crypto/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = decodeURIComponent(req.params.symbol);
    const ticker = await marketData.getTicker(symbol.includes('/') ? symbol : `${symbol}/USDT`);
    res.json(ticker);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch crypto ticker', details: err.message });
  }
});

// Candlestick Chart Data
app.get('/api/chart/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = decodeURIComponent(req.params.symbol);
    const timeframe = (req.query.timeframe as string) || '1h';
    const limit = parseInt(req.query.limit as string) || 80;
    const { candles, isDemo } = await marketData.getCandles(symbol, timeframe, limit);
    res.json({ symbol, timeframe, candles, isDemo });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch chart candles', details: err.message });
  }
});

// Signals
app.get('/api/signals', async (req: Request, res: Response) => {
  try {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAPL', 'NVDA', 'TSLA'];
    const results = await Promise.all(
      symbols.map(async (sym) => {
        const { candles } = await marketData.getCandles(sym, '1h', 50);
        return analyzeMarketSignals(sym, candles);
      })
    );
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate signals', details: err.message });
  }
});

app.get('/api/signals/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = decodeURIComponent(req.params.symbol);
    const { candles } = await marketData.getCandles(symbol, '1h', 60);
    const signal = analyzeMarketSignals(symbol, candles);
    res.json(signal);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to calculate signal', details: err.message });
  }
});

// News
app.get('/api/news', (req: Request, res: Response) => {
  const category = req.query.category as string;
  const sentiment = req.query.sentiment as string;
  const items = newsProvider.getNews(category, sentiment);
  res.json(items);
});

// AI Analysis
app.get('/api/ai/analysis', async (req: Request, res: Response) => {
  try {
    const symbol = req.query.symbol as string;
    const analysis = await aiService.getMarketAnalysis(symbol);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate AI analysis', details: err.message });
  }
});

// Featured Tables Data (หุ้นเด่น, เหรียญคริปโต, แนวโน้ม)
app.get('/api/featured', async (req: Request, res: Response) => {
  try {
    const [btc, eth, sol, xrp, doge, bnb, avax, dot, aapl, nvda, tsla, msft, ptt, bbl] = await Promise.all([
      marketData.getTicker('BTC/USDT'),
      marketData.getTicker('ETH/USDT'),
      marketData.getTicker('SOL/USDT'),
      marketData.getTicker('XRP/USDT'),
      marketData.getTicker('DOGE/USDT'),
      marketData.getTicker('BNB/USDT'),
      marketData.getTicker('AVAX/USDT'),
      marketData.getTicker('DOT/USDT'),
      marketData.getTicker('AAPL'),
      marketData.getTicker('NVDA'),
      marketData.getTicker('TSLA'),
      marketData.getTicker('MSFT'),
      marketData.getTicker('PTT'),
      marketData.getTicker('BBL')
    ]);

    const fmt = (t: any) => ({
      name: t.symbol.includes('/') ? t.symbol.split('/')[0] : t.symbol,
      fullName: t.name,
      price: t.price,
      change: `${t.changePercent >= 0 ? '+' : ''}${t.changePercent}%`,
      signal: t.changePercent >= 0 ? 'BUY' : 'WATCH',
      target: Number((t.price * 1.05).toFixed(2))
    });

    res.json({
      topStocks: {
        thai: [
          fmt(ptt),
          fmt(bbl),
          { name: 'CPALL', fullName: 'CP All PCL', price: 64.25, change: '+0.78%', signal: 'BUY', target: 68.00 },
          { name: 'ADVANC', fullName: 'Advanced Info Service', price: 284.00, change: '+1.12%', signal: 'BUY', target: 295.00 }
        ],
        us: [
          fmt(aapl),
          fmt(nvda),
          fmt(tsla),
          fmt(msft)
        ],
        crypto: [
          fmt(btc),
          fmt(eth),
          fmt(sol)
        ]
      },
      topCrypto: {
        gainers: [fmt(sol), fmt(xrp), fmt(doge), fmt(bnb)].sort((a, b) => parseFloat(b.change) - parseFloat(a.change)),
        losers: [fmt(avax), fmt(dot)].sort((a, b) => parseFloat(a.change) - parseFloat(b.change)),
        volume: [fmt(btc), fmt(eth), fmt(sol)]
      },
      trends: {
        stocks: [
          { name: 'AAPL', shortTerm: aapl.changePercent >= 0 ? 'ขึ้น' : 'ลง', longTerm: 'ขึ้น' },
          { name: 'NVDA', shortTerm: nvda.changePercent >= 0 ? 'ขึ้น' : 'ลง', longTerm: 'ขึ้น' },
          { name: 'TSLA', shortTerm: tsla.changePercent >= 0 ? 'แกว่ง' : 'ขึ้น', longTerm: 'ขึ้น' }
        ],
        crypto: [
          { name: 'BTC', shortTerm: btc.changePercent >= 0 ? 'ขึ้น' : 'ลง', longTerm: 'ขึ้น' },
          { name: 'ETH', shortTerm: eth.changePercent >= 0 ? 'ขึ้น' : 'ลง', longTerm: 'ขึ้น' }
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch featured data', details: err.message });
  }
});

// Watchlist CRUD
app.get('/api/watchlist', (req: Request, res: Response) => {
  res.json(watchlist);
});

app.post('/api/watchlist', (req: Request, res: Response) => {
  const { symbol, name, price, change } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });
  const exists = watchlist.find((w) => w.symbol === symbol);
  if (!exists) {
    watchlist.push({
      symbol,
      name: name || symbol,
      price: price || 0,
      change: change || '0.00%',
      addedAt: new Date().toISOString()
    });
  }
  res.json(watchlist);
});

app.delete('/api/watchlist/:symbol', (req: Request, res: Response) => {
  const symbol = decodeURIComponent(req.params.symbol);
  watchlist = watchlist.filter((w) => w.symbol !== symbol);
  res.json(watchlist);
});

// Alerts CRUD
app.get('/api/alerts', (req: Request, res: Response) => {
  res.json(alerts);
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const { symbol, targetPrice, condition } = req.body;
  if (!symbol || !targetPrice) {
    return res.status(400).json({ error: 'Symbol and targetPrice are required' });
  }
  const newAlert = {
    id: `alt-${Date.now()}`,
    symbol,
    targetPrice: Number(targetPrice),
    condition: condition || 'ABOVE',
    enabled: true
  };
  alerts.push(newAlert);
  res.json(newAlert);
});

app.delete('/api/alerts/:id', (req: Request, res: Response) => {
  alerts = alerts.filter((a) => a.id !== req.params.id);
  res.json({ success: true });
});

// Portfolio CRUD
app.get('/api/portfolio', (req: Request, res: Response) => {
  const detailed = portfolio.map((item) => {
    const totalCost = item.quantity * item.avgPrice;
    const currentValue = item.quantity * item.currentPrice;
    const pl = currentValue - totalCost;
    const plPercent = totalCost > 0 ? (pl / totalCost) * 100 : 0;
    return {
      ...item,
      totalCost: Number(totalCost.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      pl: Number(pl.toFixed(2)),
      plPercent: Number(plPercent.toFixed(2))
    };
  });
  res.json(detailed);
});

app.post('/api/portfolio', (req: Request, res: Response) => {
  const { asset, quantity, avgPrice, currentPrice } = req.body;
  if (!asset || !quantity || !avgPrice) {
    return res.status(400).json({ error: 'Asset, quantity, and avgPrice are required' });
  }
  const newItem = {
    id: `pf-${Date.now()}`,
    asset,
    quantity: Number(quantity),
    avgPrice: Number(avgPrice),
    currentPrice: Number(currentPrice || avgPrice)
  };
  portfolio.push(newItem);
  res.json(newItem);
});

app.listen(port, () => {
  console.log(`🚀 NEXUS MARKET AI Backend running on port ${port}`);
});
