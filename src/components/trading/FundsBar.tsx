import { cn } from "@/lib/utils";
import { type FundsData, formatINR, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, RotateCcw, PieChart } from "lucide-react";
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
    <div className="border-b border-border bg-card/60 backdrop-blur-sm">
      {/* Mobile */}
      <div className="md:hidden px-3 py-2.5">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Available', value: formatINRCompact(funds.availableBalance), color: 'text-primary' },
            { label: 'Margin Used', value: formatINRCompact(funds.usedMargin), color: 'text-foreground' },
            { label: 'P&L', value: `${isPositive ? '+' : ''}${formatINRCompact(totalPnL)}`, color: isPositive ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
          ].map(item => (
            <div key={item.label} className="rounded-lg bg-muted/50 px-2 py-2">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.label}</div>
              <div className={cn("text-xs font-bold font-mono", item.color)}>{item.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(usedPct, 100)}%` }} />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{usedPct.toFixed(0)}%</span>
          <Button variant="ghost" size="sm" onClick={onReset} className="h-6 text-[10px] gap-1 px-2 hover:bg-destructive/10 hover:text-destructive">
            <RotateCcw className="h-2.5 w-2.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-0 px-2 py-1.5">
        {[
          { icon: Wallet, label: 'Available', value: formatINRCompact(funds.availableBalance), color: 'text-primary', highlight: true },
          { label: 'Used Margin', value: formatINRCompact(funds.usedMargin), showBar: true },
          { label: 'Realized', value: `${funds.realizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.realizedPnL)}`, color: funds.realizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
          { label: 'Unrealized', value: `${funds.unrealizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.unrealizedPnL)}`, color: funds.unrealizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
          { label: 'Total P&L', value: `${isPositive ? '+' : ''}${formatINRCompact(totalPnL)}`, color: isPositive ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]', icon: isPositive ? TrendingUp : TrendingDown, bold: true },
          { icon: PieChart, label: 'Portfolio', value: formatINRCompact(portfolioValue) },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center">
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", item.highlight && "bg-primary/10")}>
              {item.icon && <item.icon className={cn("h-3.5 w-3.5", item.color || 'text-muted-foreground')} />}
              <div>
                <div className="text-[10px] text-muted-foreground leading-none mb-0.5">{item.label}</div>
                <div className={cn("text-sm font-mono leading-none", item.bold ? "font-bold" : "font-semibold", item.color)}>
                  {item.value}
                </div>
                {item.showBar && (
                  <div className="w-14 bg-muted rounded-full h-1 mt-1">
                    <div className="bg-primary h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(usedPct, 100)}%` }} />
                  </div>
                )}
              </div>
            </div>
            {i < 5 && <div className="w-px h-6 bg-border/50 mx-1" />}
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
