import { cn } from "@/lib/utils";
import { type Position, formatINR } from "@/data/paperTradingData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsTableProps {
  positions: Position[];
  onSquareOff: (position: Position) => void;
}

export function PositionsTable({ positions, onSquareOff }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No open positions</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Place orders to see positions here</p>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-3 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="text-xs text-muted-foreground">Total P&L</div>
        <div className={cn("text-sm font-bold font-mono", totalPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
          {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)}
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{positions.length} positions</div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              {['Symbol', 'Seg', 'Qty', 'Avg Price', 'LTP', 'P&L', 'P&L%', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {positions.map(pos => {
              const isProfit = pos.pnl >= 0;
              return (
                <tr key={pos.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-bold">
                    <div>{pos.symbol}</div>
                    {pos.strikePrice && pos.optionType && (
                      <div className="text-[10px] text-muted-foreground">{pos.strikePrice} {pos.optionType}</div>
                    )}
                    {pos.expiry && (
                      <div className="text-[10px] text-muted-foreground">{pos.expiry}</div>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{pos.segment}</Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("font-mono font-medium", pos.side === 'BUY' ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {pos.side === 'SELL' ? '-' : '+'}{pos.qty}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono">{pos.avgPrice.toFixed(2)}</td>
                  <td className="px-3 py-2.5 font-mono">{pos.ltp.toFixed(2)}</td>
                  <td className={cn("px-3 py-2.5 font-mono font-bold", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    <div className="flex items-center gap-1">
                      {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isProfit ? "+" : ""}{formatINR(pos.pnl)}
                    </div>
                  </td>
                  <td className={cn("px-3 py-2.5 font-mono", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onSquareOff(pos)}>
                      <XCircle className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
