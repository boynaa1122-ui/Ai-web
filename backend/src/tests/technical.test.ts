import test from 'node:test';
import assert from 'node:assert';
import {
  calculateEMA,
  calculateSMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  analyzeMarketSignals,
  Candle
} from '../analysis/technical.js';

test('Technical Analysis Engine Tests', async (t) => {
  await t.test('calculateSMA calculates correct moving average', () => {
    const data = [10, 20, 30, 40, 50];
    const sma = calculateSMA(data, 3);
    assert.strictEqual(sma[0], null);
    assert.strictEqual(sma[1], null);
    assert.strictEqual(sma[2], 20); // (10+20+30)/3
    assert.strictEqual(sma[3], 30); // (20+30+40)/3
    assert.strictEqual(sma[4], 40); // (30+40+50)/3
  });

  await t.test('calculateEMA responds faster to recent price changes', () => {
    const data = [10, 10, 10, 20, 30];
    const ema = calculateEMA(data, 3);
    assert.strictEqual(ema[0], null);
    assert.strictEqual(ema[1], null);
    assert.strictEqual(ema[2], 10);
    assert.ok((ema[4] as number) > 15);
  });

  await t.test('calculateRSI returns values within 0 and 100', () => {
    const closes = [
      44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84, 46.08,
      45.89, 46.03, 45.61, 46.28, 46.28, 46.00, 46.03, 46.41, 46.22, 45.64
    ];
    const rsi = calculateRSI(closes, 14);
    const lastRsi = rsi[rsi.length - 1];
    assert.ok(lastRsi !== null);
    assert.ok((lastRsi as number) >= 0 && (lastRsi as number) <= 100);
  });

  await t.test('calculateMACD produces macd, signal line and histogram', () => {
    const closes = Array.from({ length: 40 }, (_, i) => 100 + i * 2);
    const macd = calculateMACD(closes);
    assert.strictEqual(macd.macdLine.length, closes.length);
    assert.strictEqual(macd.signalLine.length, closes.length);
    assert.strictEqual(macd.histogram.length, closes.length);
  });

  await t.test('calculateBollingerBands generates upper, middle and lower bands', () => {
    const closes = Array.from({ length: 30 }, (_, i) => 100 + Math.sin(i) * 5);
    const bb = calculateBollingerBands(closes, 20);
    const lastIdx = closes.length - 1;
    assert.ok((bb.upper[lastIdx] as number) >= (bb.middle[lastIdx] as number));
    assert.ok((bb.middle[lastIdx] as number) >= (bb.lower[lastIdx] as number));
  });

  await t.test('analyzeMarketSignals generates a valid signal score between 0 and 100', () => {
    const candles: Candle[] = Array.from({ length: 60 }, (_, i) => ({
      time: 1700000000 + i * 3600,
      open: 100 + i,
      high: 102 + i,
      low: 99 + i,
      close: 101 + i,
      volume: 2000 + i * 10
    }));

    const signal = analyzeMarketSignals('BTC/USDT', candles);
    assert.ok(['BUY SIGNAL', 'SELL SIGNAL', 'WATCH', 'NEUTRAL'].includes(signal.type));
    assert.ok(signal.score >= 0 && signal.score <= 100);
    assert.ok(signal.reasons.length > 0);
    assert.ok(signal.support.length === 2);
    assert.ok(signal.resistance.length === 2);
    assert.ok(signal.disclaimer.includes('ไม่ใช่คำแนะนำการลงทุน'));
  });
});
