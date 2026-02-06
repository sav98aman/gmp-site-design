import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Package, DollarSign, Users, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Header } from "@/components/Header";
import { AIVerdictBadge } from "@/components/AIVerdictBadge";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SubscriptionProgress } from "@/components/SubscriptionProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIPOById, getRelatedIPOs, getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  live: "bg-status-live/15 text-status-live border-status-live/25",
  upcoming: "bg-status-upcoming/15 text-status-upcoming border-status-upcoming/25",
  closed: "bg-status-closed/15 text-status-closed border-status-closed/25",
  listed: "bg-status-listed/15 text-status-listed border-status-listed/25",
};

const IPODetail = () => {
  const { ipoId } = useParams<{ ipoId: string }>();
  const ipo = getIPOById(ipoId || "");

  if (!ipo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">IPO Not Found</h1>
          <p className="text-muted-foreground mb-6">The IPO you're looking for doesn't exist.</p>
          <Link to="/"><Button>Back to Dashboard</Button></Link>
        </main>
      </div>
    );
  }

  const gmpPct = getGMPPercentage(ipo);
  const relatedIPOs = getRelatedIPOs(ipo);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Company Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{ipo.companyName}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">{ipo.sector}</span>
              <Badge variant="outline" className="text-xs">{ipo.boardType}</Badge>
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize", statusStyles[ipo.status])}>
                {ipo.status}
              </span>
            </div>
          </div>
          <AIVerdictBadge verdict={ipo.aiVerdict} size="lg" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "GMP", value: `₹${ipo.gmp}`, sub: `${gmpPct > 0 ? "+" : ""}${gmpPct}%`, icon: TrendingUp, subColor: gmpPct > 0 ? "text-status-live" : "text-status-closed" },
            { label: "Price Range", value: `₹${ipo.priceRange.min}-${ipo.priceRange.max}`, icon: DollarSign },
            { label: "Lot Size", value: `${ipo.lotSize} shares`, icon: Package },
            { label: "Issue Size", value: `₹${ipo.issueSize} Cr`, icon: DollarSign },
            { label: "Total Subs", value: ipo.subscription.total > 0 ? `${ipo.subscription.total}x` : "—", icon: Users },
            { label: "Open Date", value: new Date(ipo.openDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), icon: Calendar },
          ].map((metric) => (
            <Card key={metric.label} className="border-border/50">
              <CardContent className="p-3 space-y-1">
                <div className="flex items-center gap-1.5">
                  <metric.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">{metric.label}</span>
                </div>
                <p className="font-bold font-mono text-lg">{metric.value}</p>
                {metric.sub && <p className={cn("text-xs font-semibold", metric.subColor)}>{metric.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Countdown */}
        {(ipo.status === "live" || ipo.status === "upcoming") && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <span className="text-sm font-medium">
                {ipo.status === "upcoming" ? "Opens in" : "Closes in"}
              </span>
              <CountdownTimer targetDate={ipo.status === "upcoming" ? ipo.openDate : ipo.closeDate} />
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Analysis */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                🤖 AI Analysis
                <AIVerdictBadge verdict={ipo.aiVerdict} size="md" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{ipo.aiAnalysis}</p>
            </CardContent>
          </Card>

          {/* GMP History Chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📈 GMP History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ipo.gmpHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [`₹${value}`, "GMP"]}
                    />
                    <Line type="monotone" dataKey="gmp" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Progress */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">📊 Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SubscriptionProgress label="Retail" value={ipo.subscription.retail} />
            <SubscriptionProgress label="QIB" value={ipo.subscription.qib} maxValue={30} />
            <SubscriptionProgress label="NII / HNI" value={ipo.subscription.nii} />
            <div className="pt-2 border-t border-border">
              <SubscriptionProgress label="Total" value={ipo.subscription.total} maxValue={25} />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">About {ipo.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{ipo.description}</p>
          </CardContent>
        </Card>

        {/* Related IPOs */}
        {relatedIPOs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Related IPOs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedIPOs.map((r) => (
                <Link to={`/ipo/${r.id}`} key={r.id}>
                  <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{r.companyName}</p>
                        <p className="text-[10px] text-muted-foreground">{r.sector}</p>
                      </div>
                      <span className="font-mono font-bold text-sm ml-2">₹{r.gmp}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default IPODetail;
