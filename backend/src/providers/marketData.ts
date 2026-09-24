import { Candle } from '../analysis/technical.js';

export interface MarketTicker {
  symbol: string;
  name: string;
  category: 'crypto' | 'stock' | 'index';
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  sparkline: number[];
  isDemo: boolean;
}

const BINANCE_BASE = 'https://api.binance.com/api/v3';
const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

const BINANCE_SYMBOL_MAP: Record<string, string> = {
  'BTC/USDT': 'BTCUSDT', 'ETH/USDT': 'ETHUSDT', 'SOL/USDT': 'SOLUSDT',
  'XRP/USDT': 'XRPUSDT', 'DOGE/USDT': 'DOGEUSDT', 'BNB/USDT': 'BNBUSDT',
  'ADA/USDT': 'ADAUSDT', 'AVAX/USDT': 'AVAXUSDT', 'DOT/USDT': 'DOTUSDT'
};

const YAHOO_SYMBOL_MAP: Record<string, { symbol: string; name: string; category: MarketTicker['category'] }> = {
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock' },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'stock' },
  'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stock' },
  'MSFT': { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'stock' },
  'PTT': { symbol: 'PTT.BK', name: 'PTT PCL', category: 'stock' },
  'BBL': { symbol: 'BBL.BK', name: 'Bangkok Bank', category: 'stock' },
  'SET': { symbol: '^SET.BK', name: 'SET Index (ไทย)', category: 'index' },
  'S&P 500': { symbol: '^GSPC', name: 'S&P 500', category: 'index' },
  'NASDAQ': { symbol: '^IXIC', name: 'NASDAQ 100', category: 'index' }
};

const STATIC_NAMES: Record<string, { name: string; category: MarketTicker['category'] }> = {
  'BTC/USDT': { name: 'Bitcoin', category: 'crypto' },
  'ETH/USDT': { name: 'Ethereum', category: 'crypto' },
  'SOL/USDT': { name: 'Solana', category: 'crypto' },
  'XRP/USDT': { name: 'XRP', category: 'crypto' },
  'DOGE/USDT': { name: 'Dogecoin', category: 'crypto' },
  'BNB/USDT': { name: 'BNB', category: 'crypto' },
  'ADA/USDT': { name: 'Cardano', category: 'crypto' },
  'AVAX/USDT': { name: 'Avalanche', category: 'crypto' },
  'DOT/USDT': { name: 'Polkadot', category: 'crypto' },
  ...Object.fromEntries(Object.entries(YAHOO_SYMBOL_MAP).map(([k, v]) => [k, { name: v.name, category: v.category }]))
};

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  return vol.toFixed(0);
}

export class MarketDataProvider {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  async getTicker(symbol: string): Promise<MarketTicker> {
    const sym = symbol.toUpperCase();

    if (BINANCE_SYMBOL_MAP[sym]) {
      try {
        const data = await this.fetchBinanceTicker(sym);
        if (data) return data;
      } catch {}
    }

    if (YAHOO_SYMBOL_MAP[sym]) {
      try {
        const data = await this.fetchYahooTicker(sym);
        if (data) return data;
      } catch {}
    }

    const info = STATIC_NAMES[sym] || { name: sym, category: 'crypto' as const };
    return this.buildDemoTicker(sym, info.name, info.category);
  }

