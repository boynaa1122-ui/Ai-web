import {
  MarketTicker,
  Candle,
  SignalAnalysis,
  NewsItem,
  AiMarketAnalysis,
  FeaturedData,
  PriceAlert,
  PortfolioItem
} from '../types';

const API_BASE = '/api';

export const api = {
  async getMarkets(): Promise<MarketTicker[]> {
    try {
      const res = await fetch(`${API_BASE}/markets`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, using fallback markets', e);
    }
    return [
      {
        symbol: 'SET',
        name: 'SET Index (ไทย)',
        category: 'index',
        price: 1598.24,
        change: 20.85,
        changePercent: 1.32,
        high24h: 1602.10,
        low24h: 1585.40,
        volume24h: '54.2B THB',
        sparkline: [1580, 1584, 1588, 1592, 1590, 1598.24],
        isDemo: true
      },
      {
        symbol: 'S&P 500',
        name: 'S&P 500',
        category: 'index',
        price: 5628.80,
        change: 48.50,
        changePercent: 0.87,
        high24h: 5640.20,
        low24h: 5605.10,
        volume24h: '4.2B USD',
        sparkline: [5580, 5600, 5612, 5618, 5628.8],
        isDemo: true
      },
      {
        symbol: 'NASDAQ',
        name: 'NASDAQ 100',
        category: 'index',
        price: 17725.77,
        change: 211.45,
        changePercent: 1.21,
        high24h: 17780.00,
        low24h: 17610.00,
        volume24h: '6.8B USD',
        sparkline: [17550, 17600, 17650, 17700, 17725.77],
        isDemo: true
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        category: 'crypto',
        price: 104832.45,
        change: 2361.76,
        changePercent: 2.36,
        high24h: 106210.00,
        low24h: 101987.32,
        volume24h: '38.7B USDT',
        sparkline: [102000, 103100, 102900, 104200, 104832.45],
        isDemo: true
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        category: 'crypto',
        price: 3256.17,
        change: 56.88,
        changePercent: 1.78,
        high24h: 3290.00,
        low24h: 3180.00,
        volume24h: '18.4B USDT',
        sparkline: [3150, 3180, 3210, 3220, 3256.17],
        isDemo: true
      }
    ];
  },

  async getTicker(symbol: string): Promise<MarketTicker> {
    try {
      const res = await fetch(`${API_BASE}/market/${encodeURIComponent(symbol)}`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      symbol,
      name: symbol,
      category: 'crypto',
      price: 104832.45,
      change: 2361.76,
      changePercent: 2.36,
      high24h: 106210.00,
      low24h: 101987.32,
      volume24h: '38.7B USDT',
      sparkline: [102000, 103500, 104832.45],
      isDemo: true
    };
  },

  async getChartCandles(symbol: string, timeframe: string): Promise<{ candles: Candle[]; isDemo: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/chart/${encodeURIComponent(symbol)}?timeframe=${timeframe}&limit=75`);
      if (res.ok) return await res.json();
    } catch {}

    // Fallback candles
    const now = Math.floor(Date.now() / 1000);
    const candles: Candle[] = [];
    let p = 100000;
    for (let i = 50; i >= 0; i--) {
      const open = p;
      const close = open + (Math.random() - 0.47) * 400;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      candles.push({
        time: now - i * 3600,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(2000 + Math.random() * 3000)
      });
      p = close;
    }
    return { candles, isDemo: true };
  },

  async getSignal(symbol: string): Promise<SignalAnalysis> {
    try {
      const res = await fetch(`${API_BASE}/signals/${encodeURIComponent(symbol)}`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      symbol,
      type: 'BUY SIGNAL',
      score: 76,
      reasons: [
        'ราคาอยู่เหนือ EMA20',
        'EMA20 > EMA50',
        'RSI = 62 (อยู่ในโซนบวก)',
        'MACD เริ่มเป็นขาขึ้น',
        'Volume เพิ่มขึ้น +32%'
      ],
      support: [102500, 100200],
      resistance: [106800, 109500],
      recommendation: 'เหมาะสำหรับการเข้า Long ระยะสั้น หากราคาอ่อนตัวไม่หลุด 102,500',
      shortTerm: 'BULLISH',
      longTerm: 'BULLISH',
      disclaimer: 'สัญญาณนี้สร้างจากข้อมูลตลาดและตัวชี้วัดทางเทคนิค ใช้เพื่อประกอบการศึกษา ไม่ใช่คำแนะนำการลงทุน'
    };
  },

  async getNews(): Promise<NewsItem[]> {
    try {
      const res = await fetch(`${API_BASE}/news`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      {
        id: '1',
        category: 'BTC',
        type: 'crypto',
        time: '14:20',
        title: 'Bitcoin พุ่งทะลุ 104,000 ดอลลาร์ หลังมีแรงซื้อจากสถาบันใหญ่',
        source: 'CoinDesk',
        sentiment: 'POSITIVE',
        aiSummary: 'แรงซื้อสถาบันผลักดันราคาข้ามแนวต้านสำคัญ',
        url: '#',
        isDemo: true
      },
      {
        id: '2',
        category: 'หุ้น',
        type: 'stock',
        time: '13:45',
        title: 'NVIDIA รายงานผลประกอบการดีกว่าคาด หนุนหุ้นเทคโนโลยีทั่วโลก',
        source: 'Reuters',
        sentiment: 'POSITIVE',
        aiSummary: 'ยอดขายชิป AI ยังเติบโตแข็งแกร่งอย่างต่อเนื่อง',
        url: '#',
        isDemo: true
      },
      {
        id: '3',
        category: 'คริปโต',
        type: 'crypto',
        time: '12:30',
        title: 'Ethereum แตะ 3,250 ดอลลาร์ นักวิเคราะห์ชี้แนวโน้มยังเป็นขาขึ้น',
        source: 'Cointelegraph',
        sentiment: 'POSITIVE',
        aiSummary: 'การใช้งาน L2 เติบโตต่อเนื่องหนุนปัจจัยพื้นฐาน',
        url: '#',
        isDemo: true
      },
      {
        id: '4',
        category: 'ตลาดไทย',
        type: 'stock',
        time: '11:15',
        title: 'SET ปิดบวก 16.32 จุด รับข่าวเศรษฐกิจไทยและแรงซื้อจากต่างชาติ',
        source: 'กรุงเทพธุรกิจ',
        sentiment: 'POSITIVE',
        aiSummary: 'เงินทุนต่างชาติไหลเข้าหนุนกลุ่มแบงก์และพลังงาน',
        url: '#',
        isDemo: true
      },
      {
        id: '5',
        category: 'คริปโต',
        type: 'crypto',
        time: '10:05',
        title: 'Solana (SOL) พุ่ง 8% หลังประกาศพัฒนาระบบใหม่เร็วขึ้น',
        source: 'The Block',
        sentiment: 'POSITIVE',
        aiSummary: 'อัปเกรดระบบเพื่อรองรับธุรกรรมจำนวนมหาศาล',
        url: '#',
        isDemo: true
      }
    ];
  },

  async getAiAnalysis(): Promise<AiMarketAnalysis> {
    try {
      const res = await fetch(`${API_BASE}/ai/analysis`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      summaryTitle: 'AI วิเคราะห์ตลาด (สรุปวันนี้)',
      timestamp: '14:32',
      insights: [
        'ตลาดโดยรวมยังอยู่ในแนวโน้มขาขึ้น',
        'หุ้นเทคโนโลยีและคริปโตยังมีแรงซื้อ',
        'แนะนำทยอยสะสมหุ้นพื้นฐานดี',
        'ระวังความผันผวนช่วงใกล้ประกาศตัวเลขเศรษฐกิจ'
      ],
      bullishSymbols: [
        { symbol: 'AAPL', change: '+1.26%' },
        { symbol: 'NVDA', change: '+2.48%' },
        { symbol: 'BTC', change: '+2.36%' },
        { symbol: 'SOL', change: '+8.21%' }
      ],
      bearishSymbols: [
        { symbol: 'TSLA', change: '-1.15%' },
        { symbol: 'KWEB', change: '-0.85%' },
        { symbol: 'DOGE', change: '-2.10%' },
        { symbol: 'ETH', change: '-0.42%' }
      ],
      bullishFactors: ['ดัชนีหลักยืนเหนือเส้นค่าเฉลี่ย 50 วัน', 'Net Inflow กองทุน ETF แข็งแกร่ง'],
      bearishFactors: ['RSI สินทรัพย์บางตัวเริ่มเข้าใกล้โซน Overbought'],
      riskFactors: ['นโยบายดอกเบี้ยของธนาคารกลางสหรัฐฯ'],
      technicalOverview: 'แนวโน้มหลักยังเป็นขาขึ้น แนะนำบริหารความเสี่ยงด้วย Stop Loss',
      disclaimer: 'ข้อมูลและการวิเคราะห์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน'
    };
  },

  async getFeaturedData(): Promise<FeaturedData> {
    try {
      const res = await fetch(`${API_BASE}/featured`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      topStocks: {
        thai: [
          { name: 'PTT', price: 32.50, change: '+1.40%', signal: 'BUY', target: 35.00 },
          { name: 'BBL', price: 156.00, change: '-0.64%', signal: 'WATCH', target: 160.00 },
          { name: 'CPALL', price: 64.25, change: '+0.78%', signal: 'BUY', target: 68.00 }
        ],
        us: [
          { name: 'AAPL', price: 229.17, change: '+1.26%', signal: 'BUY', target: 235.00 },
          { name: 'NVDA', price: 454.32, change: '+2.48%', signal: 'BUY', target: 480.00 },
          { name: 'TSLA', price: 248.50, change: '-1.15%', signal: 'WATCH', target: 260.00 }
        ],
        crypto: [
          { name: 'BTC', price: 104832.45, change: '+2.36%', signal: 'BUY', target: 110000.00 },
          { name: 'ETH', price: 3256.17, change: '+1.78%', signal: 'BUY', target: 3500.00 },
          { name: 'SOL', price: 178.32, change: '+8.21%', signal: 'BUY', target: 195.00 }
        ]
      },
      topCrypto: {
        gainers: [
          { name: 'SOL', price: 178.32, change: '+8.21%', signal: 'BUY' },
          { name: 'XRP', price: 0.5823, change: '+5.76%', signal: 'BUY' },
          { name: 'DOGE', price: 0.1627, change: '+4.32%', signal: 'WATCH' },
          { name: 'ADA', price: 0.3784, change: '+3.91%', signal: 'BUY' },
          { name: 'BNB', price: 587.21, change: '+2.14%', signal: 'BUY' }
        ],
        losers: [
          { name: 'AVAX', price: 24.12, change: '-3.45%', signal: 'SELL' },
          { name: 'DOT', price: 4.15, change: '-2.80%', signal: 'WATCH' }
        ],
        volume: [
          { name: 'BTC', price: 104832.45, change: '+2.36%', signal: 'BUY' },
          { name: 'ETH', price: 3256.17, change: '+1.78%', signal: 'BUY' },
          { name: 'SOL', price: 178.32, change: '+8.21%', signal: 'BUY' }
        ]
      },
      trends: {
        stocks: [
          { name: 'AAPL', shortTerm: 'ขึ้น', longTerm: 'ขึ้น' },
          { name: 'NVDA', shortTerm: 'ขึ้น', longTerm: 'ขึ้น' },
          { name: 'TSLA', shortTerm: 'แกว่ง', longTerm: 'ขึ้น' }
        ],
        crypto: [
          { name: 'BTC', shortTerm: 'ขึ้น', longTerm: 'ขึ้น' },
          { name: 'ETH', shortTerm: 'ขึ้น', longTerm: 'ขึ้น' }
        ]
      }
    };
  },

  async getAlerts(): Promise<PriceAlert[]> {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: '1', symbol: 'BTC/USDT', targetPrice: 105000, condition: 'ABOVE', enabled: true },
      { id: '2', symbol: 'ETH/USDT', targetPrice: 3200, condition: 'BELOW', enabled: true }
    ];
  },

  async addAlert(alert: Omit<PriceAlert, 'id'>): Promise<PriceAlert> {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
    return await res.json();
  },

  async deleteAlert(id: string): Promise<void> {
    await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
  },

  async getPortfolio(): Promise<PortfolioItem[]> {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (res.ok) return await res.json();
    } catch {}
    return [
      { id: '1', asset: 'BTC', quantity: 0.25, avgPrice: 98000, currentPrice: 104832.45, totalCost: 24500, currentValue: 26208.11, pl: 1708.11, plPercent: 6.97 },
      { id: '2', asset: 'NVDA', quantity: 15, avgPrice: 420.50, currentPrice: 454.32, totalCost: 6307.50, currentValue: 6814.80, pl: 507.30, plPercent: 8.04 }
    ];
  },

  async addPortfolioItem(item: { asset: string; quantity: number; avgPrice: number }): Promise<PortfolioItem> {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return await res.json();
  }
};
