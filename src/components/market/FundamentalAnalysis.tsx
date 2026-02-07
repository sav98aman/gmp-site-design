import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Building2, Users } from "lucide-react";
import { type Stock, formatMarketCap } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface FundamentalAnalysisProps {
  stock: Stock;
}

function MetricRow({ label, value, suffix, isGood }: { label: string; value: string | number; suffix?: string; isGood?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("font-mono text-sm font-medium", isGood === true && "text-[hsl(var(--status-live))]", isGood === false && "text-[hsl(var(--status-closed))]")}>
        {value}{suffix || ""}
      </span>
    </div>
  );
}

export function FundamentalAnalysis({ stock }: FundamentalAnalysisProps) {
  const f = stock.fundamentals;

  const valuationMetrics = [
    { label: "Market Cap", value: formatMarketCap(f.marketCap) },
    { label: "P/E Ratio", value: f.pe.toFixed(1), isGood: f.pe < 25 },
    { label: "P/B Ratio", value: f.pb.toFixed(1), isGood: f.pb < 5 },
    { label: "EPS", value: `₹${f.eps.toFixed(1)}` },
    { label: "Book Value", value: `₹${f.bookValue.toFixed(1)}` },
    { label: "Dividend Yield", value: f.dividendYield.toFixed(1), suffix: "%", isGood: f.dividendYield > 1 },
    { label: "Face Value", value: `₹${f.faceValue}` },
  ];

  const profitabilityMetrics = [
    { label: "ROE", value: f.roe.toFixed(1), suffix: "%", isGood: f.roe > 15 },
    { label: "ROCE", value: f.roce > 0 ? f.roce.toFixed(1) : "N/A", suffix: f.roce > 0 ? "%" : "", isGood: f.roce > 0 ? f.roce > 15 : undefined },
    { label: "Operating Margin", value: f.operatingMargin > 0 ? f.operatingMargin.toFixed(1) : "N/A", suffix: f.operatingMargin > 0 ? "%" : "", isGood: f.operatingMargin > 0 ? f.operatingMargin > 15 : undefined },
    { label: "Debt/Equity", value: f.debtToEquity.toFixed(2), isGood: f.debtToEquity < 0.5 },
  ];

  const growthMetrics = [
    { label: "Revenue", value: `₹${(f.revenue / 1000).toFixed(0)}K Cr` },
    { label: "Revenue Growth", value: f.revenueGrowth.toFixed(1), suffix: "%", isGood: f.revenueGrowth > 10 },
    { label: "Net Profit", value: `₹${(f.netProfit / 1000).toFixed(1)}K Cr` },
    { label: "Profit Growth", value: f.netProfitGrowth.toFixed(1), suffix: "%", isGood: f.netProfitGrowth > 0 },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Fundamental Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Valuation */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Valuation</h4>
          {valuationMetrics.map((m) => (
            <MetricRow key={m.label} {...m} />
          ))}
        </div>

        {/* Profitability */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Profitability</h4>
          {profitabilityMetrics.map((m) => (
            <MetricRow key={m.label} {...m} />
          ))}
        </div>

        {/* Growth */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Growth</h4>
          {growthMetrics.map((m) => (
            <MetricRow key={m.label} {...m} />
          ))}
        </div>

        {/* Shareholding */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shareholding Pattern</h4>
          <div className="space-y-2.5">
            {f.promoterHolding > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Promoter</span>
                  <span className="font-mono font-medium">{f.promoterHolding}%</span>
                </div>
                <Progress value={f.promoterHolding} className="h-1.5" />
              </div>
            )}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">FII</span>
                <span className="font-mono font-medium">{f.fiiHolding}%</span>
              </div>
              <Progress value={f.fiiHolding} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">DII</span>
                <span className="font-mono font-medium">{f.diiHolding}%</span>
              </div>
              <Progress value={f.diiHolding} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
