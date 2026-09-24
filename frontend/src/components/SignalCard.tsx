import React from 'react';
import { Edit2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SignalAnalysis } from '../types';

interface SignalCardProps {
  signal: SignalAnalysis;
  onEditSymbol?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, onEditSymbol }) => {
  const isBuy = signal.type.includes('BUY');
  const isSell = signal.type.includes('SELL');

  const badgeColor = isBuy
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-green/30'
    : isSell
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
    : 'bg-amber-500/20 text-amber-400 border-amber-500/40';

  // Circular Score Meter (circumference for radius 38 is ~238.7)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = (signal.score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-5 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            ₿
          </div>
          <div>
            <div className="font-tech font-bold text-white text-sm">{signal.symbol}</div>
            <div className="text-[11px] text-slate-400">Bitcoin</div>
          </div>
        </div>
        {onEditSymbol && (
          <button
            onClick={onEditSymbol}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Signal Type Badge & Circular Score */}
      <div className="flex items-center justify-between bg-navy-950/60 p-3.5 rounded-xl border border-navy-800">
        <div>
          <div className="text-[11px] text-slate-400 mb-1">คะแนนสัญญาณ</div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              ★ {signal.type}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5">
            {signal.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 90 90">
            {/* Background track */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="#1e293b"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress bar */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke={isBuy ? '#10b981' : isSell ? '#f43f5e' : '#f59e0b'}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute font-tech font-bold text-base text-white">
            {signal.score}
          </div>
        </div>
      </div>

      {/* Reasons List */}
      <div>
        <div className="text-xs font-semibold text-slate-300 mb-2">เหตุผล</div>
        <div className="space-y-1.5">
          {signal.reasons.map((reason, i) => (
            <div key={i} className="flex items-center space-x-2 text-xs text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-navy-800">
        <div>
          <span className="text-slate-400 block text-[11px]">แนวรับ</span>
          <span className="font-mono font-semibold text-slate-200">
            {signal.support.map((s) => s.toLocaleString()).join(' / ')}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[11px]">แนวต้าน</span>
          <span className="font-mono font-semibold text-slate-200">
            {signal.resistance.map((r) => r.toLocaleString()).join(' / ')}
          </span>
        </div>
      </div>

      {/* System Recommendation Box */}
      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            ⓘ
          </div>
          <div>
            <div className="font-semibold text-emerald-400 mb-0.5">คำแนะนำจากระบบ</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {signal.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
