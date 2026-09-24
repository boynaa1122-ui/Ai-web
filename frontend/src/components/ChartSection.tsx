import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Camera,
  Maximize2,
  Minimize2,
  Crosshair,
  TrendingUp,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Candle, MarketTicker } from '../types';

interface ChartSectionProps {
  symbol: string;
  ticker?: MarketTicker;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  isDemo?: boolean;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  symbol,
  ticker,
  candles,
  timeframe,
  setTimeframe,
  isDemo = true
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('crosshair');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [candleCount, setCandleCount] = useState<number>(55); // Zoom control

  // Binance-style Indicator toggles
  const [indicators, setIndicators] = useState({
    ema: true,
    boll: true,
    volume: true,
    rsi: true,
    macd: true
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

  const currentPrice = ticker?.price || candles[candles.length - 1]?.close || 104832.45;
  const change = ticker?.change || 2361.76;
  const changePercent = ticker?.changePercent || 2.36;
  const isPos = changePercent >= 0;

  const toggleIndicator = (key: keyof typeof indicators) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Canvas Drawing Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Calculate dynamic pane heights (Binance style)
    const activeSubPanes = [indicators.volume, indicators.rsi, indicators.macd].filter(Boolean).length;
    const subPaneHeight = activeSubPanes > 0 ? Math.min(height * 0.16, 75) : 0;
    const totalSubHeight = activeSubPanes * (subPaneHeight + 8);
    const priceChartHeight = Math.max(height - totalSubHeight - 35, 180);
    const priceChartTop = 15;

    let nextTop = priceChartTop + priceChartHeight + 8;
    const volumeTop = indicators.volume ? nextTop : 0;
    if (indicators.volume) nextTop += subPaneHeight + 8;

    const rsiTop = indicators.rsi ? nextTop : 0;
    if (indicators.rsi) nextTop += subPaneHeight + 8;

    const macdTop = indicators.macd ? nextTop : 0;

    const visibleCandles = candles.slice(-candleCount);
    const n = visibleCandles.length;
    const chartRightPadding = 75;
    const candleWidth = (width - chartRightPadding) / n;
    const bodyWidth = Math.max(candleWidth * 0.72, 3);

    // 1. Price Bounds
    const highs = visibleCandles.map((c) => c.high);
    const lows = visibleCandles.map((c) => c.low);
    const maxPrice = Math.max(...highs) * 1.003;
    const minPrice = Math.min(...lows) * 0.997;
    const priceRange = maxPrice - minPrice || 1;

    const getY = (val: number) =>
      priceChartTop + priceChartHeight - ((val - minPrice) / priceRange) * priceChartHeight;

    // Grid lines for price
    ctx.strokeStyle = '#152033';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono';

    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const p = minPrice + (priceRange / priceSteps) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - chartRightPadding, y);
      ctx.stroke();

      ctx.fillText(p.toLocaleString(undefined, { maximumFractionDigits: 1 }), width - chartRightPadding + 6, y + 3);
    }

