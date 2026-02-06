import { TrendingUp, BarChart3, ArrowUpRight, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IPO } from "@/data/mockData";
import { getGMPPercentage } from "@/data/mockData";

interface QuickStatsProps {
  ipos: IPO[];
}

export function QuickStats({ ipos }: QuickStatsProps) {
  const liveIPOs = ipos.filter((i) => i.status === "live");
  const avgGMP = liveIPOs.length
    ? Math.round(liveIPOs.reduce((sum, i) => sum + i.gmp, 0) / liveIPOs.length)
    : 0;
  const bullishCount = ipos.filter((i) => i.aiVerdict === "BUY").length;
  const topPerformer = [...ipos]
    .filter((i) => i.status === "live" || i.status === "upcoming")
    .sort((a, b) => getGMPPercentage(b) - getGMPPercentage(a))[0];

  const stats = [
    {
      label: "Live IPOs",
      value: liveIPOs.length,
      icon: Activity,
      accent: "text-status-live",
      bg: "bg-status-live/10",
    },
    {
      label: "Average GMP",
      value: `₹${avgGMP}`,
      icon: BarChart3,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Bullish Picks",
      value: bullishCount,
      icon: TrendingUp,
      accent: "text-verdict-buy",
      bg: "bg-verdict-buy/10",
    },
    {
      label: "Top Performer",
      value: topPerformer
        ? `+${getGMPPercentage(topPerformer)}%`
        : "—",
      subtitle: topPerformer?.companyName?.split(" ")[0],
      icon: ArrowUpRight,
      accent: "text-status-live",
      bg: "bg-status-live/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight font-mono">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{stat.subtitle}</p>
                )}
              </div>
              <div className={cn(stat.bg, "p-2 rounded-lg")}>
                <stat.icon className={cn("h-4 w-4", stat.accent)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
