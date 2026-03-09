import { cn } from "@/lib/utils";
import { type FundsData, formatINR, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, RotateCcw, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  const portfolioValue = funds.totalBalance + totalPnL;

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-md">
      {/* Mobile */}
      <div className="md:hidden px-3 py-3">
        {/* P&L Hero Card */}
        <div className={cn(
          "rounded-xl p-3 mb-2.5 relative overflow-hidden",
          isPositive
            ? "bg-gradient-to-r from-[hsl(var(--status-live)/0.15)] to-[hsl(var(--status-live)/0.05)] border border-[hsl(var(--status-live)/0.2)]"
            : "bg-gradient-to-r from-[hsl(var(--status-closed)/0.15)] to-[hsl(var(--status-closed)/0.05)] border border-[hsl(var(--status-closed)/0.2)]"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Total P&L</div>
              <div className={cn("text-xl font-bold font-mono flex items-center gap-1", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                {isPositive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Portfolio</div>
              <div className="text-base font-bold font-mono text-foreground">{formatINRCompact(portfolioValue)}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Available</div>
              <div className="text-xs font-bold font-mono text-primary">{formatINRCompact(funds.availableBalance)}</div>
            </div>
            <div className="rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Margin</div>
              <div className="text-xs font-bold font-mono">{formatINRCompact(funds.usedMargin)}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-[10px] gap-1 px-2 hover:bg-destructive/10 hover:text-destructive shrink-0">
            <RotateCcw className="h-2.5 w-2.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2.5">
        {/* P&L Card - hero element */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-xl relative overflow-hidden",
          isPositive
            ? "bg-gradient-to-r from-[hsl(var(--status-live)/0.12)] to-transparent border border-[hsl(var(--status-live)/0.15)]"
            : "bg-gradient-to-r from-[hsl(var(--status-closed)/0.12)] to-transparent border border-[hsl(var(--status-closed)/0.15)]"
        )}>
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", isPositive ? "bg-[hsl(var(--status-live)/0.15)]" : "bg-[hsl(var(--status-closed)/0.15)]")}>
            {isPositive ? <TrendingUp className="h-4 w-4 text-[hsl(var(--status-live))]" /> : <TrendingDown className="h-4 w-4 text-[hsl(var(--status-closed))]" />}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mb-0.5">Total P&L</div>
            <div className={cn("text-lg font-bold font-mono leading-none", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {isPositive ? "+" : ""}{formatINRCompact(totalPnL)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border" />

        {/* Stats */}
        {[
          { icon: Wallet, label: 'Available', value: formatINRCompact(funds.availableBalance), color: 'text-primary' },
          { label: 'Used Margin', value: formatINRCompact(funds.usedMargin), showBar: true },
          { label: 'Realized', value: `${funds.realizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.realizedPnL)}`, color: funds.realizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
          { label: 'Unrealized', value: `${funds.unrealizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.unrealizedPnL)}`, color: funds.unrealizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
          { label: 'Portfolio', value: formatINRCompact(portfolioValue), bold: true },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-muted/50 transition-colors">
            {'icon' in item && item.icon && <item.icon className={cn("h-3.5 w-3.5", item.color || 'text-muted-foreground')} />}
            <div>
              <div className="text-[10px] text-muted-foreground leading-none mb-0.5">{item.label}</div>
              <div className={cn("text-sm font-mono leading-none", item.bold ? "font-bold" : "font-semibold", item.color)}>
                {item.value}
              </div>
              {item.showBar && (
                <div className="w-12 bg-muted rounded-full h-1 mt-1">
                  <div className="bg-primary h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(usedPct, 100)}%` }} />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onReset} className="h-7 text-xs gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset all trades & restart with ₹10L</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
