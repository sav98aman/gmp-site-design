import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { type Stock } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface CombinedAnalysisProps {
  stock: Stock;
}

function getVerdictStyle(verdict: string): { bg: string; text: string; border: string; icon: React.ReactNode } {
  switch (verdict) {
    case "Bullish":
      return { bg: "bg-[hsl(var(--status-live))]/10", text: "text-[hsl(var(--status-live))]", border: "border-[hsl(var(--status-live))]/30", icon: <TrendingUp className="h-5 w-5" /> };
    case "Moderately Bullish":
      return { bg: "bg-[hsl(var(--status-live))]/5", text: "text-[hsl(var(--status-live))]", border: "border-[hsl(var(--status-live))]/20", icon: <TrendingUp className="h-5 w-5" /> };
    case "Neutral":
      return { bg: "bg-[hsl(var(--verdict-neutral))]/10", text: "text-[hsl(var(--verdict-neutral))]", border: "border-[hsl(var(--verdict-neutral))]/30", icon: <Minus className="h-5 w-5" /> };
    case "Moderately Bearish":
      return { bg: "bg-[hsl(var(--status-closed))]/5", text: "text-[hsl(var(--status-closed))]", border: "border-[hsl(var(--status-closed))]/20", icon: <TrendingDown className="h-5 w-5" /> };
    case "Bearish":
      return { bg: "bg-[hsl(var(--status-closed))]/10", text: "text-[hsl(var(--status-closed))]", border: "border-[hsl(var(--status-closed))]/30", icon: <TrendingDown className="h-5 w-5" /> };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: <Minus className="h-5 w-5" /> };
  }
}

function getScoreDetails(score: number): { label: string; color: string; icon: React.ReactNode } {
  if (score >= 70) return { label: "Strong", color: "text-[hsl(var(--status-live))]", icon: <CheckCircle className="h-4 w-4" /> };
  if (score >= 50) return { label: "Moderate", color: "text-[hsl(var(--verdict-hold))]", icon: <AlertTriangle className="h-4 w-4" /> };
  return { label: "Weak", color: "text-[hsl(var(--status-closed))]", icon: <XCircle className="h-4 w-4" /> };
}

export function CombinedAnalysis({ stock }: CombinedAnalysisProps) {
  const style = getVerdictStyle(stock.combinedVerdict);
  const scoreDetails = getScoreDetails(stock.combinedScore);

  // Derive simple pros/cons from data
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (stock.fundamentals.roe > 15) strengths.push("Strong Return on Equity");
  if (stock.fundamentals.pe < 25) strengths.push("Attractive valuation (low PE)");
  if (stock.fundamentals.debtToEquity < 0.5) strengths.push("Low debt levels");
  if (stock.fundamentals.revenueGrowth > 15) strengths.push("Strong revenue growth");
  if (stock.fundamentals.netProfitGrowth > 20) strengths.push("Excellent profit growth");
  if (stock.technicals.rsi > 50 && stock.technicals.rsi < 70) strengths.push("Healthy RSI momentum");
  if (stock.livePrice > stock.technicals.sma200) strengths.push("Trading above 200-DMA");
  if (stock.fundamentals.dividendYield > 1) strengths.push("Good dividend payer");

  if (stock.fundamentals.pe > 40) weaknesses.push("Expensive valuation (high PE)");
  if (stock.fundamentals.debtToEquity > 1) weaknesses.push("High debt burden");
  if (stock.fundamentals.revenueGrowth < 5) weaknesses.push("Slow revenue growth");
  if (stock.fundamentals.netProfitGrowth < 0) weaknesses.push("Declining profits");
  if (stock.technicals.rsi > 70) weaknesses.push("RSI indicates overbought");
  if (stock.technicals.rsi < 30) weaknesses.push("RSI indicates oversold");
  if (stock.livePrice < stock.technicals.sma200) weaknesses.push("Trading below 200-DMA");
  if (stock.technicals.macd.histogram < 0) weaknesses.push("MACD bearish crossover");

  return (
    <Card className={cn("border", style.border)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Combined Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Verdict */}
        <div className={cn("flex items-center justify-between p-4 rounded-xl", style.bg)}>
          <div className="flex items-center gap-3">
            <div className={style.text}>{style.icon}</div>
            <div>
              <p className={cn("font-bold text-lg", style.text)}>{stock.combinedVerdict}</p>
              <p className="text-xs text-muted-foreground">Overall Verdict</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className={cn("text-2xl font-mono font-bold", scoreDetails.color)}>{stock.combinedScore}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className={cn("flex items-center gap-1 text-xs font-medium", scoreDetails.color)}>
              {scoreDetails.icon}
              {scoreDetails.label}
            </div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="relative h-3 rounded-full overflow-hidden bg-muted">
          <div
            className={cn(
              "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
              stock.combinedScore >= 70 ? "bg-[hsl(var(--status-live))]" : stock.combinedScore >= 50 ? "bg-[hsl(var(--verdict-hold))]" : "bg-[hsl(var(--status-closed))]"
            )}
            style={{ width: `${stock.combinedScore}%` }}
          />
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">{stock.combinedSummary}</p>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[hsl(var(--status-live))] uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Strengths
              </h4>
              <ul className="space-y-1.5">
                {strengths.slice(0, 4).map((s) => (
                  <li key={s} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-[hsl(var(--status-live))] mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[hsl(var(--status-closed))] uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Weaknesses
              </h4>
              <ul className="space-y-1.5">
                {weaknesses.slice(0, 4).map((w) => (
                  <li key={w} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-[hsl(var(--status-closed))] mt-0.5">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
