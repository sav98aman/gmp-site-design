import { cn } from "@/lib/utils";
import { type FundsData, formatINR, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
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
    <div className="border-b border-border bg-card/50 backdrop-blur-sm px-3 py-2">
      {/* Mobile: Compact 2-row grid */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">Available</div>
            <div className="text-xs font-bold font-mono text-primary">{formatINRCompact(funds.availableBalance)}</div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">Used</div>
            <div className="text-xs font-mono">{formatINRCompact(funds.usedMargin)}</div>
          </div>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">P&L</div>
            <div className={cn("text-xs font-mono font-bold flex items-center justify-center gap-0.5", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1 bg-muted rounded-full h-1">
            <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="h-6 text-[10px] gap-0.5 ml-2 px-2">
            <RotateCcw className="h-2.5 w-2.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Desktop: Horizontal bar */}
      <div className="hidden md:flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Wallet className="h-4 w-4 text-primary" />
          <div>
            <div className="text-[10px] text-muted-foreground">Available</div>
            <div className="text-sm font-bold font-mono text-primary">{formatINRCompact(funds.availableBalance)}</div>
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Used Margin</div>
          <div className="text-sm font-mono">{formatINRCompact(funds.usedMargin)}</div>
          <div className="w-16 bg-muted rounded-full h-1 mt-0.5">
            <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Realized P&L</div>
          <div className={cn("text-sm font-mono font-bold", funds.realizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {funds.realizedPnL >= 0 ? "+" : ""}{formatINRCompact(funds.realizedPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Unrealized P&L</div>
          <div className={cn("text-sm font-mono font-bold", funds.unrealizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {funds.unrealizedPnL >= 0 ? "+" : ""}{formatINRCompact(funds.unrealizedPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="shrink-0">
          <div className="text-[10px] text-muted-foreground">Total P&L</div>
          <div className={cn("text-sm font-mono font-bold flex items-center gap-1", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

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
