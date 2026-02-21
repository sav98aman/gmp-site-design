import { useState, useCallback, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { WatchlistPanel } from "@/components/trading/WatchlistPanel";
import { OrderPanel } from "@/components/trading/OrderPanel";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { OrderBook } from "@/components/trading/OrderBook";
import { HoldingsTable } from "@/components/trading/HoldingsTable";
import { OptionsChain } from "@/components/trading/OptionsChain";
import { FuturesPanel } from "@/components/trading/FuturesPanel";
import { FundsBar } from "@/components/trading/FundsBar";
import { StockPriceChart } from "@/components/market/StockPriceChart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { mockStocks, getChangePercent, getChangeAmount, getEquityStocks, getFnOStocks, type Stock } from "@/data/mockStockData";
import {
  type Order, type Position, type Holding, type FundsData, type Segment, type FutureContract,
  INITIAL_FUNDS, generateOptionsChain, generateFutureContracts, getLotSize, formatINR,
} from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, Activity, LayoutGrid, BookOpen, Package, LineChart, Layers } from "lucide-react";
import { toast } from "sonner";

type BottomTab = 'positions' | 'orders' | 'holdings';
type MainTab = 'EQ' | 'FUT' | 'OPT' | 'CNC';

const SEGMENT_LABELS: Record<MainTab, string> = {
  EQ: 'Equity Intraday',
  FUT: 'Futures',
  OPT: 'Options',
  CNC: 'Long-Term (CNC)',
};

