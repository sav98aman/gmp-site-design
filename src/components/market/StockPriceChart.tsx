import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { type Stock } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

const timeRanges = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];

interface StockPriceChartProps {
  stock: Stock;
}

export function StockPriceChart({ stock }: StockPriceChartProps) {
  const [range, setRange] = useState("3M");

  const days = timeRanges.find((r) => r.label === range)?.days || 90;
  const data = stock.priceHistory.slice(-days).map((p) => ({
    date: p.date,
    price: p.close,
    volume: p.volume,
  }));

  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Price History</CardTitle>
        <div className="flex gap-1">
          {timeRanges.map((r) => (
            <Button
              key={r.label}
              variant={range === r.label ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setRange(r.label)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositive ? "hsl(var(--status-live))" : "hsl(var(--status-closed))"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositive ? "hsl(var(--status-live))" : "hsl(var(--status-closed))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
                }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v}`}
                width={65}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(var(--status-live))" : "hsl(var(--status-closed))"}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
