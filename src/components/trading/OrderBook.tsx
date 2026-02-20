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
  OPEN: { label: 'Open', icon: Clock, className: 'text-[hsl(var(--status-upcoming))] bg-[hsl(var(--status-upcoming)/0.1)]' },
  EXECUTED: { label: 'Executed', icon: CheckCircle2, className: 'text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.1)]' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted' },
  REJECTED: { label: 'Rejected', icon: AlertCircle, className: 'text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)]' },
};

export function OrderBook({ orders, onCancelOrder }: OrderBookProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No orders yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/50">
          <tr>
            {['Time', 'Symbol', 'Type', 'Side', 'Qty', 'Price', 'Exec. Price', 'Status', ''].map(h => (
              <th key={h} className="px-3 py-2 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {[...orders].reverse().map(order => {
            const cfg = statusConfig[order.status];
            const Icon = cfg.icon;
            return (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 text-muted-foreground font-mono whitespace-nowrap">
                  {format(order.timestamp, 'HH:mm:ss')}
                </td>
                <td className="px-3 py-2.5 font-bold">
                  <div>{order.symbol}</div>
                  {order.strikePrice && <div className="text-[10px] text-muted-foreground">{order.strikePrice}{order.optionType}</div>}
                </td>
                <td className="px-3 py-2.5">
                  <div className="text-muted-foreground">{order.orderType}</div>
                  <div className="text-[10px] text-muted-foreground">{order.productType}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={cn("font-bold", order.side === 'BUY' ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                    {order.side}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono">{order.qty.toLocaleString()}</td>
                <td className="px-3 py-2.5 font-mono">{formatINR(order.price)}</td>
                <td className="px-3 py-2.5 font-mono">
                  {order.executedPrice ? formatINR(order.executedPrice) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2.5">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", cfg.className)}>
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  {order.status === 'OPEN' && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onCancelOrder(order.id)}>
                      <XCircle className="h-3.5 w-3.5" />
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
