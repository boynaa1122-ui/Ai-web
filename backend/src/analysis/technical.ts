export interface Candle {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  ema9: (number | null)[];
  ema20: (number | null)[];
  ema50: (number | null)[];
  ema200: (number | null)[];
  rsi14: (number | null)[];
  macd: {
    macdLine: (number | null)[];
    signalLine: (number | null)[];
    histogram: (number | null)[];
  };
  bollingerBands: {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
  };
}

export interface SignalAnalysis {
  symbol: string;
  type: 'BUY SIGNAL' | 'SELL SIGNAL' | 'WATCH' | 'NEUTRAL';
  score: number; // 0 - 100
  reasons: string[];
  support: number[];
  resistance: number[];
  recommendation: string;
  shortTerm: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  longTerm: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  disclaimer: string;
}

export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);

  if (data.length < period) {
    return data.map(() => null);
  }

  // Initial SMA as starting point
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
    result.push(null);
  }
  let prevEma = sum / period;
  result[period - 1] = Number(prevEma.toFixed(2));

  for (let i = period; i < data.length; i++) {
    const currentEma = data[i] * k + prevEma * (1 - k);
    result.push(Number(currentEma.toFixed(2)));
    prevEma = currentEma;
  }

  return result;
}

export function calculateRSI(closes: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (closes.length <= period) {
    return closes.map(() => null);
  }

  const changes: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  let gains = 0;
  let losses = 0;

  for (let i = 0; i < period; i++) {
    result.push(null);
    if (changes[i] >= 0) {
      gains += changes[i];
    } else {
      losses += Math.abs(changes[i]);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = 100 - 100 / (1 + firstRS);
  result.push(Number(firstRSI.toFixed(2)));

  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    result.push(Number(rsi.toFixed(2)));
  }

  return result;
}

export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macdLine: (number | null)[]; signalLine: (number | null)[]; histogram: (number | null)[] } {
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  const macdLine: (number | null)[] = [];
  const validMacdValues: number[] = [];
  const validMacdIndices: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      const val = Number(((fastEMA[i] as number) - (slowEMA[i] as number)).toFixed(2));
      macdLine.push(val);
      validMacdValues.push(val);
      validMacdIndices.push(i);
    } else {
      macdLine.push(null);
    }
  }

  const signalEMA = calculateEMA(validMacdValues, signalPeriod);
  const signalLine: (number | null)[] = new Array(closes.length).fill(null);
  const histogram: (number | null)[] = new Array(closes.length).fill(null);

  for (let j = 0; j < validMacdIndices.length; j++) {
    const originalIdx = validMacdIndices[j];
    const sigVal = signalEMA[j];
    signalLine[originalIdx] = sigVal;
    if (sigVal !== null && macdLine[originalIdx] !== null) {
      histogram[originalIdx] = Number(((macdLine[originalIdx] as number) - sigVal).toFixed(2));
    }
  }

  return { macdLine, signalLine, histogram };
}

export function calculateBollingerBands(
  closes: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const sma = calculateSMA(closes, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1 || sma[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = sma[i] as number;
      const squaredDiffs = slice.map((val) => Math.pow(val - mean, 2));
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
      const stdDev = Math.sqrt(variance);

      upper.push(Number((mean + stdDevMultiplier * stdDev).toFixed(2)));
      lower.push(Number((mean - stdDevMultiplier * stdDev).toFixed(2)));
    }
  }

  return { upper, middle: sma, lower };
}

export function findSupportResistance(candles: Candle[]): { support: number[]; resistance: number[] } {
  if (candles.length < 5) {
    const lastPrice = candles[candles.length - 1]?.close || 100;
    return {
      support: [Number((lastPrice * 0.97).toFixed(2)), Number((lastPrice * 0.94).toFixed(2))],
      resistance: [Number((lastPrice * 1.03).toFixed(2)), Number((lastPrice * 1.06).toFixed(2))]
    };
  }

  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const lastClose = candles[candles.length - 1].close;

  const pivotHighs: number[] = [];
  const pivotLows: number[] = [];

  for (let i = 2; i < candles.length - 2; i++) {
    if (highs[i] > highs[i - 1] && highs[i] > highs[i - 2] && highs[i] > highs[i + 1] && highs[i] > highs[i + 2]) {
      pivotHighs.push(highs[i]);
    }
    if (lows[i] < lows[i - 1] && lows[i] < lows[i - 2] && lows[i] < lows[i + 1] && lows[i] < lows[i + 2]) {
      pivotLows.push(lows[i]);
    }
  }

  const supports = pivotLows.filter((p) => p < lastClose).sort((a, b) => b - a);
  const resistances = pivotHighs.filter((p) => p > lastClose).sort((a, b) => a - b);

  return {
    support: [
      supports[0] || Number((lastClose * 0.98).toFixed(2)),
      supports[1] || Number((lastClose * 0.95).toFixed(2))
    ],
    resistance: [
      resistances[0] || Number((lastClose * 1.02).toFixed(2)),
      resistances[1] || Number((lastClose * 1.05).toFixed(2))
    ]
  };
}

