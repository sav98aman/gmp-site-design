import { cn } from "@/lib/utils";
import { type Stock } from "@/data/mockStockData";

interface MarketDepthProps {
  stock: Stock;
}

// Generate mock market depth data
function generateDepth(price: number) {
  const bids = [];
  const asks = [];
  for (let i = 0; i < 5; i++) {
    bids.push({
      price: Number((price - (i + 1) * 0.5 - Math.random() * 0.5).toFixed(2)),
      qty: Math.floor(Math.random() * 5000 + 200),
      orders: Math.floor(Math.random() * 50 + 5),
    });
    asks.push({
      price: Number((price + (i + 1) * 0.5 + Math.random() * 0.5).toFixed(2)),
      qty: Math.floor(Math.random() * 5000 + 200),
      orders: Math.floor(Math.random() * 50 + 5),
    });
  }
  return { bids, asks };
}

export function MarketDepth({ stock }: MarketDepthProps) {
  const { bids, asks } = generateDepth(stock.livePrice);
  const maxQty = Math.max(...bids.map(b => b.qty), ...asks.map(a => a.qty));

  return (
    <div className="text-[11px]">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-muted-foreground font-medium">Market Depth</span>
        <span className="text-[10px] text-muted-foreground">5 best</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px_80px_1fr] gap-0 text-[9px] text-muted-foreground font-medium mb-1 px-1">
        <span>Bid Qty</span>
        <span className="text-center">Orders</span>
        <span className="text-center">Price</span>
        <span className="text-center">Orders</span>
        <span className="text-right">Ask Qty</span>
      </div>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => {
        const bid = bids[i];
        const ask = asks[i];
        const bidWidth = (bid.qty / maxQty) * 100;
        const askWidth = (ask.qty / maxQty) * 100;

        return (
          <div key={i} className="grid grid-cols-[1fr_80px_80px_80px_1fr] gap-0 items-center py-[3px] px-1 relative">
            {/* Bid bar */}
            <div className="relative text-right pr-1">
              <div className="absolute inset-y-0 right-0 bg-[hsl(var(--status-live)/0.08)] rounded-l" style={{ width: `${bidWidth}%` }} />
              <span className="relative font-mono text-[hsl(var(--status-live))]">{bid.qty.toLocaleString()}</span>
            </div>
            <span className="text-center font-mono text-muted-foreground">{bid.orders}</span>
            <div className="text-center">
              <span className="font-mono font-semibold text-[hsl(var(--status-live))]">{bid.price.toFixed(2)}</span>
              <span className="mx-1 text-border">|</span>
              <span className="font-mono font-semibold text-[hsl(var(--status-closed))]">{ask.price.toFixed(2)}</span>
            </div>
            <span className="text-center font-mono text-muted-foreground">{ask.orders}</span>
            {/* Ask bar */}
            <div className="relative pl-1">
              <div className="absolute inset-y-0 left-0 bg-[hsl(var(--status-closed)/0.08)] rounded-r" style={{ width: `${askWidth}%` }} />
              <span className="relative font-mono text-[hsl(var(--status-closed))]">{ask.qty.toLocaleString()}</span>
            </div>
          </div>
        );
      })}

      {/* Totals */}
      <div className="grid grid-cols-2 gap-0 mt-2 pt-2 border-t border-border/50 px-1">
        <div className="text-[10px]">
          <span className="text-muted-foreground">Total Bid: </span>
          <span className="font-mono text-[hsl(var(--status-live))] font-semibold">{bids.reduce((s, b) => s + b.qty, 0).toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-right">
          <span className="text-muted-foreground">Total Ask: </span>
          <span className="font-mono text-[hsl(var(--status-closed))] font-semibold">{asks.reduce((s, a) => s + a.qty, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
