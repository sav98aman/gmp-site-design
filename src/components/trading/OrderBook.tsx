import { cn } from "@/lib/utils";
import { type Order, formatINR } from "@/data/paperTradingData";
import { Button } from "@/components/ui/button";
import { XCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderBookProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
}

const statusMap = {
  OPEN: { icon: Clock, color: 'text-[hsl(var(--status-upcoming))]', label: 'Open' },
  EXECUTED: { icon: CheckCircle2, color: 'text-[hsl(var(--status-live))]', label: 'Complete' },
  CANCELLED: { icon: XCircle, color: 'text-muted-foreground', label: 'Cancelled' },
  REJECTED: { icon: AlertCircle, color: 'text-[hsl(var(--status-closed))]', label: 'Rejected' },
};

export function OrderBook({ orders, onCancelOrder }: OrderBookProps) {
  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
        <Clock className="h-4 w-4 text-muted-foreground/30" />
        No orders placed
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-1.5 pr-2 font-medium">Time</th>
            <th className="text-left py-1.5 px-2 font-medium">Type</th>
            <th className="text-left py-1.5 px-2 font-medium">Instrument</th>
            <th className="text-left py-1.5 px-2 font-medium">Product</th>
            <th className="text-right py-1.5 px-2 font-medium">Qty.</th>
            <th className="text-right py-1.5 px-2 font-medium">Price</th>
            <th className="text-center py-1.5 px-2 font-medium">Status</th>
            <th className="py-1.5 pl-2"></th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map(order => {
            const s = statusMap[order.status];
            const Icon = s.icon;
            return (
              <tr key={order.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-2 pr-2 font-mono text-muted-foreground">{format(order.timestamp, 'HH:mm:ss')}</td>
                <td className="py-2 px-2">
                  <span className={cn("font-bold", order.side === 'BUY' ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {order.side}
                  </span>
                  <span className="text-muted-foreground ml-1">{order.orderType}</span>
                </td>
                <td className="py-2 px-2 font-semibold">
                  {order.symbol}
                  {order.strikePrice && <span className="text-muted-foreground font-normal ml-1">{order.strikePrice}{order.optionType}</span>}
                </td>
                <td className="py-2 px-2 text-muted-foreground">{order.productType}</td>
                <td className="py-2 px-2 text-right font-mono">{order.qty.toLocaleString()}</td>
                <td className="py-2 px-2 text-right font-mono">{order.executedPrice ? formatINR(order.executedPrice) : formatINR(order.price)}</td>
                <td className="py-2 px-2 text-center">
                  <span className={cn("inline-flex items-center gap-0.5", s.color)}>
                    <Icon className="h-3 w-3" />
                    <span className="text-[10px]">{s.label}</span>
                  </span>
                </td>
                <td className="py-2 pl-2">
                  {order.status === 'OPEN' && (
                    <Button variant="ghost" size="sm" onClick={() => onCancelOrder(order.id)}
                      className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-destructive">Cancel</Button>
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
