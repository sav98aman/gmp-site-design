import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { mockStocks, getChangePercent } from "@/data/mockStockData";

export function MarketOverview() {
  const gainers = mockStocks.filter((s) => getChangePercent(s) > 0).length;
  const losers = mockStocks.filter((s) => getChangePercent(s) < 0).length;
  const totalVolume = mockStocks.reduce((sum, s) => sum + s.volume, 0);
  const avgChange = mockStocks.reduce((sum, s) => sum + getChangePercent(s), 0) / mockStocks.length;

  const stats = [
    {
      label: "Advancing",
      value: gainers,
      icon: TrendingUp,
      color: "text-[hsl(var(--status-live))]",
      bg: "bg-[hsl(var(--status-live))]/10",
    },
    {
      label: "Declining",
      value: losers,
      icon: TrendingDown,
      color: "text-[hsl(var(--status-closed))]",
      bg: "bg-[hsl(var(--status-closed))]/10",
    },
    {
      label: "Avg Change",
      value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
      icon: Activity,
      color: avgChange >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]",
      bg: "bg-primary/10",
    },
    {
      label: "Total Stocks",
      value: mockStocks.length,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-3 sm:p-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
