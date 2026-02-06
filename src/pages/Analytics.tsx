import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AIVerdictBadge } from "@/components/AIVerdictBadge";
import { mockIPOs, sectorDistribution, monthlyGMPTrends, gmpDistribution, getGMPPercentage } from "@/data/mockData";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const Analytics = () => {
  const bullishCount = mockIPOs.filter((i) => i.aiVerdict === "BUY").length;
  const bearishCount = mockIPOs.filter((i) => i.aiVerdict === "AVOID").length;
  const avgGMP = Math.round(mockIPOs.filter((i) => i.gmp > 0).reduce((s, i) => s + i.gmp, 0) / mockIPOs.filter((i) => i.gmp > 0).length);
  const topPerformers = [...mockIPOs].filter((i) => i.gmp > 0).sort((a, b) => getGMPPercentage(b) - getGMPPercentage(a));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Analytics</span>
        </nav>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">GMP Analytics & Market Trends</h1>
          <p className="text-sm text-muted-foreground">Market sentiment analysis and IPO performance metrics</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total IPOs", value: mockIPOs.length, icon: BarChart3, accent: "text-primary" },
            { label: "Avg GMP", value: `₹${avgGMP}`, icon: TrendingUp, accent: "text-status-live" },
            { label: "Bullish Picks", value: bullishCount, icon: TrendingUp, accent: "text-verdict-buy" },
            { label: "Bearish Picks", value: bearishCount, icon: TrendingDown, accent: "text-verdict-avoid" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={cn("h-5 w-5", stat.accent)} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold font-mono">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* GMP Distribution */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">GMP Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gmpDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sector Breakdown */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sector Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {sectorDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly GMP Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyGMPTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`₹${value}`, "Avg GMP"]}
                  />
                  <Line type="monotone" dataKey="avgGMP" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🏆 Top Performers by GMP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>GMP</TableHead>
                    <TableHead>GMP %</TableHead>
                    <TableHead>AI Verdict</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((ipo, index) => (
                    <TableRow key={ipo.id} className="cursor-pointer">
                      <TableCell className="font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        <Link to={`/ipo/${ipo.id}`} className="font-semibold text-sm hover:text-primary transition-colors">
                          {ipo.companyName}
                        </Link>
                        <p className="text-[10px] text-muted-foreground">{ipo.sector}</p>
                      </TableCell>
                      <TableCell className="font-mono font-bold text-sm">₹{ipo.gmp}</TableCell>
                      <TableCell>
                        <span className="text-status-live font-semibold text-sm font-mono">
                          +{getGMPPercentage(ipo)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <AIVerdictBadge verdict={ipo.aiVerdict} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