  async getAllOverviewTickers(): Promise<MarketTicker[]> {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'S&P 500', 'NASDAQ', 'AAPL', 'NVDA', 'PTT'];
    const results = await Promise.allSettled(symbols.map((s) => this.getTicker(s)));
    return results.map((r, idx) => {
      if (r.status === 'fulfilled') return r.value;
      const info = STATIC_NAMES[symbols[idx]] || { name: symbols[idx], category: 'index' as const };
      return this.buildDemoTicker(symbols[idx], info.name, info.category);
    });
  }

  async getCandles(symbol: string, timeframe: string = '1h', limit: number = 80): Promise<{ candles: Candle[]; isDemo: boolean }> {
    const sym = symbol.toUpperCase();
    const binanceSym = BINANCE_SYMBOL_MAP[sym];

    if (binanceSym) {
      const cacheKey = `klines_${binanceSym}_${timeframe}_${limit}`;
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return { candles: cached.data, isDemo: false };
      }

      try {
        const intervalMap: Record<string, string> = {
          '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1D': '1d', '1W': '1w'
        };
        const interval = intervalMap[timeframe] || '1h';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `${BINANCE_BASE}/klines?symbol=${binanceSym}&interval=${interval}&limit=${limit}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (res.ok) {
          const raw: any[][] = await res.json();
          const candles: Candle[] = raw.map((k) => ({
            time: Math.floor(k[0] / 1000),
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5])
          }));
          this.cache.set(cacheKey, { data: candles, expiry: Date.now() + 10000 });
          return { candles, isDemo: false };
        }
      } catch {}
    }

    const yahooInfo = YAHOO_SYMBOL_MAP[sym];
    if (yahooInfo) {
      const cacheKey = `yahoo_chart_${yahooInfo.symbol}_${limit}`;
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return { candles: cached.data, isDemo: false };
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `${YAHOO_BASE}/${encodeURIComponent(yahooInfo.symbol)}?interval=1d&range=3mo`,
          { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal }
        );
        clearTimeout(timeout);

        if (res.ok) {
          const json: any = await res.json();
          const result = json.chart?.result?.[0];
          if (result && result.timestamp && result.indicators?.quote?.[0]) {
            const timestamps: number[] = result.timestamp;
            const q = result.indicators.quote[0];
            const candles: Candle[] = [];
            for (let i = 0; i < timestamps.length; i++) {
              if (q.open[i] != null && q.high[i] != null && q.low[i] != null && q.close[i] != null) {
                candles.push({
                  time: timestamps[i],
                  open: Number(q.open[i].toFixed(2)),
                  high: Number(q.high[i].toFixed(2)),
                  low: Number(q.low[i].toFixed(2)),
                  close: Number(q.close[i].toFixed(2)),
                  volume: q.volume?.[i] || 10000
                });
              }
            }
            const sliced = candles.slice(-limit);
            this.cache.set(cacheKey, { data: sliced, expiry: Date.now() + 30000 });
            return { candles: sliced, isDemo: false };
          }
        }
      } catch {}
    }

    const basePrice = 100;
    return { candles: this.buildDemoCandles(basePrice, limit), isDemo: true };
  }

  private async fetchBinanceTicker(symbol: string): Promise<MarketTicker | null> {
    const binanceSym = BINANCE_SYMBOL_MAP[symbol];
    if (!binanceSym) return null;

    const cacheKey = `bticker_${binanceSym}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) return cached.data;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${BINANCE_BASE}/ticker/24hr?symbol=${binanceSym}`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) return null;
      const d: any = await res.json();

      const price = parseFloat(d.lastPrice);
      const decimals = price < 1 ? 4 : price < 100 ? 3 : 2;
      const info = STATIC_NAMES[symbol] || { name: symbol, category: 'crypto' as const };

      const ticker: MarketTicker = {
        symbol,
        name: info.name,
        category: 'crypto',
        price: Number(price.toFixed(decimals)),
        change: Number(parseFloat(d.priceChange).toFixed(2)),
        changePercent: Number(parseFloat(d.priceChangePercent).toFixed(2)),
        high24h: Number(parseFloat(d.highPrice).toFixed(decimals)),
        low24h: Number(parseFloat(d.lowPrice).toFixed(decimals)),
        volume24h: `${formatVolume(parseFloat(d.quoteVolume))} USDT`,
        sparkline: this.buildSparkline(price, parseFloat(d.priceChangePercent) >= 0),
        isDemo: false
      };

      this.cache.set(cacheKey, { data: ticker, expiry: Date.now() + 5000 });
      return ticker;
    } catch {
      return null;
    }
  }

  private async fetchYahooTicker(symbol: string): Promise<MarketTicker | null> {
    const yInfo = YAHOO_SYMBOL_MAP[symbol];
    if (!yInfo) return null;

    const cacheKey = `yticker_${yInfo.symbol}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) return cached.data;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        `${YAHOO_BASE}/${encodeURIComponent(yInfo.symbol)}?interval=1d&range=2d`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.ok) return null;
      const json: any = await res.json();
      const meta = json.chart?.result?.[0]?.meta;
      if (!meta) return null;

      const price = meta.regularMarketPrice || meta.chartPreviousClose || 100;
      const prevClose = meta.chartPreviousClose || price;
      const change = price - prevClose;
      const changePercent = prevClose ? (change / prevClose) * 100 : 0;
      const decimals = price < 10 ? 3 : 2;

      const ticker: MarketTicker = {
        symbol,
        name: yInfo.name,
        category: yInfo.category,
        price: Number(price.toFixed(decimals)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        high24h: Number((meta.regularMarketDayHigh || price * 1.01).toFixed(decimals)),
        low24h: Number((meta.regularMarketDayLow || price * 0.99).toFixed(decimals)),
        volume24h: formatVolume(meta.regularMarketVolume || 1000000),
        sparkline: this.buildSparkline(price, changePercent >= 0),
        isDemo: false
      };

      this.cache.set(cacheKey, { data: ticker, expiry: Date.now() + 15000 });
      return ticker;
    } catch {
      return null;
    }
  }

  private buildDemoTicker(symbol: string, name: string, category: MarketTicker['category']): MarketTicker {
    const basePrice = 100;
    const variation = (Math.sin(Date.now() / 60000 + symbol.charCodeAt(0)) * 0.01) + (Math.random() * 0.002 - 0.001);
    const price = Number((basePrice * (1 + variation)).toFixed(2));
    const changePercent = Number((variation * 100).toFixed(2));

    return {
      symbol, name, category,
      price,
      change: Number((price * variation).toFixed(2)),
      changePercent,
      high24h: Number((price * 1.02).toFixed(2)),
      low24h: Number((price * 0.98).toFixed(2)),
      volume24h: '1.2B',
      sparkline: this.buildSparkline(price, changePercent >= 0),
      isDemo: true
    };
  }

  private buildDemoCandles(basePrice: number, limit: number): Candle[] {
    const now = Math.floor(Date.now() / 1000);
    const candles: Candle[] = [];
    let p = basePrice * 0.95;

    for (let i = limit; i >= 0; i--) {
      const open = p;
      const change = (Math.random() - 0.48) * basePrice * 0.006;
      const close = Number((open + change).toFixed(2));
      candles.push({
        time: now - i * 3600,
        open,
        high: Number((Math.max(open, close) + Math.random() * basePrice * 0.003).toFixed(2)),
        low: Number((Math.min(open, close) - Math.random() * basePrice * 0.003).toFixed(2)),
        close,
        volume: Math.floor(1000 + Math.random() * 5000)
      });
      p = close;
    }
    return candles;
  }

  private buildSparkline(basePrice: number, isPositive: boolean): number[] {
    const result: number[] = [];
    let val = isPositive ? basePrice * 0.98 : basePrice * 1.02;
    for (let i = 0; i < 12; i++) {
      val += (Math.random() - (isPositive ? 0.42 : 0.58)) * (basePrice * 0.004);
      result.push(Number(val.toFixed(2)));
    }
    result.push(basePrice);
    return result;
  }
}
