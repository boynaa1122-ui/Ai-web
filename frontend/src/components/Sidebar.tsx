import React from 'react';
import {
  Home,
  TrendingUp,
  Coins,
  LineChart,
  Zap,
  Newspaper,
  Briefcase,
  Bell,
  Settings,
  Bot,
  ChevronRight
} from 'lucide-react';
import { MarketTicker } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overviewTickers: MarketTicker[];
  onOpenAiReport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  overviewTickers,
  onOpenAiReport
}) => {
  const navItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: Home },
    { id: 'stocks', label: 'ตลาดหุ้น', icon: TrendingUp },
    { id: 'crypto', label: 'คริปโต', icon: Coins },
    { id: 'charts', label: 'กราฟ & วิเคราะห์', icon: LineChart },
    { id: 'signals', label: 'สัญญาณซื้อขาย', icon: Zap },
    { id: 'news', label: 'ข่าวสารตลาด', icon: Newspaper },
    { id: 'portfolio', label: 'พอร์ตการลงทุน', icon: Briefcase },
    { id: 'alerts', label: 'แจ้งเตือนราคา', icon: Bell },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-950/80 border-r border-navy-700/70 p-4 space-y-6 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/90 to-cyan-500/80 text-white shadow-glow-blue font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-navy-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mini Market Summary in Sidebar */}
        <div className="pt-4 border-t border-navy-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">ภาพรวมตลาด</span>
          </div>
          <div className="space-y-2">
            {overviewTickers.slice(0, 5).map((ticker) => {
              const isPos = ticker.changePercent >= 0;
              return (
                <div
                  key={ticker.symbol}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-navy-900/60 border border-navy-800/80 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{ticker.symbol.replace('/USDT', '')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-slate-200">{ticker.price.toLocaleString()}</div>
                    <div className={`text-[10px] font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '▲' : '▼'} {isPos ? '+' : ''}{ticker.changePercent}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis Promo Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-navy-850 to-navy-900 border border-cyan-500/30 shadow-glow-cyan/20 relative overflow-hidden mt-auto">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">AI วิเคราะห์ตลาด</div>
              <div className="text-[10px] text-cyan-400 font-mono">สรุปแนวโน้ม + สัญญาณซื้อขาย</div>
            </div>
          </div>
          <button
            onClick={onOpenAiReport}
            className="w-full mt-2 py-1.5 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 font-medium flex items-center justify-center space-x-1 transition-all"
          >
            <span>ดูเพิ่มเติม</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-navy-950/95 border-t border-navy-800 backdrop-blur-lg flex items-center justify-around z-40 px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg ${
                isActive ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
