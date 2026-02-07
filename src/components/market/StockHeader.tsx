import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { type Stock, getChangePercent, getChangeAmount, formatVolume, formatMarketCap } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface StockHeaderProps {
  stock: Stock;
}

export function StockHeader({ stock }: StockHeaderProps) {
  const change = getChangePercent(stock);
  const changeAmt = getChangeAmount(stock);
  const isPositive = change >= 0;

  const metrics = [
    { label: "Day High", value: `₹${stock.dayHigh.toLocaleString()}` },
    { label: "Day Low", value: `₹${stock.dayLow.toLocaleString()}` },
    { label: "52W High", value: `₹${stock.weekHigh52.toLocaleString()}` },
    { label: "52W Low", value: `₹${stock.weekLow52.toLocaleString()}` },
    { label: "Volume", value: formatVolume(stock.volume) },
    { label: "Mkt Cap", value: formatMarketCap(stock.fundamentals.marketCap) },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Stock info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight">{stock.symbol}</h2>
              <Badge variant="outline" className="text-[10px] font-mono">{stock.exchange}</Badge>
              <Badge variant="secondary" className="text-[10px]">{stock.sector}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>

          {/* Price info */}
          <div className="flex items-end gap-3 sm:text-right">
            <div>
              <p className="text-2xl sm:text-3xl font-mono font-bold">₹{stock.livePrice.toLocaleString()}</p>
              <div className={cn("flex items-center gap-1.5 text-sm font-mono font-medium", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span>{isPositive ? "+" : ""}{changeAmt}</span>
                <span>({isPositive ? "+" : ""}{change}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4 pt-4 border-t border-border/50">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <p className="text-sm font-mono font-semibold mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
