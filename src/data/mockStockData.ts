export interface StockPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FundamentalData {
  marketCap: number;
  pe: number;
  pb: number;
  eps: number;
  dividendYield: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  bookValue: number;
  faceValue: number;
  promoterHolding: number;
  fiiHolding: number;
  diiHolding: number;
  revenue: number;
  revenueGrowth: number;
  netProfit: number;
  netProfitGrowth: number;
  operatingMargin: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  sma20: number;
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  bollingerUpper: number;
  bollingerLower: number;
  atr: number;
  adx: number;
  stochastic: { k: number; d: number };
  support: number;
  resistance: number;
  pivotPoint: number;
  overallSignal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
}

export type CombinedVerdict = 'Bullish' | 'Moderately Bullish' | 'Neutral' | 'Moderately Bearish' | 'Bearish';

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  exchange: 'NSE' | 'BSE';
  livePrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  avgVolume: number;
  priceHistory: StockPrice[];
  fundamentals: FundamentalData;
  technicals: TechnicalIndicators;
  combinedVerdict: CombinedVerdict;
  combinedScore: number; // 0-100
  combinedSummary: string;
}

function generatePriceHistory(basePrice: number, days: number, volatility: number): StockPrice[] {
  const history: StockPrice[] = [];
  let price = basePrice * 0.85;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const change = (Math.random() - 0.48) * volatility * price;
    const open = price + (Math.random() - 0.5) * volatility * price * 0.3;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;
    const volume = Math.floor(500000 + Math.random() * 5000000);

    price = close;
    history.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });
  }
  return history;
}