    // Draw Bollinger Bands (if enabled)
    if (indicators.boll && visibleCandles.length >= 20) {
      const period = 20;
      const upperPts: { x: number; y: number }[] = [];
      const lowerPts: { x: number; y: number }[] = [];
      const midPts: { x: number; y: number }[] = [];

      for (let i = period - 1; i < n; i++) {
        const slice = visibleCandles.slice(i - period + 1, i + 1).map((c) => c.close);
        const sma = slice.reduce((a, b) => a + b, 0) / period;
        const variance = slice.reduce((sum, v) => sum + Math.pow(v - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        const x = i * candleWidth + candleWidth / 2;
        upperPts.push({ x, y: getY(sma + 2 * stdDev) });
        midPts.push({ x, y: getY(sma) });
        lowerPts.push({ x, y: getY(sma - 2 * stdDev) });
      }

      // Draw BOLL Lines
      const drawBandLine = (pts: { x: number; y: number }[], color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        pts.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      };

      drawBandLine(upperPts, 'rgba(56, 189, 248, 0.4)');
      drawBandLine(midPts, 'rgba(234, 179, 8, 0.4)');
      drawBandLine(lowerPts, 'rgba(56, 189, 248, 0.4)');
    }

    // Draw Candlesticks
    visibleCandles.forEach((c, idx) => {
      const x = idx * candleWidth + candleWidth / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? '#10b981' : '#f43f5e';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, getY(c.high));
      ctx.lineTo(x, getY(c.low));
      ctx.stroke();

      // Body
      const topY = getY(Math.max(c.open, c.close));
      const bHeight = Math.max(Math.abs(getY(c.open) - getY(c.close)), 2);
      ctx.fillStyle = color;
      ctx.fillRect(x - bodyWidth / 2, topY, bodyWidth, bHeight);
    });

    // Draw EMA Lines (if enabled)
    if (indicators.ema) {
      const drawEma = (period: number, strokeColor: string) => {
        const k = 2 / (period + 1);
        let ema = visibleCandles[0].close;
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;

        visibleCandles.forEach((c, idx) => {
          ema = c.close * k + ema * (1 - k);
          const x = idx * candleWidth + candleWidth / 2;
          const y = getY(ema);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };

      drawEma(9, '#00e5ff');   // EMA 9: Cyan
      drawEma(20, '#10b981');  // EMA 20: Emerald
      drawEma(50, '#eab308');  // EMA 50: Yellow
      drawEma(200, '#a855f7'); // EMA 200: Purple
    }

    // Current Live Price Dashed Line & Badge
    const curY = getY(currentPrice);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, curY);
    ctx.lineTo(width - chartRightPadding, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Price Badge on Y-Axis
    ctx.fillStyle = isPos ? '#10b981' : '#f43f5e';
    ctx.fillRect(width - chartRightPadding, curY - 9, chartRightPadding - 5, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px JetBrains Mono';
    ctx.fillText(currentPrice.toLocaleString(undefined, { maximumFractionDigits: 1 }), width - chartRightPadding + 4, curY + 4);

    // 2. Volume Sub-Pane
    if (indicators.volume) {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('VOL (Volume)', 8, volumeTop + 11);

      const maxVol = Math.max(...visibleCandles.map((c) => c.volume)) || 1;
      visibleCandles.forEach((c, idx) => {
        const x = idx * candleWidth + candleWidth / 2;
        const vHeight = (c.volume / maxVol) * (subPaneHeight - 14);
        ctx.fillStyle = c.close >= c.open ? 'rgba(16, 185, 129, 0.45)' : 'rgba(244, 63, 94, 0.45)';
        ctx.fillRect(x - bodyWidth / 2, volumeTop + subPaneHeight - vHeight, bodyWidth, vHeight);
      });

      // Border line for volume pane
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, volumeTop);
      ctx.lineTo(width - chartRightPadding, volumeTop);
      ctx.stroke();
    }

    // 3. RSI Sub-Pane
    if (indicators.rsi) {
      ctx.fillStyle = '#a855f7';
      ctx.fillText('RSI (14): 62.34', 8, rsiTop + 11);

      // Bounds 70 / 50 / 30
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.setLineDash([2, 2]);
      [70, 50, 30].forEach((level) => {
        const y = rsiTop + subPaneHeight - (level / 100) * subPaneHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width - chartRightPadding, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // RSI Curve
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      visibleCandles.forEach((c, idx) => {
        const x = idx * candleWidth + candleWidth / 2;
        const rsiVal = 50 + Math.sin(idx / 3.5) * 18 + (c.close >= c.open ? 6 : -6);
        const y = rsiTop + subPaneHeight - (rsiVal / 100) * (subPaneHeight - 12);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, rsiTop);
      ctx.lineTo(width - chartRightPadding, rsiTop);
      ctx.stroke();
    }

    // 4. MACD Sub-Pane
    if (indicators.macd) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('MACD (12, 26, 9)   342.17  287.62  54.55', 8, macdTop + 11);

      const zeroY = macdTop + subPaneHeight / 2;
      visibleCandles.forEach((_, idx) => {
        const x = idx * candleWidth + candleWidth / 2;
        const hist = Math.sin(idx / 4) * (subPaneHeight * 0.38);
        ctx.fillStyle = hist >= 0 ? '#10b981' : '#f43f5e';
        ctx.fillRect(x - bodyWidth / 2, zeroY, bodyWidth, -hist);
      });

      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, macdTop);
      ctx.lineTo(width - chartRightPadding, macdTop);
      ctx.stroke();
    }

    // Time Axis at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '9px JetBrains Mono';
    const step = Math.max(Math.floor(n / 6), 5);
    for (let i = 0; i < n; i += step) {
      const c = visibleCandles[i];
      const x = i * candleWidth;
      const d = new Date(c.time * 1000);
      const label = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      ctx.fillText(label, x, height - 4);
    }

    // Crosshair Tracker
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n) {
      const hx = hoverIndex * candleWidth + candleWidth / 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(hx, 0);
      ctx.lineTo(hx, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [candles, currentPrice, hoverIndex, indicators, candleCount, isFullscreen]);

  // Handle Resize & Dimensions
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        // Large spacious height (520px on desktop, 440px on mobile, full screen in modal)
        canvasRef.current.height = isFullscreen ? window.innerHeight - 130 : window.innerWidth < 768 ? 440 : 530;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || candles.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const candleWidth = (canvasRef.current.width - 75) / Math.min(candles.length, candleCount);
    const idx = Math.floor(x / candleWidth);
    setHoverIndex(idx);
  };

  const hoveredCandle = hoverIndex !== null && candles[candles.length - candleCount + hoverIndex]
    ? candles[candles.length - candleCount + hoverIndex]
    : null;

  return (
    <div
      className={`bg-navy-900/95 rounded-2xl border border-navy-700/80 shadow-2xl flex flex-col overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none p-4 bg-[#070b14]' : 'p-3 sm:p-4'
      }`}
    >
      {/* 1. Header Info Bar (Binance Style) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-navy-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
            ₿
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-tech font-bold text-sm sm:text-base text-white">{symbol}</span>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-0.5 rounded ${isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>
              {isDemo && (
                <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1 py-0.2 rounded">
                  DEMO DATA
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-[11px] font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPos ? '+' : ''}{change.toLocaleString()} ({isPos ? '+' : ''}{changePercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* 24h Stats */}
        <div className="hidden sm:flex items-center space-x-4 text-xs font-mono">
          <div>
            <div className="text-[9px] text-slate-400">สูงสุด 24h</div>
            <div className="text-slate-200 font-semibold text-[11px]">
              {(ticker?.high24h || currentPrice * 1.025).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">ต่ำสุด 24h</div>
            <div className="text-slate-200 font-semibold text-[11px]">
              {(ticker?.low24h || currentPrice * 0.978).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">ปริมาณ 24h</div>
            <div className="text-slate-200 font-semibold text-[11px]">{ticker?.volume24h || '38.7B USDT'}</div>
          </div>
        </div>

        {/* Controls: Zoom & Fullscreen */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCandleCount((prev) => Math.min(prev + 15, 80))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-navy-800"
            title="ซูมออก (แสดงแท่งเทียนมากขึ้น)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCandleCount((prev) => Math.max(prev - 15, 25))}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-navy-800"
            title="ซูมเข้า (ขยายแท่งเทียน)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-blue-600/30 text-cyan-300 hover:bg-blue-600/50 hover:text-white transition-all ml-1"
            title={isFullscreen ? 'ย่อหน้าจอปกติ' : 'ขยายกราฟเต็มจอ (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Timeframe Bar */}
      <div className="flex items-center justify-between py-1.5 border-b border-navy-800 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline mr-1">Time:</span>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-all ${
                timeframe === tf
                  ? 'bg-blue-600 text-white font-bold shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Live Hover Info (OHLCV) like Binance */}
        {hoveredCandle ? (
          <div className="hidden md:flex items-center space-x-2 text-[10px] font-mono text-slate-300">
            <span>O: <strong className="text-white">{hoveredCandle.open}</strong></span>
            <span>H: <strong className="text-emerald-400">{hoveredCandle.high}</strong></span>
            <span>L: <strong className="text-rose-400">{hoveredCandle.low}</strong></span>
            <span>C: <strong className="text-white">{hoveredCandle.close}</strong></span>
            <span>Vol: <strong className="text-cyan-400">{hoveredCandle.volume}</strong></span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-medium">EMA9: 103,987</span>
            <span className="text-emerald-400 font-medium">EMA20: 103,542</span>
            <span className="text-amber-400 font-medium">EMA50: 102,871</span>
          </div>
        )}
      </div>

      {/* 3. Binance-style Indicator Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-1 bg-navy-950/60 border-b border-navy-800/80 text-[11px]">
        <span className="text-slate-400 font-mono text-[10px] mr-1">Indicators:</span>
        
        {/* Main Overlays */}
        <button
          onClick={() => toggleIndicator('ema')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
            indicators.ema
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan/20'
              : 'text-slate-500 hover:text-slate-300 bg-navy-900 border border-transparent'
          }`}
        >
          EMA
        </button>

        <button
          onClick={() => toggleIndicator('boll')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
            indicators.boll
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-glow-blue/20'
              : 'text-slate-500 hover:text-slate-300 bg-navy-900 border border-transparent'
          }`}
        >
          BOLL
        </button>

        <span className="text-slate-600 font-mono mx-1">|</span>

        {/* Sub-panes */}
        <button
          onClick={() => toggleIndicator('volume')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
            indicators.volume
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              : 'text-slate-500 hover:text-slate-300 bg-navy-900 border border-transparent'
          }`}
        >
          VOL
        </button>

        <button
          onClick={() => toggleIndicator('rsi')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
            indicators.rsi
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
              : 'text-slate-500 hover:text-slate-300 bg-navy-900 border border-transparent'
          }`}
        >
          RSI
        </button>

        <button
          onClick={() => toggleIndicator('macd')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
            indicators.macd
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-slate-500 hover:text-slate-300 bg-navy-900 border border-transparent'
          }`}
        >
          MACD
        </button>

        <div className="ml-auto text-[10px] text-slate-400 font-mono hidden sm:block">
          {isFullscreen ? 'กด ESC หรือปุ่มย่อเพื่อออก' : 'คลิกเพื่อเปิด/ปิด Indicator'}
        </div>
      </div>

      {/* 4. Main Chart Canvas Area */}
      <div className="flex flex-1 pt-1 min-h-[440px] sm:min-h-[530px]" ref={containerRef}>
        {/* Left Drawing Tools Sidebar */}
        <div className="w-7 shrink-0 flex flex-col items-center space-y-2 border-r border-navy-800 pr-1 text-slate-400 pt-1">
          <button
            onClick={() => setActiveTool('crosshair')}
            className={`p-1 rounded ${activeTool === 'crosshair' ? 'text-cyan-400 bg-navy-800' : 'hover:text-white'}`}
            title="Crosshair"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('trend')}
            className={`p-1 rounded ${activeTool === 'trend' ? 'text-cyan-400 bg-navy-800' : 'hover:text-white'}`}
            title="Trendline"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('text')}
            className={`p-1 rounded ${activeTool === 'text' ? 'text-cyan-400 bg-navy-800' : 'hover:text-white'}`}
            title="Text"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setCandleCount(55);
              setIndicators({ ema: true, boll: true, volume: true, rsi: true, macd: true });
            }}
            className="p-1 rounded text-slate-500 hover:text-cyan-300"
            title="รีเซ็ตกราฟ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="flex-1 pl-1.5 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair block"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </div>
      </div>
    </div>
  );
};
