import { cn } from "@/lib/utils";
import { type Position, formatINR } from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, XCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsTableProps {
  positions: Position[];
  onSquareOff: (position: Position) => void;
}

export function PositionsTable({ positions, onSquareOff }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs text-muted-foreground">No open positions</p>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-muted-foreground">{positions.length} position{positions.length > 1 ? 's' : ''}</span>
        <span className={cn("font-mono font-bold", totalPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
          P&L: {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-3 font-medium">Symbol</th>
              <th className="text-left py-2 px-2 font-medium">Side</th>
              <th className="text-right py-2 px-2 font-medium">Qty</th>
              <th className="text-right py-2 px-2 font-medium">Avg</th>
              <th className="text-right py-2 px-2 font-medium">LTP</th>
              <th className="text-right py-2 px-2 font-medium">P&L</th>
              <th className="text-right py-2 pl-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {positions.map(pos => {
              const isProfit = pos.pnl >= 0;
              return (
                <tr key={pos.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-3">
                    <div className="font-semibold">{pos.symbol}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {pos.segment}{pos.strikePrice ? ` · ${pos.strikePrice} ${pos.optionType}` : ''}{pos.expiry ? ` · ${pos.expiry}` : ''}
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", pos.side === 'BUY' ? "text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)]" : "text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)]")}>
                      {pos.side}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">{pos.qty}</td>
                  <td className="py-2.5 px-2 text-right font-mono">{pos.avgPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold">{pos.ltp.toFixed(2)}</td>
                  <td className={cn("py-2.5 px-2 text-right font-mono font-bold", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isProfit ? "+" : ""}{formatINR(pos.pnl)}
                    <div className="text-[10px] font-normal opacity-70">{isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%</div>
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1" onClick={() => onSquareOff(pos)}>
                      <XCircle className="h-3 w-3" /> Exit
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
