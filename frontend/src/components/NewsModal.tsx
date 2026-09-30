import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { NewsItem } from '../types';
import { api } from '../services/api';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsId: string | null;
}

export const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, newsId }) => {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && newsId) {
      setLoading(true);
      api.getNewsById(newsId).then((data) => {
        setNewsItem(data);
        setLoading(false);
      });
    }
  }, [isOpen, newsId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <h2 className="text-base font-bold text-white">{loading ? 'กำลังโหลด...' : newsItem?.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {loading ? (
            <div className="text-center text-slate-400 py-10">กำลังโหลดเนื้อหาข่าว...</div>
        ) : (
            <div className="text-slate-200 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-cyan-400">{newsItem?.aiSummary}</p>
                <div className="bg-navy-950 p-4 rounded-xl border border-navy-800">
                    {newsItem?.fullContent}
                </div>
                <div className="text-xs text-slate-400">แหล่งข่าว: {newsItem?.source}</div>
            </div>
        )}
      </div>
    </div>
  );
};
