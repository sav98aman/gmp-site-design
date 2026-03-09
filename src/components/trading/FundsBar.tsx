import { cn } from "@/lib/utils";
import { type FundsData, formatINRCompact } from "@/data/paperTradingData";
import { Wallet, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
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

  // ── Mobile ──
  const mobileBar = (
    <div className="md:hidden flex items-center gap-2 px-3 py-1.5 overflow-x-auto text-[10px]">
      <span className="text-muted-foreground shrink-0">Avl: <span className="font-mono text-primary font-semibold">{formatINRCompact(funds.availableBalance)}</span></span>
      <span className="text-border">|</span>
      <span className="text-muted-foreground shrink-0">P&L: <span className={cn("font-mono font-semibold", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>{isPositive ? "+" : ""}{formatINRCompact(totalPnL)}</span></span>
      <Button variant="ghost" size="sm" onClick={onReset} className="h-5 text-[9px] gap-0.5 px-1.5 ml-auto shrink-0 hover:text-destructive">
        <RotateCcw className="h-2 w-2" /> Reset
      </Button>
    </div>
  );

  // ── Desktop ──
  const desktopBar = (
    <div className="hidden md:flex items-center gap-0 px-2 py-1 text-[11px]">
      {[
        { label: 'Available', value: formatINRCompact(funds.availableBalance), color: 'text-primary', icon: Wallet },
        { label: 'Used Margin', value: formatINRCompact(funds.usedMargin) },
        { label: 'Realized', value: `${funds.realizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.realizedPnL)}`, color: funds.realizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
        { label: 'Unrealized', value: `${funds.unrealizedPnL >= 0 ? '+' : ''}${formatINRCompact(funds.unrealizedPnL)}`, color: funds.unrealizedPnL >= 0 ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]' },
        { label: 'Total P&L', value: `${isPositive ? '+' : ''}${formatINRCompact(totalPnL)}`, color: isPositive ? 'text-[hsl(var(--status-live))]' : 'text-[hsl(var(--status-closed))]', bold: true },
      ].map((item, i) => (
        <div key={item.label} className="flex items-center">
          <div className="flex items-center gap-1.5 px-3 py-1">
            <span className="text-muted-foreground">{item.label}</span>
            <span className={cn("font-mono font-semibold", item.bold && "font-bold", item.color)}>{item.value}</span>
          </div>
          {i < 4 && <div className="w-px h-3 bg-border" />}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-muted-foreground">Positions: <span className="font-mono">{positionsCount}</span></span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onReset} className="h-6 text-[10px] gap-1 px-2 hover:text-destructive">
              <RotateCcw className="h-2.5 w-2.5" /> Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset all — ₹10L fresh</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <div className="border-b border-border bg-card/50">
      {mobileBar}
      {desktopBar}
    </div>
  );
}
