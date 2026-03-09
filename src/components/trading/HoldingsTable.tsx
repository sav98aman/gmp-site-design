import { cn } from "@/lib/utils";
import { type Holding, formatINR } from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Package className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs text-muted-foreground">No holdings yet</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">Buy in CNC mode to add holdings</p>
      </div>
    );
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const isProfit = totalPnL >= 0;

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-muted-foreground">{holdings.length} holding{holdings.length > 1 ? 's' : ''} · Invested: <span className="font-mono text-foreground">{formatINR(totalInvested)}</span></span>
        <span className={cn("font-mono font-bold", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
          P&L: {isProfit ? "+" : ""}{formatINR(totalPnL)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-3 font-medium">Symbol</th>
              <th className="text-right py-2 px-2 font-medium">Qty</th>
              <th className="text-right py-2 px-2 font-medium">Avg</th>
              <th className="text-right py-2 px-2 font-medium">LTP</th>
              <th className="text-right py-2 px-2 font-medium">Current</th>
              <th className="text-right py-2 px-2 font-medium">P&L</th>
              <th className="text-right py-2 pl-2 font-medium">Day</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const hProfit = h.pnl >= 0;
              const dayPos = h.dayChange >= 0;
              return (
                <tr key={h.symbol} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pr-3 font-semibold">{h.symbol}</td>
                  <td className="py-2.5 px-2 text-right font-mono">{h.qty}</td>
                  <td className="py-2.5 px-2 text-right font-mono">{h.avgPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono font-semibold">{h.ltp.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono">{formatINR(h.currentValue)}</td>
                  <td className={cn("py-2.5 px-2 text-right font-mono font-bold", hProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {hProfit ? "+" : ""}{formatINR(h.pnl)}
                    <div className="text-[10px] font-normal opacity-70">{hProfit ? "+" : ""}{h.pnlPercent.toFixed(2)}%</div>
                  </td>
                  <td className={cn("py-2.5 pl-2 text-right font-mono text-[10px]", dayPos ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {dayPos ? "+" : ""}{h.dayChangePercent.toFixed(2)}%
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
