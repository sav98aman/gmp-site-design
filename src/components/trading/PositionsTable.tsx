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
      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground/30" />
        No open positions
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 pr-2 font-medium">Product</th>
            <th className="text-left py-1.5 px-2 font-medium">Instrument</th>
            <th className="text-right py-1.5 px-2 font-medium">Qty.</th>
            <th className="text-right py-1.5 px-2 font-medium">Avg.</th>
            <th className="text-right py-1.5 px-2 font-medium">LTP</th>
            <th className="text-right py-1.5 px-2 font-medium">P&L</th>
            <th className="text-right py-1.5 pl-2 font-medium">Chg.</th>
            <th className="py-1.5 pl-2"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => {
            const isProfit = pos.pnl >= 0;
            return (
              <tr key={pos.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-2 pr-2 text-muted-foreground">{pos.productType}</td>
                <td className="py-2 px-2">
                  <span className="font-semibold">{pos.symbol}</span>
                  <span className={cn("ml-1 text-[10px]", pos.side === 'BUY' ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>{pos.side}</span>
                  {pos.strikePrice && <span className="text-muted-foreground text-[10px] ml-1">{pos.strikePrice}{pos.optionType}</span>}
                </td>
                <td className="py-2 px-2 text-right font-mono">{pos.qty}</td>
                <td className="py-2 px-2 text-right font-mono">{pos.avgPrice.toFixed(2)}</td>
                <td className="py-2 px-2 text-right font-mono font-semibold">{pos.ltp.toFixed(2)}</td>
                <td className={cn("py-2 px-2 text-right font-mono font-bold", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {isProfit ? "+" : ""}{formatINR(pos.pnl)}
                </td>
                <td className={cn("py-2 px-2 text-right font-mono", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {isProfit ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                </td>
                <td className="py-2 pl-2">
                  <Button variant="ghost" size="sm" onClick={() => onSquareOff(pos)}
                    className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    Exit
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={5} className="py-1.5 text-right text-muted-foreground font-medium">Total</td>
            <td className={cn("py-1.5 px-2 text-right font-mono font-bold", totalPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)}
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
