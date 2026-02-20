import { cn } from "@/lib/utils";
import { type Holding, formatINR } from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No holdings yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Buy stocks in CNC mode to add holdings</p>
      </div>
    );
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[
          { label: 'Invested', value: formatINR(totalInvested), plain: true },
          { label: 'Current Value', value: formatINR(totalCurrent), plain: true },
          { label: 'Total P&L', value: `${totalPnL >= 0 ? '+' : ''}${formatINR(totalPnL)} (${totalPnLPct.toFixed(2)}%)`, profit: totalPnL >= 0 },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className={cn("text-sm font-bold font-mono", !stat.plain && (stat.profit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]"))}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              {['Symbol', 'Qty', 'Avg Price', 'LTP', 'Invested', 'Current', 'P&L', 'Day Chg'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {holdings.map(h => {
              const isProfit = h.pnl >= 0;
              const isDayPositive = h.dayChange >= 0;
              return (
                <tr key={h.symbol} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 font-bold">{h.symbol}</td>
                  <td className="px-3 py-2.5 font-mono">{h.qty}</td>
                  <td className="px-3 py-2.5 font-mono">{h.avgPrice.toFixed(2)}</td>
                  <td className="px-3 py-2.5 font-mono">{h.ltp.toFixed(2)}</td>
                  <td className="px-3 py-2.5 font-mono">{formatINR(h.investedValue)}</td>
                  <td className="px-3 py-2.5 font-mono">{formatINR(h.currentValue)}</td>
                  <td className={cn("px-3 py-2.5 font-mono font-bold", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    <div className="flex items-center gap-1">
                      {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isProfit ? '+' : ''}{formatINR(h.pnl)}
                    </div>
                    <div className="text-[10px] opacity-70">{isProfit ? '+' : ''}{h.pnlPercent.toFixed(2)}%</div>
                  </td>
                  <td className={cn("px-3 py-2.5 font-mono", isDayPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {isDayPositive ? '+' : ''}{h.dayChangePercent.toFixed(2)}%
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
