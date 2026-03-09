import { useState, useCallback, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { WatchlistPanel } from "@/components/trading/WatchlistPanel";
import { OrderDrawer } from "@/components/trading/OrderDrawer";
import { StockSearchDropdown } from "@/components/trading/StockSearchDropdown";
import { PositionsTable } from "@/components/trading/PositionsTable";
import { OrderBook } from "@/components/trading/OrderBook";
import { HoldingsTable } from "@/components/trading/HoldingsTable";
import { OptionsChain } from "@/components/trading/OptionsChain";
import { FuturesPanel } from "@/components/trading/FuturesPanel";
import { FundsBar } from "@/components/trading/FundsBar";
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
  LineChart, Layers
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

  const segmentStocks = useMemo(() =>
    (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks(),
  [segment]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(segmentStocks[0] ?? null);

  // Reset stock when segment changes if current stock isn't in new list
  useEffect(() => {
    const stocks = (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    if (!selectedStock || !stocks.find(s => s.symbol === selectedStock.symbol)) {
      setSelectedStock(stocks[0] ?? null);
    }
  }, [segment]);

  const [selectedStrike, setSelectedStrike] = useState<number | undefined>();
  const [selectedOptionType, setSelectedOptionType] = useState<'CE' | 'PE' | undefined>();
  const [selectedFuture, setSelectedFuture] = useState<FutureContract | undefined>();

  const optionsChain = selectedStock ? generateOptionsChain(selectedStock.livePrice, selectedStock.symbol) : [];
  const futureContracts = selectedStock ? generateFutureContracts(selectedStock.symbol, selectedStock.livePrice) : [];

  useEffect(() => {
    if (segment === 'FUT' && futureContracts.length > 0 && !selectedFuture) {
      setSelectedFuture(futureContracts[0]);
    }
  }, [selectedStock, segment, futureContracts.length]);

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

  const openBuy = () => { setDrawerSide('BUY'); setDrawerOpen(true); };
  const openSell = () => { setDrawerSide('SELL'); setDrawerOpen(true); };

  // ── Order placement ──
  const handlePlaceOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    if (!selectedStock) return;
    const ltp = segment === 'FUT' && selectedFuture ? selectedFuture.ltp : selectedStock.livePrice;
    const executedPrice = orderData.orderType === 'MARKET' ? ltp : orderData.price;
    const totalValue = orderData.qty * executedPrice;
    const marginRequired = segment === 'EQ' || segment === 'CNC' ? totalValue : totalValue * 0.12;

    if (marginRequired > funds.availableBalance) {
      toast.error("Insufficient margin"); return;
    }

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

      setFunds(f => ({
        ...f, usedMargin: f.usedMargin + marginRequired,
        availableBalance: f.availableBalance - marginRequired,
      }));
      toast.success(`${orderData.side} ${orderData.symbol} @ ${formatINR(executedPrice)}`);
    } else {
      toast.info(`${orderData.orderType} order placed`);
    }
  }, [selectedStock, segment, selectedFuture, funds.availableBalance]);

  const handleSquareOff = (position: Position) => {
    const stocks = (position.segment === 'FUT' || position.segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    const stock = stocks.find(s => s.symbol === position.symbol);
    if (stock) {
      setSelectedStock(stock);
      setDrawerSide(position.side === 'BUY' ? 'SELL' : 'BUY');
      setDrawerOpen(true);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    toast.info("Order cancelled");
  };

  const handleReset = () => {
    setOrders([]); setPositions([]); setHoldings([]); setFunds(INITIAL_FUNDS);
    toast.success("Reset! Starting fresh with ₹10,00,000");
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
  // SEGMENT TABS
  // ──────────────────────────────
  const segmentTabs = (
    <div className="flex items-center gap-0.5">
      {SEGMENTS.map(seg => {
        const isActive = segment === seg.key;
        return (
          <button key={seg.key} onClick={() => setSegment(seg.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              isActive
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <seg.icon className="h-3 w-3" />
            {seg.label}
          </button>
        );
      })}
    </div>
  );

  // ──────────────────────────────
  // BOTTOM TABS (positions/orders/holdings)
  // ──────────────────────────────
  const bottomSection = (
    <div className="border-t border-border bg-card/50">
      <div className="flex items-center border-b border-border/50">
        {([
          { key: 'positions' as BottomTab, label: 'Positions', icon: LayoutGrid, count: positions.length },
          { key: 'orders' as BottomTab, label: 'Orders', icon: BookOpen, count: openOrdersCount },
          { key: 'holdings' as BottomTab, label: 'Holdings', icon: Package, count: holdings.length },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setBottomTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all relative",
              bottomTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-muted text-muted-foreground rounded text-[9px] px-1 py-px font-mono">{tab.count}</span>
            )}
            {bottomTab === tab.key && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full" />}
          </button>
        ))}
      </div>
      <div className="p-3 max-h-[280px] overflow-y-auto">
        {bottomTab === 'positions' && <PositionsTable positions={positions} onSquareOff={handleSquareOff} />}
        {bottomTab === 'orders' && <OrderBook orders={orders} onCancelOrder={handleCancelOrder} />}
        {bottomTab === 'holdings' && <HoldingsTable holdings={holdings} />}
      </div>
    </div>
  );

  // ══════════════════════════════
  // MOBILE
  // ══════════════════════════════
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <FundsBar funds={funds} onReset={handleReset} positionsCount={positions.length} ordersCount={openOrdersCount} />

        {/* Segment tabs */}
        <div className="px-3 py-2 border-b border-border sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
          <div className="overflow-x-auto">{segmentTabs}</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-3">
            <StockSearchDropdown selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />

            {/* Stock ticker + Buy/Sell */}
            {selectedStock && (
              <div className="flex items-center justify-between gap-3 px-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-base">{selectedStock.symbol}</span>
                    {(segment === 'FUT' || segment === 'OPT') && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0">F&O</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-mono text-lg font-bold">₹{selectedStock.livePrice.toFixed(2)}</span>
                    <span className={cn("text-xs font-mono font-semibold", changePercent >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={openBuy}
                    className="px-4 py-2 rounded-lg bg-[hsl(var(--status-live))] text-white font-bold text-xs active:scale-95 transition-transform"
                  >B</button>
                  <button onClick={openSell}
                    className="px-4 py-2 rounded-lg bg-[hsl(var(--status-closed))] text-white font-bold text-xs active:scale-95 transition-transform"
                  >S</button>
                </div>
              </div>
            )}

            {/* Chart */}
            {selectedStock && (segment === 'EQ' || segment === 'CNC') && (
              <div className="rounded-lg border border-border overflow-hidden">
                <StockPriceChart stock={selectedStock} />
              </div>
            )}

            {/* Futures */}
            {selectedStock && segment === 'FUT' && (
              <FuturesPanel contracts={futureContracts} onSelectContract={(c) => setSelectedFuture(c)} selectedExpiry={selectedFuture?.expiry} />
            )}

            {/* Options */}
            {selectedStock && segment === 'OPT' && (
              <div className="rounded-lg border border-border overflow-hidden">
                <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice}
                  onSelectOption={(s, t) => { setSelectedStrike(s); setSelectedOptionType(t); }}
                  selectedStrike={selectedStrike} selectedType={selectedOptionType} />
              </div>
            )}
          </div>

          {/* Bottom tabs */}
          {bottomSection}
        </div>

        <OrderDrawer {...orderDrawerProps} />
      </div>
    );
  }

  // ══════════════════════════════
  // DESKTOP — Kite-style: watchlist | chart + data
  // ══════════════════════════════
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Dashboard cards row */}
      <FundsBar funds={funds} onReset={handleReset} positionsCount={positions.length} ordersCount={openOrdersCount} />

      {/* Segment bar */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        {segmentTabs}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-live))] animate-pulse" />
          Paper Trading
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Watchlist */}
        <div className="w-52 shrink-0 border-r border-border overflow-hidden flex flex-col bg-card/30">
          <WatchlistPanel selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />
        </div>

        {/* Center: stock info + chart + data */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedStock && (
            <>
              {/* Stock header bar — compact like Kite */}
              <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-card/40">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-base font-bold">{selectedStock.symbol}</h2>
                      <span className="text-[11px] text-muted-foreground">{selectedStock.name}</span>
                      {(segment === 'FUT' || segment === 'OPT') && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0">F&O</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold">₹{selectedStock.livePrice.toFixed(2)}</span>
                    <span className={cn(
                      "text-sm font-mono font-bold",
                      changePercent >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]"
                    )}>
                      {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  {/* Mini stats */}
                  <div className="hidden lg:flex gap-3 text-[10px] text-muted-foreground ml-4">
                    <span>H: <span className="font-mono text-foreground">{selectedStock.dayHigh.toFixed(2)}</span></span>
                    <span>L: <span className="font-mono text-foreground">{selectedStock.dayLow.toFixed(2)}</span></span>
                    <span>Vol: <span className="font-mono text-foreground">{(selectedStock.volume / 100000).toFixed(1)}L</span></span>
                  </div>
                </div>
                {/* Buy / Sell */}
                <div className="flex gap-2">
                  <button onClick={openBuy}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[hsl(var(--status-live))] text-white font-bold text-xs hover:opacity-90 active:scale-[0.97] transition-all"
                  >
                    <TrendingUp className="h-3.5 w-3.5" /> BUY
                  </button>
                  <button onClick={openSell}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[hsl(var(--status-closed))] text-white font-bold text-xs hover:opacity-90 active:scale-[0.97] transition-all"
                  >
                    <TrendingDown className="h-3.5 w-3.5" /> SELL
                  </button>
                </div>
              </div>

              {/* Chart / Content area */}
              <div className="flex-1 overflow-y-auto">
                {/* Chart for EQ/CNC */}
                {(segment === 'EQ' || segment === 'CNC') && (
                  <div className="border-b border-border">
                    <StockPriceChart stock={selectedStock} />
                  </div>
                )}

                {/* Futures */}
                {segment === 'FUT' && (
                  <div className="p-4">
                    <FuturesPanel contracts={futureContracts} onSelectContract={(c) => setSelectedFuture(c)} selectedExpiry={selectedFuture?.expiry} />
                  </div>
                )}

                {/* Options */}
                {segment === 'OPT' && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold font-display">Options Chain</span>
                      <span className="text-xs text-muted-foreground">Spot: ₹{selectedStock.livePrice.toFixed(2)}</span>
                      {selectedStrike && selectedOptionType && (
                        <Badge variant="outline" className="ml-auto text-xs">{selectedStrike} {selectedOptionType}</Badge>
                      )}
                    </div>
                    <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice}
                      onSelectOption={(s, t) => { setSelectedStrike(s); setSelectedOptionType(t); }}
                      selectedStrike={selectedStrike} selectedType={selectedOptionType} />
                  </div>
                )}
              </div>

              {/* Bottom: Positions / Orders / Holdings */}
              {bottomSection}
            </>
          )}
        </div>
      </div>

      <OrderDrawer {...orderDrawerProps} />
    </div>
  );
}
