import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockStocks, getChangePercent, type Stock } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface StockSearchBarProps {
  onSelectStock: (stock: Stock) => void;
  selectedSymbol?: string;
}

export function StockSearchBar({ onSelectStock, selectedSymbol }: StockSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? mockStocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (stock: Stock) => {
    onSelectStock(stock);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks by name or symbol..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 bg-card border-border"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filtered.map((stock) => {
            const change = getChangePercent(stock);
            const isPositive = change >= 0;
            return (
              <button
                key={stock.symbol}
                onClick={() => handleSelect(stock)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                  selectedSymbol === stock.symbol && "bg-primary/5"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm">{stock.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{stock.exchange}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="font-mono text-sm font-semibold">₹{stock.livePrice.toLocaleString()}</p>
                  <p className={cn("text-xs font-mono", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isPositive ? "+" : ""}{change}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query.length > 0 && filtered.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No stocks found for "{query}"
        </div>
      )}
    </div>
  );
}
