import { cn } from "@/lib/utils";
import { type Order, formatINR } from "@/data/paperTradingData";
import { Button } from "@/components/ui/button";
import { XCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderBookProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

const statusConfig = {
  OPEN: { label: 'Open', icon: Clock, color: 'text-[hsl(var(--status-upcoming))]' },
  EXECUTED: { label: 'Done', icon: CheckCircle2, color: 'text-[hsl(var(--status-live))]' },
  CANCELLED: { label: 'Cxl', icon: XCircle, color: 'text-muted-foreground' },
  REJECTED: { label: 'Rej', icon: AlertCircle, color: 'text-[hsl(var(--status-closed))]' },
};

export function OrderBook({ orders, onCancelOrder }: OrderBookProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Clock className="h-8 w-8 text-muted-foreground/20 mb-2" />
        <p className="text-xs text-muted-foreground">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-2 pr-3 font-medium">Time</th>
            <th className="text-left py-2 px-2 font-medium">Symbol</th>
            <th className="text-left py-2 px-2 font-medium">Side</th>
            <th className="text-left py-2 px-2 font-medium">Type</th>
            <th className="text-right py-2 px-2 font-medium">Qty</th>
            <th className="text-right py-2 px-2 font-medium">Price</th>
            <th className="text-center py-2 px-2 font-medium">Status</th>
            <th className="text-right py-2 pl-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map(order => {
            const cfg = statusConfig[order.status];
            const Icon = cfg.icon;
            return (
              <tr key={order.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 pr-3 font-mono text-muted-foreground">{format(order.timestamp, 'HH:mm:ss')}</td>
                <td className="py-2.5 px-2">
                  <span className="font-semibold">{order.symbol}</span>
                  {order.strikePrice && <span className="text-[10px] text-muted-foreground ml-1">{order.strikePrice}{order.optionType}</span>}
                </td>
                <td className="py-2.5 px-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", order.side === 'BUY' ? "text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)]" : "text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)]")}>
                    {order.side}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-muted-foreground">{order.orderType} · {order.productType}</td>
                <td className="py-2.5 px-2 text-right font-mono">{order.qty.toLocaleString()}</td>
                <td className="py-2.5 px-2 text-right font-mono">{order.executedPrice ? formatINR(order.executedPrice) : formatINR(order.price)}</td>
                <td className="py-2.5 px-2 text-center">
                  <span className={cn("inline-flex items-center gap-0.5", cfg.color)}>
                    <Icon className="h-3 w-3" />
                    <span className="text-[10px] font-medium">{cfg.label}</span>
                  </span>
                </td>
                <td className="py-2.5 pl-2 text-right">
                  {order.status === 'OPEN' && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => onCancelOrder(order.id)}>
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