export default function PaperTrading() {
  const [segment, setSegment] = useState<MainTab>('EQ');
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [funds, setFunds] = useState<FundsData>(INITIAL_FUNDS);
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions');

  // Segment-aware stock list and selection
  const segmentStocks = useMemo(() => {
    return (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
  }, [segment]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(segmentStocks[0] ?? null);

  // Auto-select first stock when segment changes
  useEffect(() => {
    const stocks = (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    const current = selectedStock;
    // If current stock isn't in the new segment's list, select the first one
    if (!current || !stocks.find(s => s.symbol === current.symbol)) {
      setSelectedStock(stocks[0] ?? null);
    }
  }, [segment]);

  // Options state
  const [selectedStrike, setSelectedStrike] = useState<number | undefined>();
  const [selectedOptionType, setSelectedOptionType] = useState<'CE' | 'PE' | undefined>();
  const [selectedOptionLTP, setSelectedOptionLTP] = useState<number | undefined>();

  // Futures state
  const [selectedFuture, setSelectedFuture] = useState<FutureContract | undefined>();

  const optionsChain = selectedStock ? generateOptionsChain(selectedStock.livePrice, selectedStock.symbol) : [];
  const futureContracts = selectedStock ? generateFutureContracts(selectedStock.symbol, selectedStock.livePrice) : [];

  // Auto-select first future contract when stock changes in FUT mode
  useEffect(() => {
    if (segment === 'FUT' && futureContracts.length > 0 && !selectedFuture) {
      setSelectedFuture(futureContracts[0]);
    }
  }, [selectedStock, segment, futureContracts.length]);

  // Recalculate unrealized P&L on positions
  useEffect(() => {
    const unrealizedPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
    setFunds(f => ({ ...f, unrealizedPnL }));
  }, [positions]);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setSelectedStrike(undefined);
    setSelectedOptionType(undefined);
    setSelectedFuture(undefined);
  };

  const handleSelectOption = (strike: number, type: 'CE' | 'PE', ltp: number) => {
    setSelectedStrike(strike);
    setSelectedOptionType(type);
    setSelectedOptionLTP(ltp);
  };

  const handleSelectFuture = (contract: FutureContract) => {
    setSelectedFuture(contract);
  };

  const handlePlaceOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    if (!selectedStock) return;

    const ltp = segment === 'FUT' && selectedFuture ? selectedFuture.ltp : selectedStock.livePrice;
    const executedPrice = orderData.orderType === 'MARKET' ? ltp : orderData.price;
    const totalValue = orderData.qty * executedPrice;
    const marginRequired = segment === 'EQ' || segment === 'CNC' ? totalValue : totalValue * 0.12;

    if (marginRequired > funds.availableBalance) {
      toast.error("Insufficient margin to place this order");
      return;
    }

    const orderId = `ORD${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      timestamp: new Date(),
      status: orderData.orderType === 'MARKET' ? 'EXECUTED' : 'OPEN',
      executedPrice: orderData.orderType === 'MARKET' ? executedPrice : undefined,
    };

    setOrders(prev => [...prev, newOrder]);

    if (orderData.orderType === 'MARKET') {
      const posId = `POS-${orderData.symbol}-${segment}-${orderData.strikePrice ?? ''}-${orderData.optionType ?? ''}-${orderData.expiry ?? ''}`;

      if (orderData.productType === 'CNC' && orderData.side === 'BUY') {
        setHoldings(prev => {
          const existing = prev.find(h => h.symbol === orderData.symbol);
          if (existing) {
            const newQty = existing.qty + orderData.qty;
            const newAvg = (existing.investedValue + totalValue) / newQty;
            return prev.map(h => h.symbol === orderData.symbol ? {
              ...h, qty: newQty, avgPrice: newAvg,
              investedValue: newQty * newAvg,
              currentValue: newQty * ltp,
              pnl: newQty * (ltp - newAvg),
              pnlPercent: ((ltp - newAvg) / newAvg) * 100,
            } : h);
          }
          return [...prev, {
            symbol: orderData.symbol, qty: orderData.qty, avgPrice: executedPrice,
            ltp, currentValue: orderData.qty * ltp, investedValue: totalValue,
            pnl: 0, pnlPercent: 0, dayChange: selectedStock.livePrice - selectedStock.previousClose,
            dayChangePercent: getChangePercent(selectedStock),
          }];
        });
      } else {
        setPositions(prev => {
          const existing = prev.find(p => p.id === posId);
          if (existing) {
            const netQty = orderData.side === 'BUY'
              ? existing.qty + orderData.qty
              : existing.qty - orderData.qty;
            if (netQty === 0) {
              const realizedPnL = (ltp - existing.avgPrice) * existing.qty * (existing.side === 'BUY' ? 1 : -1);
              setFunds(f => ({
                ...f,
                realizedPnL: f.realizedPnL + realizedPnL,
                usedMargin: Math.max(0, f.usedMargin - marginRequired),
                availableBalance: f.availableBalance + marginRequired + realizedPnL,
              }));
              toast.success(`Position squared off! P&L: ${realizedPnL >= 0 ? '+' : ''}${formatINR(realizedPnL)}`);
              return prev.filter(p => p.id !== posId);
            }
            return prev.map(p => p.id === posId ? {
              ...p, qty: Math.abs(netQty),
              pnl: (ltp - p.avgPrice) * Math.abs(netQty) * (p.side === 'BUY' ? 1 : -1),
              pnlPercent: ((ltp - p.avgPrice) / p.avgPrice) * 100 * (p.side === 'BUY' ? 1 : -1),
            } : p);
          }
          const newPosition: Position = {
            id: posId, symbol: orderData.symbol, segment: orderData.segment,
            side: orderData.side, qty: orderData.qty, avgPrice: executedPrice,
            ltp, pnl: 0, pnlPercent: 0, productType: orderData.productType,
            expiry: orderData.expiry, strikePrice: orderData.strikePrice,
            optionType: orderData.optionType, lotSize: orderData.lotSize,
          };
          return [...prev, newPosition];
        });
      }

      setFunds(f => ({
        ...f,
        usedMargin: f.usedMargin + marginRequired,
        availableBalance: f.availableBalance - marginRequired,
      }));

      toast.success(`${orderData.side} order executed — ${orderData.symbol} @ ${formatINR(executedPrice)}`);
    } else {
      toast.info(`${orderData.orderType} order placed for ${orderData.symbol}`);
    }
  }, [selectedStock, segment, selectedFuture, funds.availableBalance]);

  const handleSquareOff = (position: Position) => {
    const ltp = selectedStock?.livePrice ?? position.ltp;
    const pnl = (ltp - position.avgPrice) * position.qty * (position.side === 'BUY' ? 1 : -1);
    const marginReleased = position.qty * position.avgPrice * (position.segment === 'EQ' ? 1 : 0.12);

    setPositions(prev => prev.filter(p => p.id !== position.id));
    setFunds(f => ({
      ...f,
      realizedPnL: f.realizedPnL + pnl,
      usedMargin: Math.max(0, f.usedMargin - marginReleased),
      availableBalance: f.availableBalance + marginReleased + pnl,
    }));
    toast.success(`Squared off ${position.symbol}! P&L: ${pnl >= 0 ? '+' : ''}${formatINR(pnl)}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    toast.info("Order cancelled");
  };

  const handleReset = () => {
    setOrders([]);
    setPositions([]);
    setHoldings([]);
    setFunds(INITIAL_FUNDS);
    toast.success("Paper trading reset! Starting fresh with ₹10,00,000");
  };

  const openOrdersCount = orders.filter(o => o.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <FundsBar funds={funds} onReset={handleReset} />

      {/* Segment Tabs */}
      <div className="border-b border-border bg-card/30 px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {(Object.keys(SEGMENT_LABELS) as MainTab[]).map(seg => (
            <button
              key={seg}
              onClick={() => setSegment(seg)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all",
                segment === seg
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {seg === 'EQ' && <Activity className="h-3.5 w-3.5" />}
              {seg === 'FUT' && <LineChart className="h-3.5 w-3.5" />}
              {seg === 'OPT' && <Layers className="h-3.5 w-3.5" />}
              {seg === 'CNC' && <Package className="h-3.5 w-3.5" />}
              {seg}
              <span className="text-[10px] opacity-70 hidden sm:inline">· {SEGMENT_LABELS[seg]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>

        {/* Left: Watchlist */}
        <div className="w-52 shrink-0 border-r border-border bg-card/30 overflow-hidden flex flex-col">
          <WatchlistPanel selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />
        </div>

        {/* Center: Chart + Contracts + Bottom Tabs */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {selectedStock && (
            <div className="p-3 space-y-3">
              {/* Stock ticker row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <span className="font-bold text-lg">{selectedStock.symbol}</span>
                  <span className="text-xs text-muted-foreground ml-2">{selectedStock.name}</span>
                  {(segment === 'FUT' || segment === 'OPT') && (
                    <Badge variant="outline" className="ml-2 text-[10px]">F&O</Badge>
                  )}
                </div>
                <div className="font-mono text-xl font-bold">{selectedStock.livePrice.toFixed(2)}</div>
                <div className={cn("flex items-center gap-1 text-sm font-semibold", getChangePercent(selectedStock) >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {getChangePercent(selectedStock) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {getChangeAmount(selectedStock) >= 0 ? "+" : ""}{getChangeAmount(selectedStock).toFixed(2)}
                  ({getChangePercent(selectedStock) >= 0 ? "+" : ""}{getChangePercent(selectedStock).toFixed(2)}%)
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground ml-auto">
                  <span>H: <span className="text-foreground font-mono">{selectedStock.dayHigh.toFixed(2)}</span></span>
                  <span>L: <span className="text-foreground font-mono">{selectedStock.dayLow.toFixed(2)}</span></span>
                  <span>Vol: <span className="text-foreground font-mono">{(selectedStock.volume / 100000).toFixed(2)}L</span></span>
                  <span>52W H: <span className="text-foreground font-mono">{selectedStock.weekHigh52}</span></span>
                  <span>52W L: <span className="text-foreground font-mono">{selectedStock.weekLow52}</span></span>
                </div>
              </div>

              {/* Price Chart - only for EQ and CNC */}
              {(segment === 'EQ' || segment === 'CNC') && <StockPriceChart stock={selectedStock} />}

              {/* Futures Contracts */}
              {segment === 'FUT' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Futures Contracts</span>
                    <span className="text-xs text-muted-foreground">— Select contract to trade</span>
                  </div>
                  <FuturesPanel
                    contracts={futureContracts}
                    onSelectContract={handleSelectFuture}
                    selectedExpiry={selectedFuture?.expiry}
                  />
                </div>
              )}

              {/* Options Chain */}
              {segment === 'OPT' && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Options Chain</span>
                    <span className="text-xs text-muted-foreground">— Spot: {selectedStock.livePrice.toFixed(2)}</span>
                    {selectedStrike && selectedOptionType && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        Selected: {selectedStrike} {selectedOptionType}
                      </Badge>
                    )}
                  </div>
                  <OptionsChain
                    data={optionsChain}
                    spotPrice={selectedStock.livePrice}
                    onSelectOption={handleSelectOption}
                    selectedStrike={selectedStrike}
                    selectedType={selectedOptionType}
                  />
                </div>
              )}
            </div>
          )}

          {/* Bottom: Positions / Orders / Holdings */}
          <div className="border-t border-border bg-card/20">
            <div className="flex items-center gap-1 px-3 pt-2 border-b border-border">
              {([
                { key: 'positions', label: 'Positions', icon: LayoutGrid, count: positions.length },
                { key: 'orders', label: 'Orders', icon: BookOpen, count: openOrdersCount },
                { key: 'holdings', label: 'Holdings', icon: Package, count: holdings.length },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setBottomTab(tab.key)}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t transition-colors", bottomTab === tab.key ? "bg-background border border-border border-b-background text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-0.5 bg-primary text-primary-foreground rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 overflow-x-auto">
              {bottomTab === 'positions' && <PositionsTable positions={positions} onSquareOff={handleSquareOff} />}
              {bottomTab === 'orders' && <OrderBook orders={orders} onCancelOrder={handleCancelOrder} />}
              {bottomTab === 'holdings' && <HoldingsTable holdings={holdings} />}
            </div>
          </div>
        </div>

        {/* Right: Order Panel */}
        <div className="w-64 shrink-0 border-l border-border bg-card/30 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold">Order Entry</span>
              <Badge variant="outline" className="ml-auto text-[10px] px-1.5">{segment}</Badge>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <OrderPanel
              stock={selectedStock}
              availableBalance={funds.availableBalance}
              onPlaceOrder={handlePlaceOrder}
              segment={segment}
              selectedExpiry={segment === 'FUT' ? selectedFuture?.expiry : segment === 'OPT' ? 'Feb 27, 2025' : undefined}
              selectedStrike={segment === 'OPT' ? selectedStrike : undefined}
              selectedOptionType={segment === 'OPT' ? selectedOptionType : undefined}
              futurePrice={segment === 'FUT' ? selectedFuture?.ltp : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
