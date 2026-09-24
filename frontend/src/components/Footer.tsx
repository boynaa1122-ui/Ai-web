import React from 'react';
import { ShieldAlert, Globe, Clock, CheckCircle } from 'lucide-react';

interface FooterProps {
  isDemo?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDemo = true }) => {
  return (
    <footer className="border-t border-navy-800 bg-navy-950/80 px-4 py-3 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
      {/* Thai Legal Financial Disclaimer */}
      <div className="flex items-center space-x-2 text-center md:text-left">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:block" />
        <p className="leading-tight">
          ข้อมูลและการวิเคราะห์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำในการลงทุน โปรดศึกษาข้อมูลและความเสี่ยงก่อนตัดสินใจลงทุน
        </p>
      </div>

      {/* External Providers and Status */}
      <div className="flex flex-wrap items-center justify-center space-x-4 font-mono text-[10px] shrink-0">
        <span className="flex items-center space-x-1 hover:text-slate-200">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Twelve Data</span>
        </span>
        <span className="flex items-center space-x-1 hover:text-slate-200">
          <span>🪙</span>
          <span>CoinGecko</span>
        </span>
        <span className="flex items-center space-x-1 hover:text-slate-200">
          <span>📊</span>
          <span>Alpha Vantage</span>
        </span>
        <span className="flex items-center space-x-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          <span>{isDemo ? 'DEMO DATA' : 'Real-time'}</span>
        </span>
        <span className="flex items-center space-x-1 text-slate-400">
          <Clock className="w-3 h-3" />
          <span>24/7</span>
        </span>
      </div>
    </footer>
  );
};
