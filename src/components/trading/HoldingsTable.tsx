import { cn } from "@/lib/utils";
import { type Holding, formatINR } from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HoldingsTableProps {
  holdings: Holding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
          <Package className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No holdings yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Buy stocks in CNC mode to build your portfolio</p>
      </div>
    );
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const isProfit = totalPnL >= 0;

  return (
    <div className="space-y-3">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Invested</div>
          <div className="text-sm font-bold font-mono">{formatINR(totalInvested)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current</div>
          <div className="text-sm font-bold font-mono">{formatINR(totalCurrent)}</div>
        </div>
        <div className={cn(
          "rounded-xl border p-3",
          isProfit
            ? "border-[hsl(var(--status-live)/0.2)] bg-[hsl(var(--status-live)/0.05)]"
            : "border-[hsl(var(--status-closed)/0.2)] bg-[hsl(var(--status-closed)/0.05)]"
        )}>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">P&L</div>
          <div className={cn("text-sm font-bold font-mono flex items-center gap-1", isProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {isProfit ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {isProfit ? '+' : ''}{formatINR(totalPnL)}
            <span className="text-[10px] opacity-75">({totalPnLPct.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Holding cards */}
      <div className="space-y-2">
        {holdings.map(h => {
          const hIsProfit = h.pnl >= 0;
          const isDayPositive = h.dayChange >= 0;
          return (
            <div key={h.symbol} className="rounded-xl border border-border bg-card/50 p-3 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{h.symbol}</span>
                    <span className={cn("text-[10px] font-mono font-medium flex items-center gap-0.5", isDayPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                      {isDayPositive ? "+" : ""}{h.dayChangePercent.toFixed(2)}% today
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span>Qty: <span className="font-mono font-semibold text-foreground">{h.qty}</span></span>
                    <span>Avg: <span className="font-mono font-semibold text-foreground">{h.avgPrice.toFixed(2)}</span></span>
                    <span>LTP: <span className="font-mono font-semibold text-foreground">{h.ltp.toFixed(2)}</span></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-sm font-bold font-mono flex items-center gap-1 justify-end", hIsProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {hIsProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {hIsProfit ? '+' : ''}{formatINR(h.pnl)}
                  </div>
                  <div className={cn("text-[10px] font-mono", hIsProfit ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {hIsProfit ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
