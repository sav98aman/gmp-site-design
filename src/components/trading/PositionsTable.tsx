import { cn } from "@/lib/utils";
import { type Position, formatINR } from "@/data/paperTradingData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, XCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsTableProps {
  positions: Position[];
  onSquareOff: (position: Position) => void;
}

export function PositionsTable({ positions, onSquareOff }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
          <BarChart3 className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No open positions</p>
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-[220px]">Place a trade to see your active positions here</p>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
        <span className="text-xs text-muted-foreground font-medium">{positions.length} open position{positions.length > 1 ? 's' : ''}</span>
        <div className={cn("text-sm font-bold font-mono flex items-center gap-1", totalPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
          {totalPnL >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)}
        </div>
      </div>

      {/* Position cards */}
      <div className="space-y-2">
        {positions.map(pos => {
          const isProfit = pos.pnl >= 0;
          return (
            <div key={pos.id} className={cn(
              "rounded-xl border p-3 transition-all hover:shadow-md",
              isProfit
                ? "border-[hsl(var(--status-live)/0.15)] bg-[hsl(var(--status-live)/0.03)]"
                : "border-[hsl(var(--status-closed)/0.15)] bg-[hsl(var(--status-closed)/0.03)]"
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{pos.symbol}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">{pos.segment}</Badge>
                    <Badge className={cn(
                      "text-[9px] px-1.5 py-0 border-0",
                      pos.side === 'BUY'
                        ? "bg-[hsl(var(--status-live)/0.15)] text-[hsl(var(--status-live))]"
                        : "bg-[hsl(var(--status-closed)/0.15)] text-[hsl(var(--status-closed))]"
                    )}>{pos.side}</Badge>
                    {pos.strikePrice && pos.optionType && (
                      <span className="text-[10px] text-muted-foreground">{pos.strikePrice} {pos.optionType}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span>Qty: <span className="font-mono font-semibold text-foreground">{pos.qty}</span></span>
                    <span>Avg: <span className="font-mono font-semibold text-foreground">{pos.avgPrice.toFixed(2)}</span></span>
                    <span>LTP: <span className="font-mono font-semibold text-foreground">{pos.ltp.toFixed(2)}</span></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-sm font-bold font-mono flex items-center gap-1 justify-end", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isProfit ? "+" : ""}{formatINR(pos.pnl)}
                  </div>
                  <div className={cn("text-[10px] font-mono", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-border/30 flex justify-end">
                <Button variant="outline" size="sm" className="h-7 px-3 text-[11px] gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={() => onSquareOff(pos)}>
                  <XCircle className="h-3 w-3" /> Exit Position
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
