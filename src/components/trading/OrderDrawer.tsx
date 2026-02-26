import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { type Stock } from "@/data/mockStockData";
import {
  type Segment, type OrderType, type OrderSide,
  type Order, formatINR, getLotSize, PRODUCT_TYPES
} from "@/data/paperTradingData";
import { TrendingUp, TrendingDown, AlertCircle, Zap } from "lucide-react";

interface OrderDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: Stock | null;
  availableBalance: number;
  onPlaceOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  segment: Segment;
  defaultSide: OrderSide;
  selectedExpiry?: string;
  selectedStrike?: number;
  selectedOptionType?: 'CE' | 'PE';
  futurePrice?: number;
}

export function OrderDrawer({
  open, onOpenChange, stock, availableBalance, onPlaceOrder,
  segment, defaultSide, selectedExpiry, selectedStrike, selectedOptionType, futurePrice
}: OrderDrawerProps) {
  const [side, setSide] = useState<OrderSide>(defaultSide);
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [productType, setProductType] = useState<'MIS' | 'NRML' | 'CNC'>('MIS');

  useEffect(() => {
    setSide(defaultSide);
  }, [defaultSide]);

  useEffect(() => {
    if (open) {
      setOrderType('MARKET');
      setQty('1');
      setPrice('');
      setTriggerPrice('');
    }
  }, [open]);

  if (!stock) return null;

  const ltp = segment === 'FUT' ? (futurePrice ?? stock.livePrice) : stock.livePrice;
  const lotSize = getLotSize(stock.symbol);
  const effectiveQty = (segment === 'FUT' || segment === 'OPT') ? Number(qty) * lotSize : Number(qty);
  const executionPrice = orderType === 'MARKET' ? ltp : Number(price) || ltp;
  const totalValue = effectiveQty * executionPrice;
  const requiredMargin = segment === 'EQ' || segment === 'CNC' ? totalValue : totalValue * 0.12;
  const canAfford = requiredMargin <= availableBalance;
  const productOptions = PRODUCT_TYPES[segment];

  const handleSubmit = () => {
    const orderPrice = orderType === 'MARKET' ? ltp : Number(price);
    onPlaceOrder({
      symbol: stock.symbol, segment, side, orderType,
      qty: effectiveQty, price: orderPrice,
      triggerPrice: (orderType === 'SL' || orderType === 'SL-M') ? Number(triggerPrice) : undefined,
      productType, expiry: selectedExpiry, strikePrice: selectedStrike,
      optionType: selectedOptionType,
      lotSize: (segment === 'FUT' || segment === 'OPT') ? lotSize : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4 pb-6">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" />
            {side} {stock.symbol}
            <Badge variant="outline" className="text-[10px] ml-auto">{segment}</Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Stock info */}
        <div className="flex items-center justify-between py-2 border-b border-border mb-3">
          <div>
            <span className="font-bold text-sm">{stock.symbol}</span>
            {selectedExpiry && <span className="text-xs text-muted-foreground ml-1.5">{selectedExpiry}</span>}
            {selectedStrike && selectedOptionType && (
              <Badge variant="outline" className="ml-1.5 text-[10px] px-1 py-0">{selectedStrike} {selectedOptionType}</Badge>
            )}
          </div>
          <div className="font-mono text-base font-bold">{formatINR(ltp)}</div>
        </div>

        <div className="space-y-3">
          {/* BUY / SELL */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted">
            <button
              onClick={() => setSide('BUY')}
              className={cn("py-2.5 rounded-lg text-sm font-bold transition-all", side === 'BUY' ? "bg-[hsl(var(--status-live))] text-white shadow-md" : "text-muted-foreground hover:text-foreground")}
            >
              <TrendingUp className="h-4 w-4 inline mr-1.5" />BUY
            </button>
            <button
              onClick={() => setSide('SELL')}
              className={cn("py-2.5 rounded-lg text-sm font-bold transition-all", side === 'SELL' ? "bg-[hsl(var(--status-closed))] text-white shadow-md" : "text-muted-foreground hover:text-foreground")}
            >
              <TrendingDown className="h-4 w-4 inline mr-1.5" />SELL
            </button>
          </div>

          {/* Product + Order Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Product</Label>
              <div className="flex gap-1">
                {productOptions.map(p => (
                  <button key={p} onClick={() => setProductType(p)}
                    className={cn("flex-1 py-1.5 rounded-md text-xs font-medium border transition-all", productType === p ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground")}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Order Type</Label>
              <div className="grid grid-cols-2 gap-1">
                {(['MARKET', 'LIMIT', 'SL', 'SL-M'] as OrderType[]).map(t => (
                  <button key={t} onClick={() => setOrderType(t)}
                    className={cn("py-1.5 rounded-md text-xs font-medium border transition-all", orderType === t ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground")}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Qty + Price row */}
          <div className={cn("grid gap-3", (orderType === 'LIMIT' || orderType === 'SL') ? "grid-cols-2" : "grid-cols-1")}>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Qty {(segment === 'FUT' || segment === 'OPT') && <span className="text-[10px]">(lots × {lotSize})</span>}
              </Label>
              <Input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" className="h-9 text-sm font-mono" />
            </div>
            {(orderType === 'LIMIT' || orderType === 'SL') && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Price</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={ltp.toFixed(2)} className="h-9 text-sm font-mono" />
              </div>
            )}
          </div>

          {(orderType === 'SL' || orderType === 'SL-M') && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Trigger Price</Label>
              <Input type="number" value={triggerPrice} onChange={e => setTriggerPrice(e.target.value)} placeholder={ltp.toFixed(2)} className="h-9 text-sm font-mono" />
            </div>
          )}

          {/* Summary */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-mono font-semibold">{effectiveQty.toLocaleString()} shares</span>
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
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.1)] rounded-lg p-2.5 border border-[hsl(var(--status-closed)/0.2)]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Insufficient margin for this order
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canAfford || Number(qty) <= 0}
            className={cn(
              "w-full font-bold text-sm h-12 rounded-xl",
              side === 'BUY'
                ? "bg-[hsl(var(--status-live))] hover:bg-[hsl(var(--status-live)/0.9)]"
                : "bg-[hsl(var(--status-closed))] hover:bg-[hsl(var(--status-closed)/0.9)]"
            )}
          >
            {side === 'BUY' ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
            {side} {stock.symbol} · {formatINR(totalValue)}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
