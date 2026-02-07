import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { getTopGainers, getTopLosers, getMostActive, getChangePercent, getChangeAmount, formatVolume, type Stock } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface TopMoversProps {
  onSelectStock: (stock: Stock) => void;
}

function MoverRow({ stock, type, onSelect }: { stock: Stock; type: "gainer" | "loser" | "active"; onSelect: (s: Stock) => void }) {
  const change = getChangePercent(stock);
  const changeAmt = getChangeAmount(stock);
  const isPositive = change >= 0;

  return (
    <button
      onClick={() => onSelect(stock)}
      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 rounded-lg transition-colors"
    >
      <div className="min-w-0 text-left">
        <p className="font-mono font-semibold text-sm">{stock.symbol}</p>
        <p className="text-[10px] text-muted-foreground truncate">{stock.sector}</p>
      </div>
      <div className="text-right ml-3 shrink-0">
        <p className="font-mono text-sm">₹{stock.livePrice.toLocaleString()}</p>
        {type === "active" ? (
          <p className="text-[10px] text-muted-foreground font-mono">Vol: {formatVolume(stock.volume)}</p>
        ) : (
          <p className={cn("text-xs font-mono font-medium", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
            {isPositive ? "+" : ""}{changeAmt} ({isPositive ? "+" : ""}{change}%)
          </p>
        )}
      </div>
    </button>
  );
}

export function TopMovers({ onSelectStock }: TopMoversProps) {
  const gainers = getTopGainers(5);
  const losers = getTopLosers(5);
  const active = getMostActive(5);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Market Movers</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="w-full h-9 mb-2">
            <TabsTrigger value="gainers" className="flex-1 gap-1 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex-1 gap-1 text-xs">
              <TrendingDown className="h-3.5 w-3.5" />
              Losers
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 gap-1 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              Most Active
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-0.5 mt-0">
            {gainers.map((s) => (
              <MoverRow key={s.symbol} stock={s} type="gainer" onSelect={onSelectStock} />
            ))}
          </TabsContent>
          <TabsContent value="losers" className="space-y-0.5 mt-0">
            {losers.map((s) => (
              <MoverRow key={s.symbol} stock={s} type="loser" onSelect={onSelectStock} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="space-y-0.5 mt-0">
            {active.map((s) => (
              <MoverRow key={s.symbol} stock={s} type="active" onSelect={onSelectStock} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
