import { cn } from "@/lib/utils";
import { type FundsData, formatINR, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, RotateCcw, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FundsBarProps {
  funds: FundsData;
  onReset: () => void;
  positionsCount?: number;
  ordersCount?: number;
}

export function FundsBar({ funds, onReset, positionsCount = 0, ordersCount = 0 }: FundsBarProps) {
  const totalPnL = funds.realizedPnL + funds.unrealizedPnL;
  const isPositive = totalPnL >= 0;
  const portfolioValue = funds.totalBalance + totalPnL;

  // ── Mobile: compact row ──
  const mobileBar = (
    <div className="md:hidden px-3 py-2 flex items-center gap-2 overflow-x-auto">
      {[
        { label: 'Available', value: formatINRCompact(funds.availableBalance), color: 'text-primary' },
        { label: 'P&L', value: `${isPositive ? '+' : ''}${formatINRCompact(totalPnL)}`, color: isPositive ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
        { label: 'Margin', value: formatINRCompact(funds.usedMargin) },
      ].map(item => (
        <div key={item.label} className="shrink-0 px-2.5 py-1.5 rounded-lg bg-muted/50 text-center min-w-[80px]">
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider leading-none">{item.label}</div>
          <div className={cn("text-xs font-bold font-mono mt-0.5", item.color)}>{item.value}</div>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-[10px] gap-1 px-2 shrink-0 hover:bg-destructive/10 hover:text-destructive ml-auto">
        <RotateCcw className="h-2.5 w-2.5" /> Reset
      </Button>
    </div>
  );

  // ── Desktop: 3 dashboard cards + stats ──
  const desktopBar = (
    <div className="hidden md:block px-4 py-3">
      <div className="flex items-stretch gap-3">
        {/* Card 1: P&L */}
        <div className={cn(
          "flex-1 rounded-xl border p-3 flex items-center gap-3",
          isPositive
            ? "border-[hsl(var(--status-live)/0.2)] bg-[hsl(var(--status-live)/0.04)]"
            : "border-[hsl(var(--status-closed)/0.2)] bg-[hsl(var(--status-closed)/0.04)]"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            isPositive ? "bg-[hsl(var(--status-live)/0.12)]" : "bg-[hsl(var(--status-closed)/0.12)]"
          )}>
            {isPositive ? <TrendingUp className="h-5 w-5 text-[hsl(var(--status-live))]" /> : <TrendingDown className="h-5 w-5 text-[hsl(var(--status-closed))]" />}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Total P&L</div>
            <div className={cn("text-xl font-bold font-mono leading-tight", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
            </div>
            <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
              <span>R: <span className={cn("font-mono", funds.realizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>{formatINRCompact(funds.realizedPnL)}</span></span>
              <span>U: <span className={cn("font-mono", funds.unrealizedPnL >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>{formatINRCompact(funds.unrealizedPnL)}</span></span>
            </div>
          </div>
        </div>

        {/* Card 2: Funds */}
        <div className="flex-1 rounded-xl border border-border bg-card/60 p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Available Funds</div>
            <div className="text-xl font-bold font-mono text-primary leading-tight">{formatINRCompact(funds.availableBalance)}</div>
            <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
              <span>Margin: <span className="font-mono text-foreground">{formatINRCompact(funds.usedMargin)}</span></span>
              <span>Portfolio: <span className="font-mono text-foreground">{formatINRCompact(portfolioValue)}</span></span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Trades */}
        <div className="flex-1 rounded-xl border border-border bg-card/60 p-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Active Trades</div>
            <div className="text-xl font-bold font-mono leading-tight">{positionsCount + ordersCount}</div>
            <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
              <span>Positions: <span className="font-mono text-foreground">{positionsCount}</span></span>
              <span>Open orders: <span className="font-mono text-foreground">{ordersCount}</span></span>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onReset} className="h-7 text-[10px] gap-1 ml-auto hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset all trades & restart with ₹10L</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <div className="border-b border-border bg-background">
      {mobileBar}
      {desktopBar}
    </div>
  );
}
