import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onOpenSettings, onOpenNotifications }) => {
  const [searchInput, setSearchInput] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const d = now.getDate();
      const m = thaiMonths[now.getMonth()];
      const y = now.getFullYear() + 543;
      const time = now.toLocaleTimeString('th-TH', { hour12: false });
      setTimeStr(`${d} ${m} ${y} ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchInput);
    }
  };

  return (
    <header className="h-13 sm:h-14 border-b border-navy-700/80 bg-navy-950/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Left: Brand Logo & Title (Optimized for Mobile) */}
      <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-glow-cyan flex items-center justify-center">
          <div className="w-full h-full bg-navy-950 rounded-[7px] flex items-center justify-center">
            <span className="font-tech text-base sm:text-lg font-black text-cyan-400">N</span>
          </div>
        </div>
        <div>
          <h1 className="font-tech font-bold text-xs sm:text-sm md:text-base tracking-wider text-white leading-tight">
            NEXUS <span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-[7px] sm:text-[9px] tracking-wider text-slate-400 font-mono hidden xs:block">
            STOCKS • CRYPTO
          </p>
        </div>
      </div>

      {/* Middle: Search Bar (Desktop / Tablet) */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ค้นหาหุ้น / เหรียญ..."
            className="w-full bg-navy-900 border border-navy-700 rounded-full py-1 pl-8 pr-8 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Right Controls: Compact for Mobile */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* LIVE Indicator (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-navy-900/80 border border-navy-700/60 rounded-full px-2.5 py-0.5 text-[11px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold font-mono">LIVE</span>
          <span className="text-slate-400 font-mono text-[10px]">{timeStr}</span>
        </div>

        {/* Live Badge for Mobile */}
        <div className="flex lg:hidden items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-emerald-400">LIVE</span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title="การแจ้งเตือน"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
        </button>

        {/* Settings Icon */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title="ตั้งค่า"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center space-x-1.5 pl-1 sm:pl-2 border-l border-navy-800">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
            <div className="w-full h-full bg-navy-900 rounded-full flex items-center justify-center font-bold text-cyan-300 text-[10px] sm:text-xs">
              TB
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-[11px] font-semibold text-white leading-tight">Trader Boy</div>
          </div>
        </div>
      </div>
    </header>
  );
};
