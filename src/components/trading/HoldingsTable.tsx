import { cn } from "@/lib/utils";
import { type Holding, formatINR } from "@/data/paperTradingData";
import { Package } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
        <Package className="h-4 w-4 text-muted-foreground/30" />
        No holdings — buy in CNC mode
      </div>
    );
  }

  const totalInvested = holdings.reduce((s, h) => s + h.investedValue, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 pr-2 font-medium">Instrument</th>
            <th className="text-right py-1.5 px-2 font-medium">Qty.</th>
            <th className="text-right py-1.5 px-2 font-medium">Avg. cost</th>
            <th className="text-right py-1.5 px-2 font-medium">LTP</th>
            <th className="text-right py-1.5 px-2 font-medium">Cur. val</th>
            <th className="text-right py-1.5 px-2 font-medium">P&L</th>
            <th className="text-right py-1.5 pl-2 font-medium">Day chg.</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => {
            const prof = h.pnl >= 0;
            const dayPos = h.dayChange >= 0;
            return (
              <tr key={h.symbol} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-2 pr-2 font-semibold">{h.symbol}</td>
                <td className="py-2 px-2 text-right font-mono">{h.qty}</td>
                <td className="py-2 px-2 text-right font-mono">{h.avgPrice.toFixed(2)}</td>
                <td className="py-2 px-2 text-right font-mono font-semibold">{h.ltp.toFixed(2)}</td>
                <td className="py-2 px-2 text-right font-mono">{formatINR(h.currentValue)}</td>
                <td className={cn("py-2 px-2 text-right font-mono font-bold", prof ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {prof ? "+" : ""}{formatINR(h.pnl)} <span className="font-normal opacity-70">({prof ? "+" : ""}{h.pnlPercent.toFixed(2)}%)</span>
                </td>
                <td className={cn("py-2 pl-2 text-right font-mono", dayPos ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {dayPos ? "+" : ""}{h.dayChangePercent.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-border">
            <td colSpan={4} className="py-1.5 text-right text-muted-foreground font-medium">Total</td>
            <td className="py-1.5 px-2 text-right font-mono">{formatINR(totalCurrent)}</td>
            <td className={cn("py-1.5 px-2 text-right font-mono font-bold", totalPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {totalPnL >= 0 ? "+" : ""}{formatINR(totalPnL)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
