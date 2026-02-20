import { cn } from "@/lib/utils";
import { type FundsData, formatINR, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, BarChart3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FundsBarProps {
  funds: FundsData;
  onReset: () => void;
}

export function FundsBar({ funds, onReset }: FundsBarProps) {
  const totalPnL = funds.realizedPnL + funds.unrealizedPnL;
  const isPositive = totalPnL >= 0;
  const usedPct = funds.totalBalance > 0 ? (funds.usedMargin / funds.totalBalance) * 100 : 0;

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-2">
      <div className="flex items-center gap-6 overflow-x-auto">
        {/* Available Margin */}
        <div className="flex items-center gap-2 shrink-0">
          <Wallet className="h-4 w-4 text-primary" />
          <div>
            <div className="text-[10px] text-muted-foreground">Available</div>
            <div className="text-sm font-bold font-mono text-primary">{formatINRCompact(funds.availableBalance)}</div>
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Used Margin */}
        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Used Margin</div>
          <div className="text-sm font-mono">{formatINRCompact(funds.usedMargin)}</div>
          <div className="w-16 bg-muted rounded-full h-1 mt-0.5">
            <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Realized P&L */}
        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Realized P&L</div>
          <div className={cn("text-sm font-mono font-bold", funds.realizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {funds.realizedPnL >= 0 ? "+" : ""}{formatINRCompact(funds.realizedPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Unrealized P&L */}
        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Unrealized P&L</div>
          <div className={cn("text-sm font-mono font-bold", funds.unrealizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {funds.unrealizedPnL >= 0 ? "+" : ""}{formatINRCompact(funds.unrealizedPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Total P&L */}
        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Total P&L</div>
          <div className={cn("text-sm font-mono font-bold flex items-center gap-1", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Portfolio Value */}
        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Portfolio Value</div>
          <div className="text-sm font-mono font-bold">{formatINRCompact(funds.totalBalance + totalPnL)}</div>
        </div>

        <div className="ml-auto shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onReset} className="h-7 text-xs gap-1">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset all trades & restart with ₹10L</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
