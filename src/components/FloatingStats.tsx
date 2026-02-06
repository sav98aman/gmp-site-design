import { TrendingUp } from "lucide-react";
import type { IPO } from "@/data/mockData";

interface FloatingStatsProps {
  ipos: IPO[];
}

export function FloatingStats({ ipos }: FloatingStatsProps) {
  const bullish = ipos.filter((i) => i.aiVerdict === "BUY").length;
  const liveIPOs = ipos.filter((i) => i.status === "live");
  const avgGMP = liveIPOs.length
    ? Math.round(liveIPOs.reduce((s, i) => s + i.gmp, 0) / liveIPOs.length)
    : 0;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:flex items-center gap-3 bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-full px-4 py-2.5 text-xs animate-slide-up">
      <TrendingUp className="h-4 w-4 text-primary" />
      <div className="flex items-center gap-3 divide-x divide-border">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Bullish</span>
          <span className="font-bold font-mono text-status-live">{bullish}</span>
        </div>
        <div className="flex items-center gap-1.5 pl-3">
          <span className="text-muted-foreground">Avg GMP</span>
          <span className="font-bold font-mono">₹{avgGMP}</span>
        </div>
      </div>
    </div>
  );
}
