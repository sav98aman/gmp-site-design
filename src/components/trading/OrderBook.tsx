import { cn } from "@/lib/utils";
import { type Order, formatINR } from "@/data/paperTradingData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderBookProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

const statusConfig = {
  OPEN: { label: 'Open', icon: Clock, className: 'text-[hsl(var(--status-upcoming))] bg-[hsl(var(--status-upcoming)/0.1)] border-[hsl(var(--status-upcoming)/0.2)]' },
  EXECUTED: { label: 'Executed', icon: CheckCircle2, className: 'text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)] border-[hsl(var(--status-live)/0.2)]' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted border-border' },
  REJECTED: { label: 'Rejected', icon: AlertCircle, className: 'text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)] border-[hsl(var(--status-closed)/0.2)]' },
};

export function OrderBook({ orders, onCancelOrder }: OrderBookProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
          <Clock className="h-7 w-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[...orders].reverse().map(order => {
        const cfg = statusConfig[order.status];
        const Icon = cfg.icon;
        return (
          <div key={order.id} className="rounded-xl border border-border bg-card/50 p-3 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{order.symbol}</span>
                  <Badge className={cn(
                    "text-[9px] px-1.5 py-0 border-0",
                    order.side === 'BUY'
                      ? "bg-[hsl(var(--status-live)/0.15)] text-[hsl(var(--status-live))]"
                      : "bg-[hsl(var(--status-closed)/0.15)] text-[hsl(var(--status-closed))]"
                  )}>{order.side}</Badge>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{order.orderType}</Badge>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{order.productType}</Badge>
                  {order.strikePrice && (
                    <span className="text-[10px] text-muted-foreground">{order.strikePrice}{order.optionType}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span>Qty: <span className="font-mono font-semibold text-foreground">{order.qty.toLocaleString()}</span></span>
                  <span>Price: <span className="font-mono font-semibold text-foreground">{formatINR(order.price)}</span></span>
                  {order.executedPrice && (
                    <span>Exec: <span className="font-mono font-semibold text-foreground">{formatINR(order.executedPrice)}</span></span>
                  )}
                  <span className="font-mono text-muted-foreground/70">{format(order.timestamp, 'HH:mm:ss')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium border", cfg.className)}>
                  <Icon className="h-3 w-3" />
                  {cfg.label}
                </span>
                {order.status === 'OPEN' && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => onCancelOrder(order.id)}>
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
