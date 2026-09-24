import React from 'react';
import { Bot, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AiMarketAnalysis } from '../types';

interface AiAnalysisCardProps {
  analysis: AiMarketAnalysis;
  onOpenFullReport: () => void;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({
  analysis,
  onOpenFullReport
}) => {
  return (
    <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-5 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-2 border-b border-navy-800">
        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center">
          <Bot className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>{analysis.summaryTitle}</span>
          </h2>
          <div className="text-[10px] text-slate-400 font-mono">อัปเดตอัตโนมัติด้วย AI Engine</div>
        </div>
      </div>

      {/* Bullet Insights */}
      <div className="space-y-2 text-xs">
        {analysis.insights.map((insight, idx) => (
          <div key={idx} className="flex items-start space-x-2 text-slate-200">
            <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
            <span className="leading-relaxed">{insight}</span>
          </div>
        ))}
      </div>

      {/* Watchlist Highlights */}
      <div className="bg-navy-950/60 p-3 rounded-xl border border-navy-800">
        <div className="text-[11px] font-semibold text-slate-300 mb-2">หุ้นที่ควรจับตา (วันนี้)</div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {/* Bullish */}
          {analysis.bullishSymbols.map((s) => (
            <div key={s.symbol} className="flex items-center space-x-1 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">{s.symbol}</span>
            </div>
          ))}
          {/* Bearish */}
          {analysis.bearishSymbols.map((s) => (
            <div key={s.symbol} className="flex items-center space-x-1 text-rose-400">
              <TrendingDown className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">{s.symbol}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full Report Button */}
      <button
        onClick={onOpenFullReport}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-xs font-bold text-white shadow-glow-blue flex items-center justify-center space-x-2 transition-all"
      >
        <span>ดูบทวิเคราะห์ฉบับเต็ม</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
