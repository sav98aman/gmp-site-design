import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { type Stock } from "@/data/mockStockData";
import { cn } from "@/lib/utils";

interface TechnicalAnalysisProps {
  stock: Stock;
}

function getSignalColor(signal: string): string {
  if (signal.includes("Buy")) return "text-[hsl(var(--status-live))] bg-[hsl(var(--status-live))]/10 border-[hsl(var(--status-live))]/30";
  if (signal.includes("Sell")) return "text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed))]/10 border-[hsl(var(--status-closed))]/30";
  return "text-[hsl(var(--verdict-neutral))] bg-[hsl(var(--verdict-neutral))]/10 border-[hsl(var(--verdict-neutral))]/30";
}

function getRSISignal(rsi: number): { label: string; color: string } {
  if (rsi > 70) return { label: "Overbought", color: "text-[hsl(var(--status-closed))]" };
  if (rsi > 60) return { label: "Bullish", color: "text-[hsl(var(--status-live))]" };
  if (rsi > 40) return { label: "Neutral", color: "text-muted-foreground" };
  if (rsi > 30) return { label: "Bearish", color: "text-[hsl(var(--status-closed))]" };
  return { label: "Oversold", color: "text-[hsl(var(--status-closed))]" };
}

function getMACDSignal(macd: { histogram: number }): { label: string; color: string } {
  if (macd.histogram > 0) return { label: "Bullish", color: "text-[hsl(var(--status-live))]" };
  return { label: "Bearish", color: "text-[hsl(var(--status-closed))]" };
}

function IndicatorCard({ label, value, signal, signalColor }: { label: string; value: string; signal: string; signalColor: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm font-medium">{value}</p>
      </div>
      <span className={cn("text-xs font-medium", signalColor)}>{signal}</span>
    </div>
  );
}

export function TechnicalAnalysis({ stock }: TechnicalAnalysisProps) {
  const t = stock.technicals;
  const rsiSignal = getRSISignal(t.rsi);
  const macdSignal = getMACDSignal(t.macd);

  const priceVsSMA = (label: string, sma: number) => {
    const above = stock.livePrice > sma;
    return {
      label,
      value: `₹${sma.toLocaleString()}`,
      signal: above ? "Above — Bullish" : "Below — Bearish",
      signalColor: above ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]",
    };
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Technical Analysis
          </CardTitle>
          <Badge className={cn("text-xs font-medium border", getSignalColor(t.overallSignal))}>
            {t.overallSignal}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Oscillators */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Oscillators</h4>
          <IndicatorCard label="RSI (14)" value={t.rsi.toFixed(1)} signal={rsiSignal.label} signalColor={rsiSignal.color} />
          <IndicatorCard
            label="MACD (12,26,9)"
            value={`${t.macd.value.toFixed(1)} / ${t.macd.signal.toFixed(1)}`}
            signal={macdSignal.label}
            signalColor={macdSignal.color}
          />
          <IndicatorCard
            label="Stochastic %K"
            value={`${t.stochastic.k} / ${t.stochastic.d}`}
            signal={t.stochastic.k > 80 ? "Overbought" : t.stochastic.k < 20 ? "Oversold" : "Neutral"}
            signalColor={t.stochastic.k > 80 ? "text-[hsl(var(--status-closed))]" : t.stochastic.k < 20 ? "text-[hsl(var(--status-closed))]" : "text-muted-foreground"}
          />
          <IndicatorCard
            label="ADX"
            value={t.adx.toFixed(1)}
            signal={t.adx > 25 ? "Strong Trend" : "Weak Trend"}
            signalColor={t.adx > 25 ? "text-[hsl(var(--status-live))]" : "text-muted-foreground"}
          />
        </div>

        {/* Moving Averages */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Moving Averages</h4>
          <IndicatorCard {...priceVsSMA("SMA 20", t.sma20)} />
          <IndicatorCard {...priceVsSMA("SMA 50", t.sma50)} />
          <IndicatorCard {...priceVsSMA("SMA 200", t.sma200)} />
          <IndicatorCard {...priceVsSMA("EMA 12", t.ema12)} />
          <IndicatorCard {...priceVsSMA("EMA 26", t.ema26)} />
        </div>

        {/* Support & Resistance */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Key Levels</h4>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="text-center p-2.5 bg-[hsl(var(--status-live))]/5 rounded-lg border border-[hsl(var(--status-live))]/20">
              <p className="text-[10px] text-muted-foreground">Support</p>
              <p className="font-mono text-sm font-bold text-[hsl(var(--status-live))]">₹{t.support.toLocaleString()}</p>
            </div>
            <div className="text-center p-2.5 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-[10px] text-muted-foreground">Pivot</p>
              <p className="font-mono text-sm font-bold">₹{t.pivotPoint.toLocaleString()}</p>
            </div>
            <div className="text-center p-2.5 bg-[hsl(var(--status-closed))]/5 rounded-lg border border-[hsl(var(--status-closed))]/20">
              <p className="text-[10px] text-muted-foreground">Resistance</p>
              <p className="font-mono text-sm font-bold text-[hsl(var(--status-closed))]">₹{t.resistance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Bollinger & ATR */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Volatility</h4>
          <IndicatorCard label="Bollinger Upper" value={`₹${t.bollingerUpper.toLocaleString()}`} signal="" signalColor="" />
          <IndicatorCard label="Bollinger Lower" value={`₹${t.bollingerLower.toLocaleString()}`} signal="" signalColor="" />
          <IndicatorCard label="ATR (14)" value={t.atr.toFixed(1)} signal={t.atr > 50 ? "High Volatility" : "Low Volatility"} signalColor="text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
