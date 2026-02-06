import { Link } from "react-router-dom";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./CountdownTimer";
import { AIVerdictBadge } from "./AIVerdictBadge";
import type { IPO } from "@/data/mockData";
import { getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface IPOTableProps {
  ipos: IPO[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

const statusStyles: Record<string, string> = {
  live: "bg-status-live/15 text-status-live border-status-live/25",
  upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
  closed: "bg-status-closed/15 text-status-closed border-status-closed/25",
  listed: "bg-status-listed/15 text-status-listed border-status-listed/25",
};

function SortIcon({ field, sortField, sortDirection }: { field: string; sortField: string; sortDirection: string }) {
  if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
  return sortDirection === "asc" ? (
    <ArrowUp className="h-3 w-3 ml-1" />
  ) : (
    <ArrowDown className="h-3 w-3 ml-1" />
  );
}

export function IPOTable({ ipos, sortField, sortDirection, onSort }: IPOTableProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>
              <button onClick={() => onSort("gmp")} className="flex items-center font-medium">
                GMP <SortIcon field="gmp" sortField={sortField} sortDirection={sortDirection} />
              </button>
            </TableHead>
            <TableHead className="hidden lg:table-cell">Price Range</TableHead>
            <TableHead className="hidden xl:table-cell">
              <button onClick={() => onSort("subscription")} className="flex items-center font-medium">
                Subscription <SortIcon field="subscription" sortField={sortField} sortDirection={sortDirection} />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">Dates</TableHead>
            <TableHead className="hidden lg:table-cell">Timer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI Verdict</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ipos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                No IPOs found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            ipos.map((ipo) => (
              <TableRow key={ipo.id} className="group cursor-pointer transition-colors">
                <TableCell>
                  <Link to={`/ipo/${ipo.id}`} className="block">
                    <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {ipo.companyName}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{ipo.sector}</span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 font-medium">
                        {ipo.boardType}
                      </Badge>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/ipo/${ipo.id}`} className="block">
                    <div className="font-bold font-mono text-sm">
                      {ipo.status === "listed" ? "—" : `₹${ipo.gmp}`}
                    </div>
                    {ipo.status !== "listed" && (
                      <span className={cn(
                        "text-[10px] font-semibold",
                        ipo.gmp > 0 ? "text-status-live" : "text-status-closed"
                      )}>
                        {ipo.gmp > 0 ? "+" : ""}{getGMPPercentage(ipo)}%
                      </span>
                    )}
                    {ipo.status === "listed" && ipo.listingGain !== undefined && (
                      <span className="text-[10px] font-semibold text-status-live">
                        Listed +{ipo.listingGain}%
                      </span>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="font-mono text-xs">₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}</span>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {ipo.subscription.total > 0 ? (
                    <span className="font-mono text-xs font-semibold">{ipo.subscription.total}x</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-xs text-muted-foreground">
                    <div>{new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    <div>{new Date(ipo.closeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {(ipo.status === "live" || ipo.status === "upcoming") ? (
                    <CountdownTimer
                      targetDate={ipo.status === "upcoming" ? ipo.openDate : ipo.closeDate}
                      compact
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize",
                    statusStyles[ipo.status]
                  )}>
                    {ipo.status}
                  </span>
                </TableCell>
                <TableCell>
                  <AIVerdictBadge verdict={ipo.aiVerdict} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
