import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { mockStocks, getChangePercent, getChangeAmount, getEquityStocks, getFnOStocks, type Stock } from "@/data/mockStockData";
import { Search, TrendingUp, TrendingDown, X, Plus, GripVertical, BarChart2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WatchlistPanelProps {
  selectedStock: Stock | null;
  onSelectStock: (stock: Stock) => void;
  segment: 'EQ' | 'FUT' | 'OPT' | 'CNC';
  onBuy?: (stock: Stock) => void;
  onSell?: (stock: Stock) => void;
}

export function WatchlistPanel({ selectedStock, onSelectStock, segment, onBuy, onSell }: WatchlistPanelProps) {
  const [search, setSearch] = useState('');
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const isFnO = segment === 'FUT' || segment === 'OPT';
  const baseStocks = isFnO ? getFnOStocks() : getEquityStocks();
  const filtered = search
    ? baseStocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : baseStocks;

  const gainers = filtered.filter(s => getChangePercent(s) >= 0).length;
  const losers = filtered.length - gainers;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Watchlist tabs */}
      <div className="flex items-center border-b border-border">
        {[1, 2, 3].map(i => (
          <button key={i} onClick={() => setActiveTab(i - 1)}
            className={cn(
              "flex-1 py-2 text-[11px] font-semibold transition-colors relative",
              activeTab === i - 1 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {i}
            {activeTab === i - 1 && <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary" />}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search eg: infy, bse, nifty fut"
            className="pl-7 h-7 text-[11px] rounded bg-muted/50 border-0 focus-visible:ring-1"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Stock count */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/50">
        <span>{filtered.length} stocks</span>
        <div className="flex gap-2">
          <span className="text-[hsl(var(--status-live))]">{gainers}↑</span>
          <span className="text-[hsl(var(--status-closed))]">{losers}↓</span>
        </div>
      </div>

      {/* Stocks List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(stock => {
          const change = getChangePercent(stock);
          const changeAmt = getChangeAmount(stock);
          const isPositive = change >= 0;
          const isSelected = selectedStock?.symbol === stock.symbol;
          const isHovered = hoveredSymbol === stock.symbol;

          return (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              onMouseEnter={() => setHoveredSymbol(stock.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
              className={cn(
                "relative flex items-center justify-between px-3 py-2 cursor-pointer transition-colors border-b border-border/20",
                isSelected ? "bg-primary/5" : "hover:bg-muted/50"
              )}
            >
              {/* Left: symbol */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  {isSelected && <div className="w-[2px] h-4 bg-primary rounded-full -ml-1 mr-1" />}
                  <span className={cn("text-xs font-semibold", isSelected && "text-primary")}>{stock.symbol}</span>
                  {isFnO && <span className="text-[8px] text-primary/70 bg-primary/8 px-0.5 rounded">F&O</span>}
                </div>
              </div>

              {/* Right: price or hover actions */}
              {isHovered ? (
                <div className="flex items-center gap-1 animate-in fade-in-0 duration-150">
                  <button
                    onClick={e => { e.stopPropagation(); onBuy?.(stock); }}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-[hsl(var(--status-live))] text-white hover:opacity-90 transition-opacity"
                  >B</button>
                  <button
                    onClick={e => { e.stopPropagation(); onSell?.(stock); }}
                    className="px-2 py-1 rounded text-[10px] font-bold bg-[hsl(var(--status-closed))] text-white hover:opacity-90 transition-opacity"
                  >S</button>
                  <button
                    onClick={e => { e.stopPropagation(); onSelectStock(stock); }}
                    className="px-1.5 py-1 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  ><BarChart2 className="h-3 w-3" /></button>
                </div>
              ) : (
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-semibold">{stock.livePrice.toFixed(2)}</div>
                  <div className={cn(
                    "text-[10px] font-mono",
                    isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]"
                  )}>
                    {isPositive ? "+" : ""}{changeAmt.toFixed(2)} ({isPositive ? "+" : ""}{change.toFixed(2)}%)
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">No stocks found</div>
        )}
      </div>
    </div>
  );
}