export const mockStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Oil & Gas",
    exchange: "NSE",
    livePrice: 2847.35,
    previousClose: 2812.50,
    dayHigh: 2865.00,
    dayLow: 2805.10,
    weekHigh52: 3217.60,
    weekLow52: 2220.30,
    volume: 8542310,
    avgVolume: 7200000,
    priceHistory: generatePriceHistory(2847, 90, 0.02),
    fundamentals: {
      marketCap: 1927000, pe: 28.5, pb: 2.8, eps: 99.9, dividendYield: 0.35,
      roe: 9.8, roce: 10.2, debtToEquity: 0.38, bookValue: 1016.8, faceValue: 10,
      promoterHolding: 50.3, fiiHolding: 23.1, diiHolding: 14.2,
      revenue: 975000, revenueGrowth: 12.5, netProfit: 79500, netProfitGrowth: 8.2,
      operatingMargin: 15.4,
    },
    technicals: {
      rsi: 62.3, macd: { value: 18.5, signal: 12.3, histogram: 6.2 },
      sma20: 2790, sma50: 2750, sma200: 2650, ema12: 2810, ema26: 2770,
      bollingerUpper: 2910, bollingerLower: 2700, atr: 52.3, adx: 28.5,
      stochastic: { k: 72, d: 65 }, support: 2750, resistance: 2900, pivotPoint: 2840,
      overallSignal: 'Buy',
    },
    combinedVerdict: 'Moderately Bullish',
    combinedScore: 68,
    combinedSummary: "Strong fundamentals backed by Jio and retail segments. Technical indicators show bullish momentum with RSI above 60. Volume supports the current uptrend. Medium-term outlook positive.",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    sector: "IT Services",
    exchange: "NSE",
    livePrice: 4125.80,
    previousClose: 4150.20,
    dayHigh: 4168.50,
    dayLow: 4098.30,
    weekHigh52: 4592.25,
    weekLow52: 3311.80,
    volume: 3215640,
    avgVolume: 2800000,
    priceHistory: generatePriceHistory(4125, 90, 0.015),
    fundamentals: {
      marketCap: 1490000, pe: 32.1, pb: 14.2, eps: 128.5, dividendYield: 1.2,
      roe: 48.5, roce: 62.3, debtToEquity: 0.05, bookValue: 290.5, faceValue: 1,
      promoterHolding: 72.3, fiiHolding: 12.8, diiHolding: 8.5,
      revenue: 240000, revenueGrowth: 8.8, netProfit: 46500, netProfitGrowth: 6.5,
      operatingMargin: 24.8,
    },
    technicals: {
      rsi: 45.2, macd: { value: -8.2, signal: -3.5, histogram: -4.7 },
      sma20: 4180, sma50: 4200, sma200: 4050, ema12: 4155, ema26: 4170,
      bollingerUpper: 4280, bollingerLower: 4020, atr: 68.1, adx: 18.2,
      stochastic: { k: 38, d: 42 }, support: 4050, resistance: 4200, pivotPoint: 4140,
      overallSignal: 'Neutral',
    },
    combinedVerdict: 'Neutral',
    combinedScore: 52,
    combinedSummary: "Premium valuation with strong ROE but slowing revenue growth. Technical indicators are neutral with price consolidating near SMA50. Wait for breakout above 4200 for fresh entry.",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    sector: "Banking",
    exchange: "NSE",
    livePrice: 1685.40,
    previousClose: 1662.80,
    dayHigh: 1698.50,
    dayLow: 1655.00,
    weekHigh52: 1880.00,
    weekLow52: 1363.55,
    volume: 12450800,
    avgVolume: 10500000,
    priceHistory: generatePriceHistory(1685, 90, 0.018),
    fundamentals: {
      marketCap: 1280000, pe: 19.8, pb: 3.1, eps: 85.1, dividendYield: 1.15,
      roe: 16.8, roce: 0, debtToEquity: 0, bookValue: 543.5, faceValue: 1,
      promoterHolding: 26.1, fiiHolding: 33.2, diiHolding: 24.8,
      revenue: 325000, revenueGrowth: 22.5, netProfit: 64500, netProfitGrowth: 18.2,
      operatingMargin: 0,
    },
    technicals: {
      rsi: 68.5, macd: { value: 22.1, signal: 15.8, histogram: 6.3 },
      sma20: 1650, sma50: 1620, sma200: 1550, ema12: 1670, ema26: 1645,
      bollingerUpper: 1720, bollingerLower: 1600, atr: 38.2, adx: 32.5,
      stochastic: { k: 78, d: 72 }, support: 1620, resistance: 1720, pivotPoint: 1680,
      overallSignal: 'Strong Buy',
    },
    combinedVerdict: 'Bullish',
    combinedScore: 82,
    combinedSummary: "Excellent growth trajectory post-merger. Strong technical setup with price above all key moving averages. FII accumulation continues. Best banking stock for medium to long-term.",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    sector: "IT Services",
    exchange: "NSE",
    livePrice: 1862.50,
    previousClose: 1878.30,
    dayHigh: 1890.00,
    dayLow: 1845.20,
    weekHigh52: 1997.80,
    weekLow52: 1358.40,
    volume: 5832100,
    avgVolume: 5200000,
    priceHistory: generatePriceHistory(1862, 90, 0.018),
    fundamentals: {
      marketCap: 772000, pe: 28.8, pb: 8.5, eps: 64.7, dividendYield: 2.1,
      roe: 32.5, roce: 42.1, debtToEquity: 0.08, bookValue: 219.1, faceValue: 5,
      promoterHolding: 14.8, fiiHolding: 34.2, diiHolding: 18.5,
      revenue: 165000, revenueGrowth: 5.2, netProfit: 26800, netProfitGrowth: 3.8,
      operatingMargin: 21.2,
    },
    technicals: {
      rsi: 42.8, macd: { value: -12.5, signal: -6.8, histogram: -5.7 },
      sma20: 1895, sma50: 1910, sma200: 1780, ema12: 1880, ema26: 1890,
      bollingerUpper: 1950, bollingerLower: 1810, atr: 42.5, adx: 22.1,
      stochastic: { k: 32, d: 38 }, support: 1820, resistance: 1920, pivotPoint: 1870,
      overallSignal: 'Sell',
    },
    combinedVerdict: 'Moderately Bearish',
    combinedScore: 38,
    combinedSummary: "Slowing revenue growth and margin pressure from AI disruption concerns. Technical weakness with price below key moving averages. Good dividend stock but avoid fresh entry at current levels.",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    sector: "Automobiles",
    exchange: "NSE",
    livePrice: 785.60,
    previousClose: 768.90,
    dayHigh: 798.50,
    dayLow: 762.30,
    weekHigh52: 1179.00,
    weekLow52: 612.80,
    volume: 18920500,
    avgVolume: 15000000,
    priceHistory: generatePriceHistory(785, 90, 0.025),
    fundamentals: {
      marketCap: 289000, pe: 8.2, pb: 3.5, eps: 95.8, dividendYield: 0.5,
      roe: 38.2, roce: 22.5, debtToEquity: 1.15, bookValue: 224.5, faceValue: 2,
      promoterHolding: 46.4, fiiHolding: 18.5, diiHolding: 16.2,
      revenue: 445000, revenueGrowth: 28.5, netProfit: 35200, netProfitGrowth: 142.0,
      operatingMargin: 12.8,
    },
    technicals: {
      rsi: 58.2, macd: { value: 8.5, signal: 5.2, histogram: 3.3 },
      sma20: 760, sma50: 740, sma200: 820, ema12: 775, ema26: 762,
      bollingerUpper: 810, bollingerLower: 720, atr: 28.5, adx: 25.8,
      stochastic: { k: 62, d: 55 }, support: 740, resistance: 820, pivotPoint: 782,
      overallSignal: 'Buy',
    },
    combinedVerdict: 'Moderately Bullish',
    combinedScore: 65,
    combinedSummary: "JLR turnaround driving massive profit growth. Low PE makes it attractive. Price recovering from 52-week lows. EV transition adds long-term value but high debt is a concern.",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    sector: "Banking",
    exchange: "NSE",
    livePrice: 1268.90,
    previousClose: 1255.40,
    dayHigh: 1282.00,
    dayLow: 1248.50,
    weekHigh52: 1362.35,
    weekLow52: 970.05,
    volume: 9856200,
    avgVolume: 8500000,
    priceHistory: generatePriceHistory(1268, 90, 0.016),
    fundamentals: {
      marketCap: 892000, pe: 18.5, pb: 3.4, eps: 68.6, dividendYield: 0.8,
      roe: 18.2, roce: 0, debtToEquity: 0, bookValue: 373.2, faceValue: 2,
      promoterHolding: 0, fiiHolding: 42.5, diiHolding: 28.2,
      revenue: 218000, revenueGrowth: 18.8, netProfit: 48200, netProfitGrowth: 25.5,
      operatingMargin: 0,
    },
    technicals: {
      rsi: 65.8, macd: { value: 15.2, signal: 10.5, histogram: 4.7 },
      sma20: 1245, sma50: 1220, sma200: 1180, ema12: 1258, ema26: 1240,
      bollingerUpper: 1310, bollingerLower: 1200, atr: 32.5, adx: 30.2,
      stochastic: { k: 70, d: 64 }, support: 1220, resistance: 1310, pivotPoint: 1265,
      overallSignal: 'Buy',
    },
    combinedVerdict: 'Bullish',
    combinedScore: 78,
    combinedSummary: "Consistent profit growth with improving asset quality. FII favourite with 42.5% holding. Strong technical setup with all moving averages supportive. Among top banking picks.",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    sector: "Telecom",
    exchange: "NSE",
    livePrice: 1580.25,
    previousClose: 1598.80,
    dayHigh: 1610.00,
    dayLow: 1568.30,
    weekHigh52: 1778.00,
    weekLow52: 1065.50,
    volume: 4125800,
    avgVolume: 3800000,
    priceHistory: generatePriceHistory(1580, 90, 0.017),
    fundamentals: {
      marketCap: 952000, pe: 78.5, pb: 8.2, eps: 20.1, dividendYield: 0.5,
      roe: 12.5, roce: 10.8, debtToEquity: 1.52, bookValue: 192.7, faceValue: 5,
      promoterHolding: 52.1, fiiHolding: 24.8, diiHolding: 12.5,
      revenue: 155000, revenueGrowth: 22.0, netProfit: 12100, netProfitGrowth: 245.0,
      operatingMargin: 28.5,
    },
    technicals: {
      rsi: 48.5, macd: { value: -5.8, signal: -2.1, histogram: -3.7 },
      sma20: 1600, sma50: 1620, sma200: 1480, ema12: 1590, ema26: 1600,
      bollingerUpper: 1660, bollingerLower: 1530, atr: 38.2, adx: 15.8,
      stochastic: { k: 42, d: 48 }, support: 1530, resistance: 1640, pivotPoint: 1585,
      overallSignal: 'Neutral',
    },
    combinedVerdict: 'Neutral',
    combinedScore: 50,
    combinedSummary: "Telecom leader with ARPU growth story but very expensive valuation at 78x PE. Technical consolidation after sharp rally. Wait for correction to 1480-1500 zone for better entry.",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    sector: "IT Services",
    exchange: "NSE",
    livePrice: 298.45,
    previousClose: 302.10,
    dayHigh: 305.80,
    dayLow: 295.20,
    weekHigh52: 324.55,
    weekLow52: 208.40,
    volume: 7845600,
    avgVolume: 6500000,
    priceHistory: generatePriceHistory(298, 90, 0.02),
    fundamentals: {
      marketCap: 312000, pe: 24.5, pb: 4.2, eps: 12.2, dividendYield: 0.3,
      roe: 16.8, roce: 20.5, debtToEquity: 0.15, bookValue: 71.1, faceValue: 2,
      promoterHolding: 72.9, fiiHolding: 8.5, diiHolding: 10.2,
      revenue: 92000, revenueGrowth: 2.5, netProfit: 12700, netProfitGrowth: -1.2,
      operatingMargin: 16.5,
    },
    technicals: {
      rsi: 38.2, macd: { value: -3.8, signal: -1.5, histogram: -2.3 },
      sma20: 306, sma50: 310, sma200: 285, ema12: 301, ema26: 305,
      bollingerUpper: 318, bollingerLower: 288, atr: 8.5, adx: 20.5,
      stochastic: { k: 28, d: 35 }, support: 288, resistance: 315, pivotPoint: 300,
      overallSignal: 'Sell',
    },
    combinedVerdict: 'Bearish',
    combinedScore: 28,
    combinedSummary: "Weakest among IT majors with declining profit and minimal revenue growth. Technical breakdown below key averages. High promoter holding limits downside but no catalyst for upside.",
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Industries Ltd",
    sector: "Pharmaceuticals",
    exchange: "NSE",
    livePrice: 1792.30,
    previousClose: 1780.50,
    dayHigh: 1805.00,
    dayLow: 1770.20,
    weekHigh52: 1960.35,
    weekLow52: 1208.50,
    volume: 3524100,
    avgVolume: 3200000,
    priceHistory: generatePriceHistory(1792, 90, 0.016),
    fundamentals: {
      marketCap: 430000, pe: 38.2, pb: 7.5, eps: 46.9, dividendYield: 0.6,
      roe: 18.5, roce: 20.8, debtToEquity: 0.12, bookValue: 239.0, faceValue: 1,
      promoterHolding: 54.5, fiiHolding: 22.1, diiHolding: 12.8,
      revenue: 52000, revenueGrowth: 11.2, netProfit: 11200, netProfitGrowth: 32.5,
      operatingMargin: 28.2,
    },
    technicals: {
      rsi: 55.2, macd: { value: 5.2, signal: 3.8, histogram: 1.4 },
      sma20: 1780, sma50: 1760, sma200: 1650, ema12: 1785, ema26: 1775,
      bollingerUpper: 1830, bollingerLower: 1740, atr: 28.5, adx: 18.5,
      stochastic: { k: 55, d: 50 }, support: 1740, resistance: 1840, pivotPoint: 1790,
      overallSignal: 'Buy',
    },
    combinedVerdict: 'Moderately Bullish',
    combinedScore: 62,
    combinedSummary: "Specialty pharma leader with strong margin profile. Good profit growth trajectory. Technical indicators mildly bullish. Accumulate on dips for long-term portfolio.",
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises Ltd",
    sector: "Conglomerate",
    exchange: "NSE",
    livePrice: 2425.60,
    previousClose: 2458.30,
    dayHigh: 2470.00,
    dayLow: 2405.80,
    weekHigh52: 3743.90,
    weekLow52: 2025.00,
    volume: 6215400,
    avgVolume: 5500000,
    priceHistory: generatePriceHistory(2425, 90, 0.028),
    fundamentals: {
      marketCap: 277000, pe: 62.5, pb: 6.8, eps: 38.8, dividendYield: 0.05,
      roe: 11.2, roce: 8.5, debtToEquity: 1.85, bookValue: 356.7, faceValue: 1,
      promoterHolding: 72.6, fiiHolding: 8.2, diiHolding: 10.5,
      revenue: 105000, revenueGrowth: 15.8, netProfit: 4420, netProfitGrowth: -18.5,
      operatingMargin: 6.8,
    },
    technicals: {
      rsi: 35.8, macd: { value: -28.5, signal: -15.2, histogram: -13.3 },
      sma20: 2500, sma50: 2580, sma200: 2700, ema12: 2470, ema26: 2510,
      bollingerUpper: 2620, bollingerLower: 2350, atr: 72.5, adx: 35.2,
      stochastic: { k: 22, d: 28 }, support: 2350, resistance: 2550, pivotPoint: 2440,
      overallSignal: 'Strong Sell',
    },
    combinedVerdict: 'Bearish',
    combinedScore: 22,
    combinedSummary: "High debt with declining profits and stretched valuations. Strong technical downtrend with price below all major moving averages. Avoid until debt situation improves and technicals stabilize.",
  },
];

export function getStockBySymbol(symbol: string): Stock | undefined {
  return mockStocks.find(s => s.symbol === symbol);
}

export function getChangePercent(stock: Stock): number {
  return Number(((stock.livePrice - stock.previousClose) / stock.previousClose * 100).toFixed(2));
}

export function getChangeAmount(stock: Stock): number {
  return Number((stock.livePrice - stock.previousClose).toFixed(2));
}

export function getTopGainers(count = 5): Stock[] {
  return [...mockStocks].sort((a, b) => getChangePercent(b) - getChangePercent(a)).slice(0, count);
}

export function getTopLosers(count = 5): Stock[] {
  return [...mockStocks].sort((a, b) => getChangePercent(a) - getChangePercent(b)).slice(0, count);
}

export function getMostActive(count = 5): Stock[] {
  return [...mockStocks].sort((a, b) => b.volume - a.volume).slice(0, count);
}

export function formatMarketCap(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L Cr`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K Cr`;
  return `₹${value} Cr`;
}

export function formatVolume(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return `${value}`;
}
