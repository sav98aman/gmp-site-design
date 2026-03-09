import { useState, useCallback, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { WatchlistPanel } from "@/components/trading/WatchlistPanel";
import { OrderPanel } from "@/components/trading/OrderPanel";
import { OrderDrawer } from "@/components/trading/OrderDrawer";
import { StockSearchDropdown } from "@/components/trading/StockSearchDropdown";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { OrderBook } from "@/components/trading/OrderBook";
import { HoldingsTable } from "@/components/trading/HoldingsTable";
import { OptionsChain } from "@/components/trading/OptionsChain";
import { FuturesPanel } from "@/components/trading/FuturesPanel";
import { FundsBar } from "@/components/trading/FundsBar";
import { MarketDepth } from "@/components/trading/MarketDepth";
import { StockPriceChart } from "@/components/market/StockPriceChart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { getChangePercent, getChangeAmount, getEquityStocks, getFnOStocks, type Stock } from "@/data/mockStockData";
import {
  type Order, type Position, type Holding, type FundsData, type Segment, type FutureContract,
  type OrderSide, INITIAL_FUNDS, generateOptionsChain, generateFutureContracts, formatINR,
} from "@/data/paperTradingData";
import {
  TrendingUp, TrendingDown, Activity, LayoutGrid, BookOpen, Package,
  LineChart, Layers, Keyboard
} from "lucide-react";
import { toast } from "sonner";

type BottomTab = 'positions' | 'orders' | 'holdings';
type MainTab = 'EQ' | 'FUT' | 'OPT' | 'CNC';

const SEGMENTS: { key: MainTab; label: string; icon: typeof Activity }[] = [
  { key: 'EQ', label: 'Intraday', icon: Activity },
  { key: 'FUT', label: 'Futures', icon: LineChart },
  { key: 'OPT', label: 'Options', icon: Layers },
  { key: 'CNC', label: 'Delivery', icon: Package },
];

export default function PaperTrading() {
  const isMobile = useIsMobile();
  const [segment, setSegment] = useState<MainTab>('EQ');
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [funds, setFunds] = useState<FundsData>(INITIAL_FUNDS);
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<OrderSide>('BUY');
  const [showDepth, setShowDepth] = useState(false);

  const segmentStocks = useMemo(() =>
    (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks(), [segment]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(segmentStocks[0] ?? null);

  useEffect(() => {
    const stocks = (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    if (!selectedStock || !stocks.find(s => s.symbol === selectedStock.symbol)) {
      setSelectedStock(stocks[0] ?? null);
    }
  }, [segment]);

  const [selectedStrike, setSelectedStrike] = useState<number | undefined>();
  const [selectedOptionType, setSelectedOptionType] = useState<'CE' | 'PE' | undefined>();
  const [selectedOptionLTP, setSelectedOptionLTP] = useState<number | undefined>();
  const [selectedFuture, setSelectedFuture] = useState<FutureContract | undefined>();

  const optionsChain = selectedStock ? generateOptionsChain(selectedStock.livePrice, selectedStock.symbol) : [];
  const futureContracts = selectedStock ? generateFutureContracts(selectedStock.symbol, selectedStock.livePrice) : [];

  useEffect(() => {
    if (segment === 'FUT' && futureContracts.length > 0 && !selectedFuture) setSelectedFuture(futureContracts[0]);
  }, [selectedStock, segment, futureContracts.length]);

  useEffect(() => {
    setFunds(f => ({ ...f, unrealizedPnL: positions.reduce((sum, p) => sum + p.pnl, 0) }));
  }, [positions]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b' || e.key === 'B') { setDrawerSide('BUY'); setDrawerOpen(true); }
      if (e.key === 's' || e.key === 'S') { setDrawerSide('SELL'); setDrawerOpen(true); }
      if (e.key === 'Escape') setDrawerOpen(false);
      if (e.key === 'd' || e.key === 'D') setShowDepth(p => !p);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setSelectedStrike(undefined);
    setSelectedOptionType(undefined);
    setSelectedFuture(undefined);
  };

  const openBuy = (stock?: Stock) => {
    if (stock) setSelectedStock(stock);
    setDrawerSide('BUY'); setDrawerOpen(true);
  };
  const openSell = (stock?: Stock) => {
    if (stock) setSelectedStock(stock);
    setDrawerSide('SELL'); setDrawerOpen(true);
  };

  // ── Order Execution ──
  const handlePlaceOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    if (!selectedStock) return;
    const ltp = segment === 'FUT' && selectedFuture ? selectedFuture.ltp : selectedStock.livePrice;
    const executedPrice = orderData.orderType === 'MARKET' ? ltp : orderData.price;
    const totalValue = orderData.qty * executedPrice;
    const marginRequired = segment === 'EQ' || segment === 'CNC' ? totalValue : totalValue * 0.12;

    if (marginRequired > funds.availableBalance) { toast.error("Insufficient margin"); return; }

    const newOrder: Order = {
      ...orderData, id: `ORD${Date.now()}`, timestamp: new Date(),
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
              ...h, qty: newQty, avgPrice: newAvg, investedValue: newQty * newAvg,
              currentValue: newQty * ltp, pnl: newQty * (ltp - newAvg),
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
            const netQty = orderData.side === 'BUY' ? existing.qty + orderData.qty : existing.qty - orderData.qty;
            if (netQty === 0) {
              const realizedPnL = (ltp - existing.avgPrice) * existing.qty * (existing.side === 'BUY' ? 1 : -1);
              setFunds(f => ({
                ...f, realizedPnL: f.realizedPnL + realizedPnL,
                usedMargin: Math.max(0, f.usedMargin - marginRequired),
                availableBalance: f.availableBalance + marginRequired + realizedPnL,
              }));
              toast.success(`Squared off! P&L: ${realizedPnL >= 0 ? '+' : ''}${formatINR(realizedPnL)}`);
              return prev.filter(p => p.id !== posId);
            }
            return prev.map(p => p.id === posId ? {
              ...p, qty: Math.abs(netQty),
              pnl: (ltp - p.avgPrice) * Math.abs(netQty) * (p.side === 'BUY' ? 1 : -1),
              pnlPercent: ((ltp - p.avgPrice) / p.avgPrice) * 100 * (p.side === 'BUY' ? 1 : -1),
            } : p);
          }
          return [...prev, {
            id: posId, symbol: orderData.symbol, segment: orderData.segment,
            side: orderData.side, qty: orderData.qty, avgPrice: executedPrice,
            ltp, pnl: 0, pnlPercent: 0, productType: orderData.productType,
            expiry: orderData.expiry, strikePrice: orderData.strikePrice,
            optionType: orderData.optionType, lotSize: orderData.lotSize,
          }];
        });
      }
      setFunds(f => ({ ...f, usedMargin: f.usedMargin + marginRequired, availableBalance: f.availableBalance - marginRequired }));
      toast.success(`${orderData.side} ${orderData.symbol} @ ${formatINR(executedPrice)}`);
    } else {
      toast.info(`${orderData.orderType} order placed`);
    }
  }, [selectedStock, segment, selectedFuture, funds.availableBalance]);

  const handleSquareOff = (position: Position) => {
    const stocks = (position.segment === 'FUT' || position.segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    const stock = stocks.find(s => s.symbol === position.symbol);
    if (stock) { setSelectedStock(stock); setDrawerSide(position.side === 'BUY' ? 'SELL' : 'BUY'); setDrawerOpen(true); }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    toast.info("Order cancelled");
  };

  const handleReset = () => {
    setOrders([]); setPositions([]); setHoldings([]); setFunds(INITIAL_FUNDS);
    toast.success("Reset! ₹10,00,000 fresh start");
  };

  const openOrdersCount = orders.filter(o => o.status === 'OPEN').length;
  const changePercent = selectedStock ? getChangePercent(selectedStock) : 0;
  const changeAmt = selectedStock ? getChangeAmount(selectedStock) : 0;

  const orderDrawerProps = {
    open: drawerOpen, onOpenChange: setDrawerOpen, stock: selectedStock,
    availableBalance: funds.availableBalance, onPlaceOrder: handlePlaceOrder,
    segment: segment as Segment, defaultSide: drawerSide,
    selectedExpiry: segment === 'FUT' ? selectedFuture?.expiry : segment === 'OPT' ? 'Feb 27, 2025' : undefined,
    selectedStrike: segment === 'OPT' ? selectedStrike : undefined,
    selectedOptionType: segment === 'OPT' ? selectedOptionType : undefined,
    futurePrice: segment === 'FUT' ? selectedFuture?.ltp : undefined,
  };

  // ──────────────────────────────
  // MOBILE LAYOUT
  // ──────────────────────────────
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <FundsBar funds={funds} onReset={handleReset} positionsCount={positions.length} ordersCount={openOrdersCount} />

        {/* Segment tabs */}
        <div className="px-3 py-1.5 border-b border-border sticky top-0 z-20 bg-background flex gap-0.5 overflow-x-auto">
          {SEGMENTS.map(seg => (
            <button key={seg.key} onClick={() => setSegment(seg.key)}
              className={cn("px-3 py-1.5 rounded text-[11px] font-medium transition-colors shrink-0",
                segment === seg.key ? "bg-foreground text-background" : "text-muted-foreground"
              )}
            ><seg.icon className="h-3 w-3 inline mr-1" />{seg.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-3">
            <StockSearchDropdown selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />

            {/* Stock + Buy/Sell */}
            {selectedStock && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-sm">{selectedStock.symbol}</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-mono text-base font-bold">₹{selectedStock.livePrice.toFixed(2)}</span>
                    <span className={cn("text-[11px] font-mono font-semibold", changePercent >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openBuy()} className="px-4 py-2 rounded bg-[hsl(var(--status-live))] text-white font-bold text-xs active:scale-95 transition-transform">B</button>
                  <button onClick={() => openSell()} className="px-4 py-2 rounded bg-[hsl(var(--status-closed))] text-white font-bold text-xs active:scale-95 transition-transform">S</button>
                </div>
              </div>
            )}

            {/* Chart */}
            {selectedStock && (segment === 'EQ' || segment === 'CNC') && (
              <div className="border border-border rounded overflow-hidden"><StockPriceChart stock={selectedStock} /></div>
            )}
            {selectedStock && segment === 'FUT' && (
              <FuturesPanel contracts={futureContracts} onSelectContract={c => setSelectedFuture(c)} selectedExpiry={selectedFuture?.expiry} />
            )}
            {selectedStock && segment === 'OPT' && (
              <div className="border border-border rounded overflow-hidden">
                <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice}
                  onSelectOption={(s, t) => { setSelectedStrike(s); setSelectedOptionType(t); }}
                  selectedStrike={selectedStrike} selectedType={selectedOptionType} />
              </div>
            )}
          </div>

          {/* Bottom tabs */}
          <div className="border-t border-border mt-3">
            <div className="flex border-b border-border/50">
              {([
                { key: 'positions' as BottomTab, label: 'Positions', count: positions.length },
                { key: 'orders' as BottomTab, label: 'Orders', count: openOrdersCount },
                { key: 'holdings' as BottomTab, label: 'Holdings', count: holdings.length },
              ]).map(tab => (
                <button key={tab.key} onClick={() => setBottomTab(tab.key)}
                  className={cn("flex-1 py-2.5 text-[11px] font-medium relative transition-colors",
                    bottomTab === tab.key ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {tab.label} {tab.count > 0 && <span className="text-[9px] font-mono ml-0.5 opacity-60">({tab.count})</span>}
                  {bottomTab === tab.key && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary" />}
                </button>
              ))}
            </div>
            <div className="p-3">
              {bottomTab === 'positions' && <PositionsTable positions={positions} onSquareOff={handleSquareOff} />}
              {bottomTab === 'orders' && <OrderBook orders={orders} onCancelOrder={handleCancelOrder} />}
              {bottomTab === 'holdings' && <HoldingsTable holdings={holdings} />}
            </div>
          </div>
        </div>
        <OrderDrawer {...orderDrawerProps} />
      </div>
    );
  }

  // ──────────────────────────────
  // DESKTOP: 3-COLUMN KITE LAYOUT
  // Watchlist 20% | Chart 55% | Order 25%
  // ──────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Funds + Segment bar */}
      <div className="flex items-center justify-between border-b border-border px-2">
        <FundsBar funds={funds} onReset={handleReset} positionsCount={positions.length} ordersCount={openOrdersCount} />
      </div>

      {/* Segment tabs */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border">
        <div className="flex gap-0.5">
          {SEGMENTS.map(seg => (
            <button key={seg.key} onClick={() => setSegment(seg.key)}
              className={cn("flex items-center gap-1 px-3 py-1.5 rounded text-[11px] font-medium transition-colors",
                segment === seg.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            ><seg.icon className="h-3 w-3" />{seg.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Keyboard className="h-3 w-3" /> B=Buy S=Sell D=Depth Esc=Close</span>
          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-live))] animate-pulse" />Paper Trading</div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>

        {/* ═══ LEFT: WATCHLIST (20%) ═══ */}
        <div className="w-[20%] min-w-[240px] max-w-[320px] shrink-0 border-r border-border overflow-hidden flex flex-col">
          <WatchlistPanel
            selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment}
            onBuy={openBuy} onSell={openSell}
          />
        </div>

        {/* ═══ CENTER: CHART + INFO (55%) ═══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedStock && (
            <>
              {/* Symbol info bar */}
              <div className="px-4 py-2 border-b border-border flex items-center gap-4 bg-card/30 shrink-0">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-sm">{selectedStock.symbol}</span>
                      <span className="text-[10px] text-muted-foreground">{selectedStock.exchange}</span>
                      {(segment === 'FUT' || segment === 'OPT') && <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">F&O</Badge>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{selectedStock.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2 ml-2">
                    <span className="font-mono text-xl font-bold">{selectedStock.livePrice.toFixed(2)}</span>
                    <span className={cn("text-xs font-mono font-bold", changePercent >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {/* OHLCV */}
                <div className="hidden lg:flex items-center gap-3 ml-auto text-[10px] text-muted-foreground">
                  {[
                    { l: 'O', v: selectedStock.previousClose.toFixed(2) },
                    { l: 'H', v: selectedStock.dayHigh.toFixed(2) },
                    { l: 'L', v: selectedStock.dayLow.toFixed(2) },
                    { l: 'V', v: `${(selectedStock.volume / 100000).toFixed(1)}L` },
                    { l: '52H', v: String(selectedStock.weekHigh52) },
                    { l: '52L', v: String(selectedStock.weekLow52) },
                  ].map(s => (
                    <span key={s.l}>{s.l}: <span className="font-mono text-foreground">{s.v}</span></span>
                  ))}
                </div>
              </div>

              {/* Chart area */}
              <div className="flex-1 overflow-y-auto">
                {(segment === 'EQ' || segment === 'CNC') && (
                  <div className="h-full min-h-[300px]">
                    <StockPriceChart stock={selectedStock} />
                  </div>
                )}
                {segment === 'FUT' && (
                  <div className="p-4">
                    <FuturesPanel contracts={futureContracts} onSelectContract={c => setSelectedFuture(c)} selectedExpiry={selectedFuture?.expiry} />
                  </div>
                )}
                {segment === 'OPT' && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold font-display">Options Chain · Spot ₹{selectedStock.livePrice.toFixed(2)}</span>
                      {selectedStrike && selectedOptionType && <Badge variant="outline" className="text-[10px]">{selectedStrike} {selectedOptionType}</Badge>}
                    </div>
                    <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice}
                      onSelectOption={(s, t) => { setSelectedStrike(s); setSelectedOptionType(t); }}
                      selectedStrike={selectedStrike} selectedType={selectedOptionType} />
                  </div>
                )}
              </div>

              {/* Bottom panel */}
              <div className="border-t border-border bg-card/30 shrink-0">
                <div className="flex items-center border-b border-border/50">
                  {([
                    { key: 'positions' as BottomTab, label: 'Positions', icon: LayoutGrid, count: positions.length },
                    { key: 'orders' as BottomTab, label: 'Orders', icon: BookOpen, count: openOrdersCount },
                    { key: 'holdings' as BottomTab, label: 'Holdings', icon: Package, count: holdings.length },
                  ]).map(tab => (
                    <button key={tab.key} onClick={() => setBottomTab(tab.key)}
                      className={cn("flex items-center gap-1 px-4 py-2 text-[11px] font-medium relative transition-colors",
                        bottomTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <tab.icon className="h-3 w-3" />
                      {tab.label}
                      {tab.count > 0 && <span className="text-[9px] font-mono ml-0.5 bg-muted px-1 rounded">{tab.count}</span>}
                      {bottomTab === tab.key && <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary" />}
                    </button>
                  ))}
                </div>
                <div className="p-3 max-h-[220px] overflow-y-auto">
                  {bottomTab === 'positions' && <PositionsTable positions={positions} onSquareOff={handleSquareOff} />}
                  {bottomTab === 'orders' && <OrderBook orders={orders} onCancelOrder={handleCancelOrder} />}
                  {bottomTab === 'holdings' && <HoldingsTable holdings={holdings} />}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ═══ RIGHT: ORDER + DEPTH (25%) ═══ */}
        <div className="w-[25%] min-w-[280px] max-w-[350px] shrink-0 border-l border-border flex flex-col overflow-hidden">
          {/* Order Panel */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <OrderPanel
              stock={selectedStock} availableBalance={funds.availableBalance}
              onPlaceOrder={handlePlaceOrder} segment={segment}
              selectedExpiry={segment === 'FUT' ? selectedFuture?.expiry : segment === 'OPT' ? 'Feb 27, 2025' : undefined}
              selectedStrike={segment === 'OPT' ? selectedStrike : undefined}
              selectedOptionType={segment === 'OPT' ? selectedOptionType : undefined}
              futurePrice={segment === 'FUT' ? selectedFuture?.ltp : undefined}
            />
          </div>

          {/* Market Depth */}
          {selectedStock && (
            <div className="border-t border-border p-3 bg-card/30 shrink-0">
              <MarketDepth stock={selectedStock} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer fallback */}
      <OrderDrawer {...orderDrawerProps} />
    </div>
  );
}
