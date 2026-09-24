import React, { useState } from 'react';
import { Newspaper, ExternalLink, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  onViewAll?: () => void;
  onSelectNews?: (item: NewsItem) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onViewAll, onSelectNews }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'BTC':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'หุ้น':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'คริปโต':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'ตลาดไทย':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'BTC':
        return '₿';
      case 'หุ้น':
        return 'N';
      case 'คริปโต':
        return 'Ξ';
      case 'ตลาดไทย':
        return 'SET';
      default:
        return '⚡';
    }
  };

  return (
    <div className="bg-navy-900/90 rounded-2xl border border-navy-700/80 p-4 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">ข่าวล่าสุด</h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
        >
          <span>ดูทั้งหมด</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* News List */}
      <div className="divide-y divide-navy-800/80 overflow-y-auto flex-1 max-h-[360px] pr-1">
        {news.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNews && onSelectNews(item)}
            className="py-3 flex items-start space-x-3 cursor-pointer group hover:bg-navy-850/50 rounded-lg px-1 transition-all"
          >
            {/* Thumbnail Badge */}
            <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0 font-bold text-sm text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              {getIcon(item.category)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
              </div>
              <h3 className="text-xs font-medium text-slate-100 line-clamp-2 group-hover:text-cyan-300 transition-colors leading-relaxed">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>{item.source}</span>
                <span className="text-emerald-400 font-mono">POSITIVE</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
