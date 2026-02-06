import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./CountdownTimer";
import { AIVerdictBadge } from "./AIVerdictBadge";
import type { IPO } from "@/data/mockData";
import { getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface IPOCardProps {
  ipo: IPO;
}

const statusStyles: Record<string, string> = {
  live: "bg-status-live/15 text-status-live border-status-live/25",
  upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
  closed: "bg-status-closed/15 text-status-closed border-status-closed/25",
  listed: "bg-status-listed/15 text-status-listed border-status-listed/25",
};

export function IPOCard({ ipo }: IPOCardProps) {
  const gmpPct = getGMPPercentage(ipo);

  return (
    <Link to={`/ipo/${ipo.id}`}>
      <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{ipo.companyName}</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{ipo.sector}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{ipo.boardType}</Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize",
                statusStyles[ipo.status]
              )}>
                {ipo.status}
              </span>
              <AIVerdictBadge verdict={ipo.aiVerdict} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] text-muted-foreground">GMP</p>
              <p className="font-bold font-mono text-sm">
                {ipo.status === "listed" ? "—" : `₹${ipo.gmp}`}
              </p>
              {ipo.status !== "listed" && (
                <p className={cn("text-[10px] font-semibold", gmpPct > 0 ? "text-status-live" : "text-status-closed")}>
                  {gmpPct > 0 ? "+" : ""}{gmpPct}%
                </p>
              )}
              {ipo.status === "listed" && ipo.listingGain !== undefined && (
                <p className="text-[10px] font-semibold text-status-live">+{ipo.listingGain}%</p>
              )}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Price</p>
              <p className="font-mono text-xs font-semibold">₹{ipo.priceRange.max}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Subs</p>
              <p className="font-mono text-xs font-semibold">
                {ipo.subscription.total > 0 ? `${ipo.subscription.total}x` : "—"}
              </p>
            </div>
          </div>

          {(ipo.status === "live" || ipo.status === "upcoming") && (
            <div className="pt-1 border-t border-border/50">
              <CountdownTimer
                targetDate={ipo.status === "upcoming" ? ipo.openDate : ipo.closeDate}
                label={ipo.status === "upcoming" ? "Opens in" : "Closes in"}
                compact
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
