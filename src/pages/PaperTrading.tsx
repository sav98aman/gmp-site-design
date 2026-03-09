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
import { TrendingUp, TrendingDown, Activity, LayoutGrid, BookOpen, Package, LineChart, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type BottomTab = 'positions' | 'orders' | 'holdings';
type MainTab = 'EQ' | 'FUT' | 'OPT' | 'CNC';

const SEGMENT_CONFIG: Record<MainTab, { label: string; icon: typeof Activity; desc: string }> = {
  EQ: { label: 'Intraday', icon: Activity, desc: 'Buy & sell same day' },
  FUT: { label: 'Futures', icon: LineChart, desc: 'F&O contracts' },
  OPT: { label: 'Options', icon: Layers, desc: 'CE & PE trading' },
  CNC: { label: 'Delivery', icon: Package, desc: 'Long-term holdings' },
};

export default function PaperTrading() {
  const isMobile = useIsMobile();
  const [segment, setSegment] = useState<MainTab>('EQ');
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [funds, setFunds] = useState<FundsData>(INITIAL_FUNDS);
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions');
  const [bottomExpanded, setBottomExpanded] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<OrderSide>('BUY');

  const segmentStocks = useMemo(() => {
    return (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
  }, [segment]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(segmentStocks[0] ?? null);

  useEffect(() => {
    const stocks = (segment === 'FUT' || segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    const current = selectedStock;
    if (!current || !stocks.find(s => s.symbol === current.symbol)) {
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

  const handleSelectOption = (strike: number, type: 'CE' | 'PE', _ltp: number) => {
    setSelectedStrike(strike);
    setSelectedOptionType(type);
  };

  const handleSelectFuture = (contract: FutureContract) => {
    setSelectedFuture(contract);
  };

  const openBuy = () => { setDrawerSide('BUY'); setDrawerOpen(true); };
  const openSell = () => { setDrawerSide('SELL'); setDrawerOpen(true); };

  // ── Order Execution Logic ──
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
      ...orderData, id: orderId, timestamp: new Date(),
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
              toast.success(`Position squared off! P&L: ${realizedPnL >= 0 ? '+' : ''}${formatINR(realizedPnL)}`);
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
      toast.success(`${orderData.side} order executed — ${orderData.symbol} @ ${formatINR(executedPrice)}`);
    } else {
      toast.info(`${orderData.orderType} order placed for ${orderData.symbol}`);
    }
  }, [selectedStock, segment, selectedFuture, funds.availableBalance]);

  const handleSquareOff = (position: Position) => {
    const stocks = (position.segment === 'FUT' || position.segment === 'OPT') ? getFnOStocks() : getEquityStocks();
    const stock = stocks.find(s => s.symbol === position.symbol);
    if (stock) {
      setSelectedStock(stock);
      setDrawerSide(position.side === 'BUY' ? 'SELL' : 'BUY');
      setDrawerOpen(true);
    } else {
      const ltp = position.ltp;
      const pnl = (ltp - position.avgPrice) * position.qty * (position.side === 'BUY' ? 1 : -1);
      const marginReleased = position.qty * position.avgPrice * (position.segment === 'EQ' ? 1 : 0.12);
      setPositions(prev => prev.filter(p => p.id !== position.id));
      setFunds(f => ({
        ...f, realizedPnL: f.realizedPnL + pnl,
        usedMargin: Math.max(0, f.usedMargin - marginReleased),
        availableBalance: f.availableBalance + marginReleased + pnl,
      }));
      toast.success(`Squared off ${position.symbol}! P&L: ${pnl >= 0 ? '+' : ''}${formatINR(pnl)}`);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    toast.info("Order cancelled");
  };

  const handleReset = () => {
    setOrders([]); setPositions([]); setHoldings([]); setFunds(INITIAL_FUNDS);
    toast.success("Paper trading reset! Starting fresh with ₹10,00,000");
  };

  const openOrdersCount = orders.filter(o => o.status === 'OPEN').length;

  const orderDrawerProps = {
    open: drawerOpen, onOpenChange: setDrawerOpen, stock: selectedStock,
    availableBalance: funds.availableBalance, onPlaceOrder: handlePlaceOrder,
    segment: segment as Segment, defaultSide: drawerSide,
    selectedExpiry: segment === 'FUT' ? selectedFuture?.expiry : segment === 'OPT' ? 'Feb 27, 2025' : undefined,
    selectedStrike: segment === 'OPT' ? selectedStrike : undefined,
    selectedOptionType: segment === 'OPT' ? selectedOptionType : undefined,
    futurePrice: segment === 'FUT' ? selectedFuture?.ltp : undefined,
  };

  const changePercent = selectedStock ? getChangePercent(selectedStock) : 0;
  const changeAmt = selectedStock ? getChangeAmount(selectedStock) : 0;

  const totalItemsCount = positions.length + openOrdersCount + holdings.length;

  // ── Segment Tabs ──
  const segmentTabs = (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 backdrop-blur-sm">
      {(Object.keys(SEGMENT_CONFIG) as MainTab[]).map(seg => {
        const cfg = SEGMENT_CONFIG[seg];
        const Icon = cfg.icon;
        const isActive = segment === seg;
        return (
          <button key={seg} onClick={() => setSegment(seg)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {cfg.label}
          </button>
        );
      })}
    </div>
  );

  // ── Stock Header Card ──
  const stockHeaderCard = selectedStock && (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="font-display text-lg font-bold tracking-tight">{selectedStock.symbol}</h2>
            <span className="text-xs text-muted-foreground truncate">{selectedStock.name}</span>
            {(segment === 'FUT' || segment === 'OPT') && (
              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-semibold">F&O</Badge>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl font-bold tracking-tight">₹{selectedStock.livePrice.toFixed(2)}</span>
            <span className={cn(
              "flex items-center gap-1 text-sm font-bold px-2.5 py-0.5 rounded-lg",
              changePercent >= 0
                ? "text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)]"
                : "text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)]"
            )}>
              {changePercent >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        {/* Buy/Sell Buttons */}
        <div className="flex gap-2">
          <button onClick={openBuy}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[hsl(var(--status-live))] text-white font-bold text-sm shadow-lg shadow-[hsl(var(--status-live)/0.25)] hover:shadow-[hsl(var(--status-live)/0.4)] hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <TrendingUp className="h-4 w-4" /> BUY
          </button>
          <button onClick={openSell}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[hsl(var(--status-closed))] text-white font-bold text-sm shadow-lg shadow-[hsl(var(--status-closed)/0.25)] hover:shadow-[hsl(var(--status-closed)/0.4)] hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <TrendingDown className="h-4 w-4" /> SELL
          </button>
        </div>
      </div>
      {/* Stats row */}
      <div className="flex gap-4 mt-3 text-[11px] border-t border-border/50 pt-3">
        {[
          { label: 'Open', value: selectedStock.dayHigh.toFixed(2) },
          { label: 'High', value: selectedStock.dayHigh.toFixed(2) },
          { label: 'Low', value: selectedStock.dayLow.toFixed(2) },
          { label: 'Vol', value: `${(selectedStock.volume / 100000).toFixed(1)}L` },
          ...(!isMobile ? [
            { label: '52W H', value: String(selectedStock.weekHigh52) },
            { label: '52W L', value: String(selectedStock.weekLow52) },
          ] : []),
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-1.5">
            <span className="text-muted-foreground">{stat.label}</span>
            <span className="font-mono font-semibold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Collapsible Bottom Panel ──
  const bottomPanel = (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
      {/* Tab bar with expand/collapse */}
      <div className="flex items-center border-b border-border bg-muted/20">
        <div className="flex items-center flex-1">
          {([
            { key: 'positions' as BottomTab, label: 'Positions', icon: LayoutGrid, count: positions.length },
            { key: 'orders' as BottomTab, label: 'Orders', icon: BookOpen, count: openOrdersCount },
            { key: 'holdings' as BottomTab, label: 'Holdings', icon: Package, count: holdings.length },
          ]).map(tab => (
            <button key={tab.key}
              onClick={() => {
                if (bottomTab === tab.key) {
                  setBottomExpanded(!bottomExpanded);
                } else {
                  setBottomTab(tab.key);
                  setBottomExpanded(true);
                }
              }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all relative",
                bottomTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold",
                  bottomTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
              {bottomTab === tab.key && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
        <button onClick={() => setBottomExpanded(!bottomExpanded)} className="p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
          {bottomExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>
      {/* Content */}
      {bottomExpanded && (
        <div className="p-4 max-h-[350px] overflow-y-auto">
          {bottomTab === 'positions' && <PositionsTable positions={positions} onSquareOff={handleSquareOff} />}
          {bottomTab === 'orders' && <OrderBook orders={orders} onCancelOrder={handleCancelOrder} />}
          {bottomTab === 'holdings' && <HoldingsTable holdings={holdings} />}
        </div>
      )}
    </div>
  );

  // ══════════════════════════════
  // MOBILE LAYOUT
  // ══════════════════════════════
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <FundsBar funds={funds} onReset={handleReset} />

        {/* Sticky segment tabs */}
        <div className="px-3 py-2 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-20">
          <div className="overflow-x-auto scrollbar-hide">
            {segmentTabs}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-3">
            {/* Search */}
            <StockSearchDropdown selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />

            {/* Stock card with inline buy/sell */}
            {selectedStock && (
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-sm font-display">{selectedStock.symbol}</span>
                      {(segment === 'FUT' || segment === 'OPT') && (
                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[9px]">F&O</Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{selectedStock.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg font-bold block">₹{selectedStock.livePrice.toFixed(2)}</span>
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md",
                      changePercent >= 0
                        ? "text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)]"
                        : "text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)]"
                    )}>
                      {changePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {changeAmt >= 0 ? "+" : ""}{changeAmt.toFixed(2)} ({changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {/* Buy/Sell buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={openBuy}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[hsl(var(--status-live))] text-white font-bold text-sm shadow-lg shadow-[hsl(var(--status-live)/0.3)] active:scale-[0.97] transition-all"
                  >
                    <TrendingUp className="h-4 w-4" /> BUY
                  </button>
                  <button onClick={openSell}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[hsl(var(--status-closed))] text-white font-bold text-sm shadow-lg shadow-[hsl(var(--status-closed)/0.3)] active:scale-[0.97] transition-all"
                  >
                    <TrendingDown className="h-4 w-4" /> SELL
                  </button>
                </div>
              </div>
            )}

            {/* Chart for EQ/CNC */}
            {selectedStock && (segment === 'EQ' || segment === 'CNC') && (
              <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                <StockPriceChart stock={selectedStock} />
              </div>
            )}

            {/* Futures */}
            {selectedStock && segment === 'FUT' && (
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                    <LineChart className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm font-display">Futures Contracts</span>
                </div>
                <FuturesPanel contracts={futureContracts} onSelectContract={handleSelectFuture} selectedExpiry={selectedFuture?.expiry} />
              </div>
            )}

            {/* Options */}
            {selectedStock && segment === 'OPT' && (
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm font-display">Options Chain</span>
                  {selectedStrike && selectedOptionType && (
                    <Badge variant="outline" className="ml-auto text-xs">{selectedStrike} {selectedOptionType}</Badge>
                  )}
                </div>
                <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice} onSelectOption={handleSelectOption} selectedStrike={selectedStrike} selectedType={selectedOptionType} />
              </div>
            )}

            {/* Bottom panel */}
            {bottomPanel}
          </div>
        </div>

        <OrderDrawer {...orderDrawerProps} />
      </div>
    );
  }

  // ══════════════════════════════
  // DESKTOP LAYOUT
  // ══════════════════════════════
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <FundsBar funds={funds} onReset={handleReset} />

      {/* Segment tabs bar */}
      <div className="px-4 py-2.5 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {segmentTabs}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-live))] animate-pulse" />
              <span className="font-medium">Paper Trading</span>
            </div>
            {totalItemsCount > 0 && (
              <Badge variant="outline" className="text-[10px] font-mono">{totalItemsCount} active</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        {/* Left: Watchlist */}
        <div className="w-60 shrink-0 border-r border-border bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col">
          <WatchlistPanel selectedStock={selectedStock} onSelectStock={handleSelectStock} segment={segment} />
        </div>

        {/* Center: Main content */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {selectedStock && (
            <div className="p-5 space-y-4 max-w-5xl mx-auto">
              {/* Stock header with buy/sell */}
              {stockHeaderCard}

              {/* Chart for EQ/CNC */}
              {(segment === 'EQ' || segment === 'CNC') && (
                <div className="rounded-2xl border border-border overflow-hidden bg-card/80 backdrop-blur-sm shadow-sm">
                  <StockPriceChart stock={selectedStock} />
                </div>
              )}

              {/* Futures */}
              {segment === 'FUT' && (
                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
                      <LineChart className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm font-display">Futures Contracts</span>
                      <p className="text-xs text-muted-foreground">Select a contract to trade</p>
                    </div>
                  </div>
                  <FuturesPanel contracts={futureContracts} onSelectContract={handleSelectFuture} selectedExpiry={selectedFuture?.expiry} />
                </div>
              )}

              {/* Options */}
              {segment === 'OPT' && (
                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Layers className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm font-display">Options Chain</span>
                      <p className="text-xs text-muted-foreground">Spot: ₹{selectedStock.livePrice.toFixed(2)}</p>
                    </div>
                    {selectedStrike && selectedOptionType && (
                      <Badge className="ml-auto bg-primary/15 text-primary border-primary/30 text-xs font-semibold">{selectedStrike} {selectedOptionType}</Badge>
                    )}
                  </div>
                  <OptionsChain data={optionsChain} spotPrice={selectedStock.livePrice} onSelectOption={handleSelectOption} selectedStrike={selectedStrike} selectedType={selectedOptionType} />
                </div>
              )}

              {/* Positions / Orders / Holdings */}
              {bottomPanel}
            </div>
          )}
        </div>
      </div>

      <OrderDrawer {...orderDrawerProps} />
    </div>
  );
}
