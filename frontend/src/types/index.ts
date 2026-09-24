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

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SignalAnalysis {
  symbol: string;
  type: 'BUY SIGNAL' | 'SELL SIGNAL' | 'WATCH' | 'NEUTRAL';
  score: number;
  reasons: string[];
  support: number[];
  resistance: number[];
  recommendation: string;
  shortTerm: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  longTerm: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  disclaimer: string;
}

export interface NewsItem {
  id: string;
  category: string;
  type: string;
  time: string;
  title: string;
  source: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  aiSummary: string;
  url: string;
  isDemo: boolean;
}

export interface AiMarketAnalysis {
  summaryTitle: string;
  timestamp: string;
  insights: string[];
  bullishSymbols: { symbol: string; change: string }[];
  bearishSymbols: { symbol: string; change: string }[];
  bullishFactors: string[];
  bearishFactors: string[];
  riskFactors: string[];
  technicalOverview: string;
  disclaimer: string;
}

export interface FeaturedItem {
  name: string;
  price: number;
  change: string;
  signal: string;
  target?: number;
  shortTerm?: string;
  longTerm?: string;
}

export interface FeaturedData {
  topStocks: {
    thai: FeaturedItem[];
    us: FeaturedItem[];
    crypto: FeaturedItem[];
  };
  topCrypto: {
    gainers: FeaturedItem[];
    losers: FeaturedItem[];
    volume: FeaturedItem[];
  };
  trends: {
    stocks: { name: string; shortTerm: string; longTerm: string }[];
    crypto: { name: string; shortTerm: string; longTerm: string }[];
  };
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  enabled: boolean;
}

export interface PortfolioItem {
  id: string;
  asset: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  pl: number;
  plPercent: number;
}
