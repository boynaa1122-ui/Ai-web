import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { FeaturedData } from '../types';

interface BottomTablesProps {
  data: FeaturedData;
  onSelectSymbol: (symbol: string) => void;
}

export const BottomTables: React.FC<BottomTablesProps> = ({ data, onSelectSymbol }) => {
  const [stockTab, setStockTab] = useState<'thai' | 'us' | 'crypto'>('thai');
  const [cryptoTab, setCryptoTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');
  const [trendTab, setTrendTab] = useState<'stocks' | 'crypto'>('stocks');

  const getSignalBadge = (sig: string) => {
    if (sig === 'BUY') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ▲ BUY
        </span>
      );
    }
    if (sig === 'SELL') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          ▼ SELL
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        ● WATCH
      </span>
    );
  };

  const getTrendBadge = (text: string) => {
    if (text === 'ขึ้น') {
      return <span className="text-emerald-400 font-semibold font-mono">ระยะสั้น: ขึ้น</span>;
    }
    if (text === 'ลง') {
      return <span className="text-rose-400 font-semibold font-mono">ระยะสั้น: ลง</span>;
    }
    return <span className="text-amber-400 font-semibold font-mono">ระยะสั้น: แกว่ง</span>;
  };

  const currentStocks = data.topStocks[stockTab] || [];
  const currentCrypto = data.topCrypto[cryptoTab] || [];
  const currentTrends = data.trends[trendTab] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. หุ้นเด่นวันนี้ */}
      <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">หุ้นเด่นวันนี้</h3>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center space-x-2 mb-3">
            {(['thai', 'us', 'crypto'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStockTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  stockTab === tab
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-navy-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'thai' ? 'หุ้นไทย' : tab === 'us' ? 'หุ้นสหรัฐ' : 'Crypto'}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-navy-800 text-[11px]">
                  <th className="pb-2 font-normal">ชื่อ</th>
                  <th className="pb-2 font-normal text-right">ราคาล่าสุด</th>
                  <th className="pb-2 font-normal text-center">สัญญาณ</th>
                  <th className="pb-2 font-normal text-right">เป้าหมาย</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-mono">
                {currentStocks.map((item) => (
                  <tr
                    key={item.name}
                    onClick={() => onSelectSymbol(item.name)}
                    className="hover:bg-navy-850/60 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold text-slate-200">{item.name}</td>
                    <td className="py-2.5 text-right font-medium text-slate-100">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className={`block text-[10px] ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.change}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">{getSignalBadge(item.signal)}</td>
                    <td className="py-2.5 text-right text-slate-300 font-semibold">
                      {item.target ? item.target.toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. เหรียญคริปโตที่น่าสนใจ */}
      <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">เหรียญคริปโตที่น่าสนใจ</h3>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center space-x-2 mb-3">
            {(['gainers', 'losers', 'volume'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCryptoTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  cryptoTab === tab
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-navy-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'gainers' ? 'Top Gainer' : tab === 'losers' ? 'Top Loser' : 'Volume'}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-navy-800 text-[11px]">
                  <th className="pb-2 font-normal">ชื่อ</th>
                  <th className="pb-2 font-normal text-right">ราคา</th>
                  <th className="pb-2 font-normal text-right">24h</th>
                  <th className="pb-2 font-normal text-center">สัญญาณ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-mono">
                {currentCrypto.map((item) => (
                  <tr
                    key={item.name}
                    onClick={() => onSelectSymbol(`${item.name}/USDT`)}
                    className="hover:bg-navy-850/60 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold text-slate-200">{item.name}</td>
                    <td className="py-2.5 text-right font-medium text-slate-100">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-2.5 text-right font-bold ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.change}
                    </td>
                    <td className="py-2.5 text-center">{getSignalBadge(item.signal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. แนวโน้มระยะสั้น / ระยะยาว */}
      <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-4 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">แนวโน้มระยะสั้น / ระยะยาว</h3>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center space-x-2 mb-3">
            {(['stocks', 'crypto'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTrendTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  trendTab === tab
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-navy-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'stocks' ? 'หุ้น' : 'Crypto'}
              </button>
            ))}
          </div>

          {/* Trend Items List */}
          <div className="divide-y divide-navy-800/60 text-xs">
            {currentTrends.map((item) => (
              <div
                key={item.name}
                onClick={() => onSelectSymbol(trendTab === 'crypto' ? `${item.name}/USDT` : item.name)}
                className="py-3 flex items-center justify-between hover:bg-navy-850/60 px-1 rounded-lg cursor-pointer transition-colors"
              >
                <div className="font-bold text-slate-200">{item.name}</div>
                <div className="flex items-center space-x-3 text-xs">
                  {getTrendBadge(item.shortTerm)}
                  <span className="text-emerald-400 font-semibold font-mono">
                    ระยะยาว: {item.longTerm}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
