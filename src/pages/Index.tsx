import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { QuickStats } from "@/components/QuickStats";
import { FilterBar } from "@/components/FilterBar";
import { IPOTable } from "@/components/IPOTable";
import { IPOCard } from "@/components/IPOCard";
import { GMPTrendCard } from "@/components/GMPTrendCard";
import { FloatingStats } from "@/components/FloatingStats";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockIPOs, getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Index = () => {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState("all");
  const [boardFilter, setBoardFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("gmp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredIPOs = useMemo(() => {
    return mockIPOs
      .filter((ipo) => {
        if (statusFilter !== "all" && ipo.status !== statusFilter) return false;
        if (boardFilter !== "all" && ipo.boardType !== boardFilter) return false;
        if (searchQuery && !ipo.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        let aVal = 0, bVal = 0;
        if (sortField === "gmp") { aVal = a.gmp; bVal = b.gmp; }
        else if (sortField === "subscription") { aVal = a.subscription.total; bVal = b.subscription.total; }
        return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
      });
  }, [statusFilter, boardFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const trendIPOs = mockIPOs.filter((i) => i.status === "live" || i.status === "upcoming").sort((a, b) => getGMPPercentage(b) - getGMPPercentage(a));
  const listedIPOs = mockIPOs.filter((i) => i.status === "listed");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">IPO Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track real-time grey market premiums & AI-powered IPO analysis</p>
        </div>

        <QuickStats ipos={mockIPOs} />
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          boardFilter={boardFilter}
          onBoardChange={setBoardFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isMobile ? (
          <div className="space-y-3">
            {filteredIPOs.map((ipo) => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
            {filteredIPOs.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No IPOs found.</p>
            )}
          </div>
        ) : (
          <IPOTable ipos={filteredIPOs} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
        )}

        {/* GMP Trends Section */}
        {trendIPOs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">📈 GMP Trends</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trendIPOs.map((ipo) => (
                <Link to={`/ipo/${ipo.id}`} key={ipo.id}>
                  <GMPTrendCard ipo={ipo} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Listed Section */}
        {listedIPOs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">🏆 Recently Listed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {listedIPOs.map((ipo) => (
                <Link to={`/ipo/${ipo.id}`} key={ipo.id}>
                  <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{ipo.companyName}</p>
                        <p className="text-[10px] text-muted-foreground">{ipo.sector}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        {ipo.listingGain !== undefined && (
                          <span className="font-mono font-bold text-status-live text-lg">
                            +{ipo.listingGain}%
                          </span>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                          Listed ₹{ipo.listingPrice}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <FloatingStats ipos={mockIPOs} />
    </div>
  );
};

export default Index;
