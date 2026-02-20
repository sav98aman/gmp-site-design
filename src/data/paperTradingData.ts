// Paper Trading Data Store — All types and initial state

export type Segment = 'EQ' | 'FUT' | 'OPT' | 'CNC';
export type OrderType = 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'OPEN' | 'EXECUTED' | 'CANCELLED' | 'REJECTED';
export type OptionType = 'CE' | 'PE';

export interface Order {
  id: string;
  symbol: string;
  segment: Segment;
  side: OrderSide;
  orderType: OrderType;
  qty: number;
  price: number; // limit price or trigger price
  triggerPrice?: number; // for SL/SL-M
  executedPrice?: number;
  status: OrderStatus;
  timestamp: Date;
  productType: 'MIS' | 'NRML' | 'CNC';
  // For F&O
  expiry?: string;
  strikePrice?: number;
  optionType?: OptionType;
  lotSize?: number;
  pnl?: number;
}

export interface Position {
  id: string;
  symbol: string;
  segment: Segment;
  side: OrderSide;
  qty: number;
  avgPrice: number;
  ltp: number; // last traded price
  pnl: number;
  pnlPercent: number;
  productType: 'MIS' | 'NRML' | 'CNC';
  // For F&O
  expiry?: string;
  strikePrice?: number;
  optionType?: OptionType;
  lotSize?: number;
}

export interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  currentValue: number;
  investedValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface FundsData {
  totalBalance: number;
  usedMargin: number;
  availableBalance: number;
  realizedPnL: number;
  unrealizedPnL: number;
  totalPnL: number;
}

// Options chain data
export interface OptionData {
  strikePrice: number;
  CE: {
    ltp: number;
    change: number;
    changePercent: number;
    oi: number;
    volume: number;
    iv: number;
    delta: number;
    theta: number;
  };
  PE: {
    ltp: number;
    change: number;
    changePercent: number;
    oi: number;
    volume: number;
    iv: number;
    delta: number;
    theta: number;
  };
}

// Future contract
export interface FutureContract {
  symbol: string;
  expiry: string;
  ltp: number;
  change: number;
  changePercent: number;
  oi: number;
  lotSize: number;
  margin: number;
}

// Generate mock options chain
export function generateOptionsChain(spotPrice: number, symbol: string): OptionData[] {
  const atm = Math.round(spotPrice / 50) * 50;
  const strikes: OptionData[] = [];
  for (let i = -8; i <= 8; i++) {
    const strike = atm + i * 50;
    const distance = Math.abs(spotPrice - strike);
    const isITM_CE = strike < spotPrice;
    const isITM_PE = strike > spotPrice;

    const baseIV = 18 + distance / spotPrice * 50;
    const ceLTP = isITM_CE
      ? (spotPrice - strike) + Math.max(5, Math.random() * 50)
      : Math.max(1, (50 - distance / 10) + Math.random() * 20);
    const peLTP = isITM_PE
      ? (strike - spotPrice) + Math.max(5, Math.random() * 50)
      : Math.max(1, (50 - distance / 10) + Math.random() * 20);

    strikes.push({
      strikePrice: strike,
      CE: {
        ltp: Number(ceLTP.toFixed(2)),
        change: Number((Math.random() * 20 - 10).toFixed(2)),
        changePercent: Number((Math.random() * 5 - 2.5).toFixed(2)),
        oi: Math.floor(Math.random() * 5000000 + 500000),
        volume: Math.floor(Math.random() * 200000 + 10000),
        iv: Number((baseIV + Math.random() * 3).toFixed(2)),
        delta: isITM_CE ? Number((0.5 + Math.random() * 0.4).toFixed(3)) : Number((0.1 + Math.random() * 0.4).toFixed(3)),
        theta: Number((-Math.random() * 5 - 0.5).toFixed(3)),
      },
      PE: {
        ltp: Number(peLTP.toFixed(2)),
        change: Number((Math.random() * 20 - 10).toFixed(2)),
        changePercent: Number((Math.random() * 5 - 2.5).toFixed(2)),
        oi: Math.floor(Math.random() * 5000000 + 500000),
        volume: Math.floor(Math.random() * 200000 + 10000),
        iv: Number((baseIV + Math.random() * 3).toFixed(2)),
        delta: isITM_PE ? Number(-(0.5 + Math.random() * 0.4).toFixed(3)) : Number(-(0.1 + Math.random() * 0.4).toFixed(3)),
        theta: Number((-Math.random() * 5 - 0.5).toFixed(3)),
      },
    });
  }
  return strikes;
}

// Generate future contracts
export function generateFutureContracts(symbol: string, spotPrice: number): FutureContract[] {
  const expiries = ['27 Feb 2025', '27 Mar 2025', '24 Apr 2025'];
  return expiries.map((expiry, i) => ({
    symbol,
    expiry,
    ltp: Number((spotPrice * (1 + i * 0.002) + (Math.random() - 0.5) * 10).toFixed(2)),
    change: Number((Math.random() * 30 - 15).toFixed(2)),
    changePercent: Number((Math.random() * 2 - 1).toFixed(2)),
    oi: Math.floor(Math.random() * 10000000 + 1000000),
    lotSize: getLotSize(symbol),
    margin: Math.floor(spotPrice * getLotSize(symbol) * 0.12),
  }));
}

export function getLotSize(symbol: string): number {
  const lots: Record<string, number> = {
    RELIANCE: 250, TCS: 150, HDFCBANK: 550, INFY: 300, TATAMOTORS: 1350,
    ICICIBANK: 700, BHARTIARTL: 475, WIPRO: 1500, SUNPHARMA: 350, ADANIENT: 250,
    NIFTY: 50, BANKNIFTY: 15,
  };
  return lots[symbol] || 500;
}

export const INITIAL_FUNDS: FundsData = {
  totalBalance: 1000000,
  usedMargin: 0,
  availableBalance: 1000000,
  realizedPnL: 0,
  unrealizedPnL: 0,
  totalPnL: 0,
};

export const PRODUCT_TYPES = {
  EQ: ['MIS', 'CNC'] as const,
  FUT: ['MIS', 'NRML'] as const,
  OPT: ['MIS', 'NRML'] as const,
  CNC: ['CNC'] as const,
};

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value);
}

export function formatINRCompact(value: number): string {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value.toFixed(2)}`;
}
