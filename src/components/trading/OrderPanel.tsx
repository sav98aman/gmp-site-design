import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
}

export function OrderPanel({ stock, availableBalance, onPlaceOrder, segment, selectedExpiry, selectedStrike, selectedOptionType, futurePrice }: OrderPanelProps) {
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
    const orderPrice = orderType === 'MARKET' ? ltp : Number(price);
    onPlaceOrder({
      symbol: stock.symbol,
      segment,
      side,
      orderType,
      qty: effectiveQty,
      price: orderPrice,
      triggerPrice: (orderType === 'SL' || orderType === 'SL-M') ? Number(triggerPrice) : undefined,
      productType,
      expiry: selectedExpiry,
      strikePrice: selectedStrike,
      optionType: selectedOptionType,
      lotSize: (segment === 'FUT' || segment === 'OPT') ? lotSize : undefined,
    });
  };

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Select a stock to place orders</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      {/* Stock Info */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <span className="font-bold text-sm">{stock.symbol}</span>
          {segment !== 'EQ' && segment !== 'CNC' && selectedExpiry && (
            <span className="text-xs text-muted-foreground ml-1">{selectedExpiry}</span>
          )}
          {segment === 'OPT' && selectedStrike && selectedOptionType && (
            <Badge variant="outline" className="ml-1 text-xs px-1 py-0">{selectedStrike} {selectedOptionType}</Badge>
          )}
        </div>
        <div className="text-right">
          <div className="font-mono text-sm font-bold">{formatINR(ltp)}</div>
          <div className={cn("text-xs", stock.livePrice > stock.previousClose ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {stock.livePrice > stock.previousClose ? "+" : ""}{((stock.livePrice - stock.previousClose) / stock.previousClose * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* BUY / SELL Toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted">
        <button
          onClick={() => setSide('BUY')}
          className={cn("py-2 rounded-md text-xs font-bold transition-all", side === 'BUY' ? "bg-[hsl(var(--status-live))] text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          <TrendingUp className="h-3 w-3 inline mr-1" />BUY
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={cn("py-2 rounded-md text-xs font-bold transition-all", side === 'SELL' ? "bg-[hsl(var(--status-closed))] text-white shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          <TrendingDown className="h-3 w-3 inline mr-1" />SELL
        </button>
      </div>

      {/* Product Type */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">Product</Label>
        <div className="flex gap-1">
          {productOptions.map((p) => (
            <button
              key={p}
              onClick={() => setProductType(p)}
              className={cn("flex-1 py-1.5 rounded text-xs font-medium border transition-all", productType === p ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-border/80")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Order Type */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">Order Type</Label>
        <div className="grid grid-cols-2 gap-1">
          {(['MARKET', 'LIMIT', 'SL', 'SL-M'] as OrderType[]).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={cn("py-1.5 rounded text-xs font-medium border transition-all", orderType === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-border/80")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">
          Qty {(segment === 'FUT' || segment === 'OPT') && <span className="text-[10px]">(lots) × {lotSize} = {effectiveQty} shares</span>}
        </Label>
        <Input
          type="number"
          value={qty}
          onChange={e => setQty(e.target.value)}
          min="1"
          className="h-8 text-sm font-mono"
        />
      </div>

      {/* Price (for LIMIT & SL) */}
      {(orderType === 'LIMIT' || orderType === 'SL') && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Price</Label>
          <Input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder={ltp.toFixed(2)}
            className="h-8 text-sm font-mono"
          />
        </div>
      )}

      {/* Trigger Price (for SL & SL-M) */}
      {(orderType === 'SL' || orderType === 'SL-M') && (
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Trigger Price</Label>
          <Input
            type="number"
            value={triggerPrice}
            onChange={e => setTriggerPrice(e.target.value)}
            placeholder={ltp.toFixed(2)}
            className="h-8 text-sm font-mono"
          />
        </div>
      )}

      {/* Order Summary */}
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Exec. Price</span>
          <span className="font-mono">{formatINR(executionPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-mono">{effectiveQty.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Value</span>
          <span className="font-mono">{formatINR(totalValue)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5">
          <span className="text-muted-foreground font-medium">Req. Margin</span>
          <span className={cn("font-mono font-bold", canAfford ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {formatINR(requiredMargin)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Available</span>
          <span className="font-mono">{formatINR(availableBalance)}</span>
        </div>
      </div>

      {!canAfford && (
        <div className="flex items-center gap-2 text-xs text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)] rounded-lg p-2 border border-[hsl(var(--status-closed)/0.2)]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Insufficient margin
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canAfford || Number(qty) <= 0}
        className={cn("w-full font-bold text-sm h-10 mt-auto", side === 'BUY' ? "bg-[hsl(var(--status-live))] hover:bg-[hsl(var(--status-live)/0.9)]" : "bg-[hsl(var(--status-closed))] hover:bg-[hsl(var(--status-closed)/0.9)]")}
      >
        {side} {stock.symbol}
      </Button>
    </div>
  );
}