export function analyzeMarketSignals(symbol: string, candles: Candle[]): SignalAnalysis {
  const closes = candles.map((c) => c.close);
  const volumes = candles.map((c) => c.volume);
  const n = closes.length;
  const currentPrice = closes[n - 1] || 100;

  const ema9 = calculateEMA(closes, 9);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, 200);
  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes);
  const { support, resistance } = findSupportResistance(candles);

  const lastEMA20 = ema20[n - 1] ?? currentPrice;
  const lastEMA50 = ema50[n - 1] ?? currentPrice;
  const lastEMA200 = ema200[n - 1] ?? currentPrice;
  const lastRSI = rsi[n - 1] ?? 50;
  const lastMACDHist = macd.histogram[n - 1] ?? 0;
  const prevMACDHist = macd.histogram[n - 2] ?? 0;

  const avgVol = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const lastVol = volumes[n - 1] || avgVol;
  const volChangePct = Math.round(((lastVol - avgVol) / (avgVol || 1)) * 100);

  let score = 50;
  const reasons: string[] = [];

  // Trend checks
  if (currentPrice > lastEMA20) {
    score += 10;
    reasons.push('ราคาอยู่เหนือ EMA20');
  } else {
    score -= 10;
    reasons.push('ราคาหลุดต่ำกว่า EMA20');
  }

  if (lastEMA20 > lastEMA50) {
    score += 10;
    reasons.push('EMA20 > EMA50 (แนวโน้มขาขึ้นระยะกลาง)');
  } else {
    score -= 10;
    reasons.push('EMA20 < EMA50 (แนวโน้มขาลงระยะกลาง)');
  }

  // RSI checks
  if (lastRSI > 50 && lastRSI < 70) {
    score += 10;
    reasons.push(`RSI = ${lastRSI.toFixed(0)} (อยู่ในโซนแข็งแกร่ง ไม่ Overbought)`);
  } else if (lastRSI >= 70) {
    score -= 5;
    reasons.push(`RSI = ${lastRSI.toFixed(0)} (เข้าสู่โซน Overbought ระวังการพักตัว)`);
  } else if (lastRSI <= 30) {
    score += 8;
    reasons.push(`RSI = ${lastRSI.toFixed(0)} (เข้าสู่โซน Oversold มีโอกาสดีดตัว)`);
  }

  // MACD checks
  if (lastMACDHist > 0 && lastMACDHist > prevMACDHist) {
    score += 10;
    reasons.push('MACD โมเมนตัมเร่งตัวขึ้นอย่างต่อเนื่อง');
  } else if (lastMACDHist > 0) {
    score += 5;
    reasons.push('MACD อยู่ในโซนบวก');
  } else {
    score -= 8;
    reasons.push('MACD อยู่ในโซนลบ');
  }

  // Volume checks
  if (volChangePct > 15) {
    score += 8;
    reasons.push(`Volume เพิ่มขึ้น +${volChangePct}% ยืนยันแรงซื้อ`);
  }

  // Long term check
  const isAboveEMA200 = currentPrice > lastEMA200;
  if (isAboveEMA200) {
    score += 8;
  }

  // Clamp score
  score = Math.max(10, Math.min(96, score));

  let type: SignalAnalysis['type'] = 'NEUTRAL';
  let recommendation = '';

  if (score >= 70) {
    type = 'BUY SIGNAL';
    recommendation = `เหมาะสำหรับการเข้า Long/ซื้อสะสม หากราคาอ่อนตัวไม่หลุดแนวรับ ${support[0]?.toLocaleString()}`;
  } else if (score <= 35) {
    type = 'SELL SIGNAL';
    recommendation = `แนะนำลดสัดส่วนการถือครองหรือวาง Stop Loss ใกล้แนวรับ ${support[0]?.toLocaleString()}`;
  } else if (score >= 55) {
    type = 'WATCH';
    recommendation = `รอจังหวะ Breakout ผ่านแนวต้าน ${resistance[0]?.toLocaleString()} หรือย่อทดสอบแนวรับ`;
  } else {
    type = 'NEUTRAL';
    recommendation = `ตลาดแกว่งตัวไซด์เวย์ แนะนำถือเงินสดหรือเทรดตามกรอบแนวรับแนวต้าน`;
  }

  const shortTerm = score >= 60 ? 'BULLISH' : score <= 40 ? 'BEARISH' : 'SIDEWAYS';
  const longTerm = isAboveEMA200 ? 'BULLISH' : 'BEARISH';

  return {
    symbol,
    type,
    score,
    reasons,
    support,
    resistance,
    recommendation,
    shortTerm,
    longTerm,
    disclaimer: 'สัญญาณนี้สร้างจากข้อมูลตลาดและตัวชี้วัดทางเทคนิค ใช้เพื่อประกอบการศึกษา ไม่ใช่คำแนะนำการลงทุน'
  };
}
