import React from 'react';
import { MarketTicker } from '../types';

interface MarketOverviewProps {
  tickers: MarketTicker[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  tickers,
  selectedSymbol,
  onSelectSymbol
}) => {
  const getIcon = (sym: string) => {
    if (sym.includes('SET')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
          SET
        </div>
      );
    }
    if (sym.includes('S&P')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
          $
        </div>
      );
    }
    if (sym.includes('NASDAQ')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
          NQ
        </div>
      );
    }
    if (sym.includes('BTC')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
          ₿
        </div>
      );
    }
    if (sym.includes('ETH')) {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
          Ξ
        </div>
      );
    }
    return (
      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">
        {sym.slice(0, 2)}
      </div>
    );
  };

  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 20;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg className="w-14 sm:w-16 h-5 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 pb-1 no-scrollbar">
      {tickers.map((ticker) => {
        const isPos = ticker.changePercent >= 0;
        const isSelected = selectedSymbol === ticker.symbol || selectedSymbol === `${ticker.symbol}/USDT`;

        return (
          <div
            key={ticker.symbol}
            onClick={() => onSelectSymbol(ticker.symbol.includes('BTC') || ticker.symbol.includes('ETH') ? `${ticker.symbol}/USDT` : ticker.symbol)}
            className={`p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all duration-200 border flex items-center justify-between shrink-0 min-w-[130px] sm:min-w-0 ${
              isSelected
                ? 'bg-navy-850 border-cyan-500/70 shadow-glow-cyan/20'
                : 'bg-navy-900/80 border-navy-700/60 hover:bg-navy-850'
            }`}
          >
            <div className="flex items-center space-x-2">
              {getIcon(ticker.symbol)}
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-200 leading-tight">{ticker.symbol}</div>
                <div className="text-xs sm:text-sm font-mono font-bold text-white tracking-tight leading-tight">
                  {ticker.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] font-mono font-medium flex items-center space-x-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span>{isPos ? '▲' : '▼'}</span>
                  <span>{isPos ? '+' : ''}{ticker.changePercent}%</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block pl-1">
              {renderSparkline(ticker.sparkline, isPos)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
