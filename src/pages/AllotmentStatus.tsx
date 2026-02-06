import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Search, ChevronDown, ChevronRight, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { mockIPOs, getGMPPercentage } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  live: "bg-status-live/15 text-status-live border-status-live/25",
  upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
  closed: "bg-status-closed/15 text-status-closed border-status-closed/25",
  listed: "bg-status-listed/15 text-status-listed border-status-listed/25",
};

const AllotmentStatus = () => {
  const isMobile = useIsMobile();
  const [boardFilter, setBoardFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  const filteredIPOs = useMemo(() => {
    return mockIPOs
      .filter((ipo) => ipo.status === "closed" || ipo.status === "listed")
      .filter((ipo) => {
        if (boardFilter !== "all" && ipo.boardType !== boardFilter) return false;
        if (searchQuery && !ipo.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
  }, [boardFilter, searchQuery]);

  const boardTabs = [
    { value: "all", label: "All" },
    { value: "Mainboard", label: "Mainboard" },
    { value: "SME", label: "SME" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Allotment Status</span>
        </nav>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">IPO Allotment Status</h1>
          <p className="text-sm text-muted-foreground">Check your IPO allotment status via registrar links</p>
        </div>

        {/* How-to Guide */}
        <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
          <Card className="border-primary/20 bg-primary/5">
            <CollapsibleTrigger className="w-full">
              <CardContent className="p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">How to Check Allotment Status</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", guideOpen && "rotate-180")} />
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground space-y-2">
                <p><strong>Step 1:</strong> Click "Check Status" for the IPO you applied for</p>
                <p><strong>Step 2:</strong> Select the registrar (Link Intime, KFintech, or BigShare)</p>
                <p><strong>Step 3:</strong> Enter your PAN number or Application Number</p>
                <p><strong>Step 4:</strong> Submit to view your allotment status</p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex bg-muted rounded-lg p-1 gap-0.5">
            {boardTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setBoardFilter(tab.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  boardFilter === tab.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search IPO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Allotment Table / Cards */}
        {isMobile ? (
          <div className="space-y-3">
            {filteredIPOs.map((ipo) => (
              <Card key={ipo.id} className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{ipo.companyName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{ipo.boardType}</Badge>
                        <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border capitalize", statusStyles[ipo.status])}>
                          {ipo.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold">₹{ipo.priceRange.min}-{ipo.priceRange.max}</p>
                      {ipo.subscription.total > 0 && (
                        <p className="text-[10px] text-muted-foreground">{ipo.subscription.total}x subscribed</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {ipo.listingDate ? `Listed: ${new Date(ipo.listingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : `Closes: ${new Date(ipo.closeDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    </div>
                    <a href={ipo.registrarUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        Check Status <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Company</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Listing Date</TableHead>
                  <TableHead>GMP</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIPOs.map((ipo) => (
                  <TableRow key={ipo.id}>
                    <TableCell>
                      <div className="font-semibold text-sm">{ipo.companyName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{ipo.boardType}</Badge>
                        <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold border capitalize", statusStyles[ipo.status])}>
                          {ipo.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold">
                      {ipo.subscription.total > 0 ? `${ipo.subscription.total}x` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold">₹{ipo.gmp}</span>
                      <span className={cn("ml-1 text-[10px] font-semibold", ipo.gmp > 0 ? "text-status-live" : "text-muted-foreground")}>
                        ({ipo.gmp > 0 ? "+" : ""}{getGMPPercentage(ipo)}%)
                      </span>
                    </TableCell>
                    <TableCell>
                      <a href={ipo.registrarUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          Check Status <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllotmentStatus;
