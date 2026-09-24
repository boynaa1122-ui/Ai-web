import React, { useState, useEffect } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';

interface AiMascotBubbleProps {
  currentSymbol?: string;
  currentPrice?: number;
}

export const AiMascotBubble: React.FC<AiMascotBubbleProps> = ({ currentSymbol = 'BTC/USDT', currentPrice }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('สวัสดีครับ! ผม Nexus AI Bot ผู้ช่วยวิเคราะห์หุ้นและคริปโต พร้อมเกาะติดสถานการณ์ตลาดแบบเรียลไทม์ให้คุณครับ 🚀');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const messages = [
      `🤖 AI Bot: สังเกตเห็น ${currentSymbol} กำลังเคลื่อนไหวในกรอบขาขึ้น แนะนำรอดูจังหวะแนวรับครับ!`,
      `✨ วิเคราะห์ด่วน: วอลุ่มซื้อขาย ${currentSymbol} หนาแน่น สัญญาณทางเทคนิคบ่งชี้โมเมนตัมเชิงบวก`,
      `💡 คำแนะนำ: อย่าลืมตั้ง Stop Loss และบริหารความเสี่ยงในการเทรดเสมอครับ!`
    ];
    const timer = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMsg);
      setPulse(true);
      setTimeout(() => setPulse(false), 3000);
    }, 12000);
    return () => clearInterval(timer);
  }, [currentSymbol]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center border-2 border-cyan-300/40 transition-transform hover:scale-110 group"
          title="เปิดผู้ช่วย AI Mascot"
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs sm:max-w-sm animate-fade-in">
      <div className={`bg-navy-900/95 backdrop-blur-md rounded-2xl border-2 ${pulse ? 'border-cyan-400 shadow-glow-cyan' : 'border-cyan-500/50'} p-4 shadow-2xl text-slate-100 flex flex-col space-y-3 relative overflow-hidden`}>
        {/* Background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 text-base">
              🤖
            </div>
            <div>
              <div className="font-tech font-bold text-xs sm:text-sm text-cyan-300 flex items-center space-x-1">
                <span>Nexus AI Assistant</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              </div>
              <div className="text-[10px] font-mono text-emerald-400">● Gemini 1.5 Active</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            title="ย่อลงเป็นหุ่นยนต์จิ๋ว"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Bubble */}
        <div className="bg-navy-950/80 rounded-xl p-3 border border-navy-800 text-xs font-mono text-slate-200 leading-relaxed shadow-inner">
          <p>{message}</p>
          {currentPrice && (
            <div className="mt-2 pt-2 border-t border-navy-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{currentSymbol}</span>
              <span className="font-bold text-cyan-300">${currentPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer quick action */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>ขับเคลื่อนด้วย Gemini AI</span>
          <span className="text-cyan-400 font-semibold animate-pulse">● พร้อมช่วยเหลือ</span>
        </div>
      </div>
    </div>
  );
};
