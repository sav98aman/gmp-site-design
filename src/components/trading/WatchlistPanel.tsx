import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockStocks, getChangePercent, getChangeAmount, getEquityStocks, getFnOStocks, type Stock } from "@/data/mockStockData";
import { Search, Star, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SegmentFilter = 'EQ' | 'FUT' | 'OPT' | 'CNC';

interface WatchlistPanelProps {
  selectedStock: Stock | null;
  onSelectStock: (stock: Stock) => void;
  segment: SegmentFilter;
}

export function WatchlistPanel({ selectedStock, onSelectStock, segment }: WatchlistPanelProps) {
  const [search, setSearch] = useState('');

  const isFnOSegment = segment === 'FUT' || segment === 'OPT';
  const baseStocks = isFnOSegment ? getFnOStocks() : getEquityStocks();

  const filtered = baseStocks.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          {isFnOSegment ? <Zap className="h-4 w-4 text-primary" /> : <Star className="h-4 w-4 text-primary" />}
          <span className="text-sm font-semibold">{isFnOSegment ? 'F&O Stocks' : 'Watchlist'}</span>
          <Badge variant="outline" className="ml-auto text-[10px] px-1.5">
            {filtered.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isFnOSegment ? "Search F&O stocks..." : "Search stocks..."}
            className="pl-8 h-7 text-xs"
          />
        </div>
      </div>

      {/* Stocks List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(stock => {
          const change = getChangePercent(stock);
          const isPositive = change >= 0;
          const isSelected = selectedStock?.symbol === stock.symbol;

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/50 text-left",
                isSelected && "bg-primary/10 border-l-2 border-l-primary"
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">{stock.symbol}</span>
                  {isFnOSegment && (
                    <span className="text-[9px] text-primary bg-primary/10 px-1 rounded font-medium">F&O</span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{stock.name}</div>
              </div>
              <div className="text-right ml-2 shrink-0">
                <div className="text-xs font-mono font-semibold">{stock.livePrice.toFixed(2)}</div>
                <div className={cn("text-[10px] font-mono flex items-center gap-0.5 justify-end", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {isPositive ? "+" : ""}{change.toFixed(2)}%
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
  );
}
