import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type Stock } from "@/data/mockStockData";
import {
  type Segment, type OrderType, type OrderSide,
  type Order, formatINR, getLotSize, PRODUCT_TYPES
} from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface OrderPanelProps {
  stock: Stock | null;
  availableBalance: number;
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  segment: Segment;
  selectedExpiry?: string;
  selectedStrike?: number;
  selectedOptionType?: 'CE' | 'PE';
  futurePrice?: number;
  optionPrice?: number;
}

export function OrderPanel({ stock, availableBalance, onPlaceOrder, segment, selectedExpiry, selectedStrike, selectedOptionType, futurePrice, optionPrice }: OrderPanelProps) {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [productType, setProductType] = useState<'MIS' | 'NRML' | 'CNC'>('MIS');

  const ltp = segment === 'FUT' ? (futurePrice ?? stock?.livePrice ?? 0) : stock?.livePrice ?? 0;
  const lotSize = stock ? getLotSize(stock.symbol) : 1;
  const effectiveQty = (segment === 'FUT' || segment === 'OPT') ? Number(qty) * lotSize : Number(qty);
  const executionPrice = orderType === 'MARKET' ? ltp : Number(price) || ltp;
  const totalValue = effectiveQty * executionPrice;
  const requiredMargin = segment === 'EQ' || segment === 'CNC' ? totalValue : totalValue * 0.12;
  const canAfford = requiredMargin <= availableBalance;
  const productOptions = PRODUCT_TYPES[segment];

  const handleSubmit = () => {
    if (!stock) return;
    onPlaceOrder({
      symbol: stock.symbol, segment, side, orderType,
      qty: effectiveQty,
      price: orderType === 'MARKET' ? ltp : Number(price),
      triggerPrice: (orderType === 'SL' || orderType === 'SL-M') ? Number(triggerPrice) : undefined,
      productType, expiry: selectedExpiry, strikePrice: selectedStrike,
      optionType: selectedOptionType,
      lotSize: (segment === 'FUT' || segment === 'OPT') ? lotSize : undefined,
    });
  };

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-4">
        Select a stock to trade
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Buy/Sell tabs */}
      <div className="grid grid-cols-2">
        <button onClick={() => setSide('BUY')}
          className={cn(
            "py-2.5 text-xs font-bold transition-colors",
            side === 'BUY'
              ? "bg-[hsl(var(--status-live))] text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >BUY</button>
        <button onClick={() => setSide('SELL')}
          className={cn(
            "py-2.5 text-xs font-bold transition-colors",
            side === 'SELL'
              ? "bg-[hsl(var(--status-closed))] text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >SELL</button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Stock + LTP */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs">{stock.symbol}</span>
          <span className="font-mono text-xs font-bold">{formatINR(ltp)}</span>
        </div>

        {/* Product Type */}
        <div>
          <Label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider">Product</Label>
          <div className="flex gap-1">
            {productOptions.map(p => (
              <button key={p} onClick={() => setProductType(p)}
                className={cn(
                  "flex-1 py-1.5 rounded text-[11px] font-medium border transition-all",
                  productType === p
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >{p}</button>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div>
          <Label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider">
            Qty {(segment === 'FUT' || segment === 'OPT') && <span className="normal-case">× {lotSize} = {effectiveQty}</span>}
          </Label>
          <Input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1"
            className="h-8 text-xs font-mono bg-muted/30 border-border" />
        </div>

        {/* Price */}
        <div>
          <Label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider">Price</Label>
          <div className="flex gap-1">
            {(['MARKET', 'LIMIT'] as OrderType[]).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={cn(
                  "flex-1 py-1.5 rounded text-[11px] font-medium border transition-all",
                  orderType === t
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground"
                )}
              >{t}</button>
            ))}
            {(['SL', 'SL-M'] as OrderType[]).map(t => (
              <button key={t} onClick={() => setOrderType(t)}
                className={cn(
                  "flex-1 py-1.5 rounded text-[11px] font-medium border transition-all",
                  orderType === t
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-muted-foreground"
                )}
              >{t}</button>
            ))}
          </div>
        </div>

        {(orderType === 'LIMIT' || orderType === 'SL') && (
          <Input type="number" value={price} onChange={e => setPrice(e.target.value)}
            placeholder={`Price (${ltp.toFixed(2)})`}
            className="h-8 text-xs font-mono bg-muted/30 border-border" />
        )}

        {(orderType === 'SL' || orderType === 'SL-M') && (
          <Input type="number" value={triggerPrice} onChange={e => setTriggerPrice(e.target.value)}
            placeholder={`Trigger (${ltp.toFixed(2)})`}
            className="h-8 text-xs font-mono bg-muted/30 border-border" />
        )}

        {/* Summary */}
        <div className="space-y-1 text-[11px] pt-2 border-t border-border/50">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Value</span>
            <span className="font-mono">{formatINR(totalValue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Req. Margin</span>
            <span className={cn("font-mono font-semibold", canAfford ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
              {formatINR(requiredMargin)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono">{formatINR(availableBalance)}</span>
          </div>
        </div>

        {!canAfford && (
          <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.08)] rounded p-2">
            <AlertCircle className="h-3 w-3 shrink-0" /> Insufficient margin
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <div className="p-3 border-t border-border">
        <Button onClick={handleSubmit} disabled={!canAfford || Number(qty) <= 0}
          className={cn(
            "w-full font-bold text-xs h-9",
            side === 'BUY'
              ? "bg-[hsl(var(--status-live))] hover:bg-[hsl(var(--status-live)/0.9)] text-white"
              : "bg-[hsl(var(--status-closed))] hover:bg-[hsl(var(--status-closed)/0.9)] text-white"
          )}
        >
          {side} {stock.symbol}
        </Button>
      </div>
    </div>
  );
}
