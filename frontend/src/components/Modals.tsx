import React, { useState } from 'react';
import { X, Check, Bot, AlertTriangle, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { AiMarketAnalysis, PriceAlert, PortfolioItem } from '../types';

interface ModalsProps {
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  aiAnalysis: AiMarketAnalysis;

  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;

  alertsModalOpen: boolean;
  setAlertsModalOpen: (open: boolean) => void;
  alerts: PriceAlert[];
  onAddAlert: (alert: Omit<PriceAlert, 'id'>) => void;
  onDeleteAlert: (id: string) => void;

  portfolioModalOpen: boolean;
  setPortfolioModalOpen: (open: boolean) => void;
  portfolio: PortfolioItem[];
  onAddPortfolio: (item: { asset: string; quantity: number; avgPrice: number }) => void;

  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  aiModalOpen,
  setAiModalOpen,
  aiAnalysis,
  settingsModalOpen,
  setSettingsModalOpen,
  alertsModalOpen,
  setAlertsModalOpen,
  alerts,
  onAddAlert,
  onDeleteAlert,
  portfolioModalOpen,
  setPortfolioModalOpen,
  portfolio,
  onAddPortfolio,
  notificationsOpen,
  setNotificationsOpen
}) => {
  // Alerts form state
  const [alertSymbol, setAlertSymbol] = useState('BTC/USDT');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  // Portfolio form state
  const [pfAsset, setPfAsset] = useState('BTC');
  const [pfQty, setPfQty] = useState('');
  const [pfPrice, setPfPrice] = useState('');

  // Settings state
  const [geminiKey, setGeminiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPrice) return;
    onAddAlert({
      symbol: alertSymbol,
      targetPrice: Number(alertPrice),
      condition: alertCondition,
      enabled: true
    });
    setAlertPrice('');
  };

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pfQty || !pfPrice) return;
    onAddPortfolio({
      asset: pfAsset,
      quantity: Number(pfQty),
      avgPrice: Number(pfPrice)
    });
    setPfQty('');
    setPfPrice('');
  };

  return (
    <>
      {/* 1. Full AI Analysis Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">รายงานสรุปวิเคราะห์ตลาดโดย AI</h2>
                  <div className="text-xs text-cyan-400 font-mono">NEXUS AI Intelligence Core</div>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 text-xs leading-relaxed text-slate-200">
              <span className="font-semibold text-cyan-400 block mb-1 text-sm">บทวิเคราะห์ภาพรวมทางเทคนิค</span>
              {aiAnalysis.technicalOverview}
            </div>

            {/* Bullish Factors */}
            <div>
              <h3 className="text-xs font-bold text-emerald-400 mb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>ปัจจัยบวก (Bullish Factors)</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {aiAnalysis.bullishFactors.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bearish & Risk Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold text-rose-400 mb-2 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ปัจจัยกดดัน (Bearish Factors)</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {aiAnalysis.bearishFactors.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-400 mb-2 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ความเสี่ยงที่ต้องจับตา (Risk Factors)</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {aiAnalysis.riskFactors.map((f, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-navy-950/90 border border-navy-800 text-[11px] text-slate-400 italic leading-relaxed">
              * {aiAnalysis.disclaimer}
            </div>

            <button
              onClick={() => setAiModalOpen(false)}
              className="w-full py-2.5 bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* 2. Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h2 className="text-base font-bold text-white">ตั้งค่าระบบ (Settings)</h2>
              <button onClick={() => setSettingsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">สกุลเงินหลัก</label>
                <select className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2 px-3 text-slate-200">
                  <option value="USD">USD ($ ดอลลาร์สหรัฐ)</option>
                  <option value="THB">THB (฿ บาทไทย)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Google Gemini API Key (อุปกรณ์เสริม)</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl py-2 px-3 text-slate-200 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">หากไม่ระบุ ระบบจะใช้ AI Financial Engine จำลองอัตโนมัติ</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSavedKey(true);
                    setTimeout(() => setSavedKey(false), 2000);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
                >
                  {savedKey ? 'บันทึกสำเร็จ ✓' : 'บันทึกการตั้งค่า'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Price Alerts Modal */}
      {alertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h2 className="text-base font-bold text-white">จัดการการแจ้งเตือนราคา (Price Alerts)</h2>
              <button onClick={() => setAlertsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Alert Form */}
            <form onSubmit={handleCreateAlert} className="space-y-3 bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs">
              <div className="font-semibold text-slate-200">สร้างการแจ้งเตือนใหม่</div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  placeholder="Symbol"
                  className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white font-mono"
                />
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white"
                >
                  <option value="ABOVE">ราคามากกว่า &gt;</option>
                  <option value="BELOW">ราคาน้อยกว่า &lt;</option>
                </select>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="ราคาเป้าหมาย"
                  className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มการแจ้งเตือน</span>
              </button>
            </form>

            {/* Active Alerts List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-slate-300">รายการแจ้งเตือนที่ใช้งานอยู่</div>
              {alerts.map((alt) => (
                <div key={alt.id} className="flex items-center justify-between p-2.5 rounded-lg bg-navy-850 border border-navy-800 text-xs">
                  <div>
                    <span className="font-bold text-white mr-2">{alt.symbol}</span>
                    <span className="font-mono text-slate-300">
                      {alt.condition === 'ABOVE' ? '≥' : '≤'} {alt.targetPrice.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteAlert(alt.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Portfolio Modal */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <h2 className="text-base font-bold text-white">พอร์ตการลงทุน (Portfolio Tracker)</h2>
              <button onClick={() => setPortfolioModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add Asset Form */}
            <form onSubmit={handleCreatePortfolio} className="grid grid-cols-4 gap-2 bg-navy-950 p-3 rounded-xl border border-navy-800 text-xs">
              <input
                type="text"
                value={pfAsset}
                onChange={(e) => setPfAsset(e.target.value)}
                placeholder="สินทรัพย์ (BTC, NVDA)"
                className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white font-mono"
              />
              <input
                type="number"
                step="any"
                value={pfQty}
                onChange={(e) => setPfQty(e.target.value)}
                placeholder="จำนวน"
                className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white font-mono"
              />
              <input
                type="number"
                step="any"
                value={pfPrice}
                onChange={(e) => setPfPrice(e.target.value)}
                placeholder="ราคาเฉลี่ย"
                className="bg-navy-900 border border-navy-700 rounded-lg p-2 text-white font-mono"
              />
              <button
                type="submit"
                className="py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>บันทึก</span>
              </button>
            </form>

            {/* Portfolio Table */}
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-navy-800 text-[11px]">
                    <th className="pb-2">สินทรัพย์</th>
                    <th className="pb-2 text-right">จำนวน</th>
                    <th className="pb-2 text-right">ราคาเฉลี่ย</th>
                    <th className="pb-2 text-right">มูลค่าปัจจุบัน</th>
                    <th className="pb-2 text-right">กำไร / ขาดทุน (P/L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60 font-mono">
                  {portfolio.map((item) => {
                    const isProfitable = item.pl >= 0;
                    return (
                      <tr key={item.id} className="hover:bg-navy-850/60">
                        <td className="py-2.5 font-bold text-white">{item.asset}</td>
                        <td className="py-2.5 text-right text-slate-300">{item.quantity}</td>
                        <td className="py-2.5 text-right text-slate-300">{item.avgPrice.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-semibold text-slate-100">{item.currentValue.toLocaleString()}</td>
                        <td className={`py-2.5 text-right font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfitable ? '+' : ''}{item.pl.toLocaleString()} ({isProfitable ? '+' : ''}{item.plPercent.toFixed(2)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Notifications Popover */}
      {notificationsOpen && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-navy-900 border border-navy-700 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <h3 className="text-xs font-bold text-white">การแจ้งเตือนล่าสุด</h3>
            <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-navy-950 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold mb-0.5">★ สัญญาณใหม่: BTC/USDT</div>
              <div className="text-slate-300 text-[11px]">ตรวจพบ BUY SIGNAL (คะแนน 76/100) แนวโน้มขาขึ้นแข็งแกร่ง</div>
            </div>
            <div className="p-2.5 rounded-lg bg-navy-950 border border-cyan-500/30">
              <div className="text-cyan-400 font-bold mb-0.5">⚡ การแจ้งเตือนราคา: SOL/USDT</div>
              <div className="text-slate-300 text-[11px]">ราคาทะลุ 175.00 ดอลลาร์ตามที่ตั้งไว้</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
