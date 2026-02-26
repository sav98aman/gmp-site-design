import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getChangePercent, getEquityStocks, getFnOStocks, type Stock } from "@/data/mockStockData";
import { Search, TrendingUp, TrendingDown, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StockSearchDropdownProps {
  selectedStock: Stock | null;
  onSelectStock: (stock: Stock) => void;
  segment: 'EQ' | 'FUT' | 'OPT' | 'CNC';
}

export function StockSearchDropdown({ selectedStock, onSelectStock, segment }: StockSearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const isFnO = segment === 'FUT' || segment === 'OPT';
  const stocks = isFnO ? getFnOStocks() : getEquityStocks();
  const filtered = stocks.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const change = selectedStock ? getChangePercent(selectedStock) : 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
      >
        {selectedStock ? (
          <>
            <span className="font-bold text-sm">{selectedStock.symbol}</span>
            <span className="text-xs text-muted-foreground truncate hidden sm:inline">{selectedStock.name}</span>
            <span className="font-mono text-sm font-bold ml-auto">{selectedStock.livePrice.toFixed(2)}</span>
            <span className={cn("text-xs font-mono", change >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {change >= 0 ? "+" : ""}{change.toFixed(2)}%
            </span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
          </>
        ) : (
          <>
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Select a stock...</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-card shadow-xl max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stocks..."
                className="pl-8 h-8 text-xs"
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.map(stock => {
              const ch = getChangePercent(stock);
              const isPos = ch >= 0;
              const isSelected = selectedStock?.symbol === stock.symbol;
              return (
                <button
                  key={stock.symbol}
                  onClick={() => { onSelectStock(stock); setOpen(false); setSearch(''); }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left",
                    isSelected && "bg-primary/10"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{stock.symbol}</span>
                      {isFnO && <span className="text-[9px] text-primary bg-primary/10 px-1 rounded font-medium">F&O</span>}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">{stock.name}</div>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <div className="text-xs font-mono font-semibold">{stock.livePrice.toFixed(2)}</div>
                    <div className={cn("text-[10px] font-mono flex items-center gap-0.5 justify-end", isPos ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {isPos ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {isPos ? "+" : ""}{ch.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">No stocks found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
