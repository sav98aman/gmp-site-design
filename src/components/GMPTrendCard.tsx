import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { IPO } from "@/data/mockData";
import { getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface GMPTrendCardProps {
  ipo: IPO;
}

export function GMPTrendCard({ ipo }: GMPTrendCardProps) {
  const gmpPct = getGMPPercentage(ipo);
  const isPositive = ipo.gmp > 0;

  return (
    <Card className="min-w-[180px] border-border/50 hover:border-primary/30 transition-all hover:shadow-sm flex-shrink-0">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{ipo.companyName}</p>
            <p className="text-[10px] text-muted-foreground">{ipo.sector}</p>
          </div>
          <span className={cn(
            "text-xs font-bold font-mono shrink-0",
            isPositive ? "text-status-live" : "text-status-closed"
          )}>
            {isPositive ? "+" : ""}{gmpPct}%
          </span>
        </div>
        <div className="h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ipo.gmpHistory}>
              <Line
                type="monotone"
                dataKey="gmp"
                stroke={isPositive ? "hsl(var(--status-live))" : "hsl(var(--status-closed))"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-sm font-bold">₹{ipo.gmp}</span>
          <span className="text-[10px] text-muted-foreground">GMP</span>
        </div>
      </CardContent>
    </Card>
  );
}
