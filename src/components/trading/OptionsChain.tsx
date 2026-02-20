import { cn } from "@/lib/utils";
import { type OptionData } from "@/data/paperTradingData";
import { Badge } from "@/components/ui/badge";

interface OptionsChainProps {
  data: OptionData[];
  spotPrice: number;
  onSelectOption: (strike: number, type: 'CE' | 'PE', ltp: number) => void;
  selectedStrike?: number;
  selectedType?: 'CE' | 'PE';
}

function formatOI(oi: number): string {
  if (oi >= 10000000) return `${(oi / 10000000).toFixed(1)}Cr`;
  if (oi >= 100000) return `${(oi / 100000).toFixed(1)}L`;
  return `${(oi / 1000).toFixed(0)}K`;
}

export function OptionsChain({ data, spotPrice, onSelectOption, selectedStrike, selectedType }: OptionsChainProps) {
  const atm = Math.round(spotPrice / 50) * 50;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-muted/50 sticky top-0 z-10">
          <tr>
            {/* CE columns */}
            <th className="px-2 py-2 text-right text-[hsl(var(--status-live))] font-medium">OI</th>
            <th className="px-2 py-2 text-right text-[hsl(var(--status-live))] font-medium">IV%</th>
            <th className="px-2 py-2 text-right text-[hsl(var(--status-live))] font-medium">Δ</th>
            <th className="px-2 py-2 text-right text-[hsl(var(--status-live))] font-medium">Chg</th>
            <th className="px-2 py-2 text-right font-bold text-[hsl(var(--status-live))] bg-[hsl(var(--status-live)/0.05)]">CE LTP</th>
            {/* Strike */}
            <th className="px-3 py-2 text-center font-bold bg-muted">STRIKE</th>
            {/* PE columns */}
            <th className="px-2 py-2 text-left font-bold text-[hsl(var(--status-closed))] bg-[hsl(var(--status-closed)/0.05)]">PE LTP</th>
            <th className="px-2 py-2 text-left text-[hsl(var(--status-closed))] font-medium">Chg</th>
            <th className="px-2 py-2 text-left text-[hsl(var(--status-closed))] font-medium">Δ</th>
            <th className="px-2 py-2 text-left text-[hsl(var(--status-closed))] font-medium">IV%</th>
            <th className="px-2 py-2 text-left text-[hsl(var(--status-closed))] font-medium">OI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {data.map(row => {
            const isATM = row.strikePrice === atm;
            const isITM_CE = row.strikePrice < spotPrice;
            const isITM_PE = row.strikePrice > spotPrice;
            const isCESelected = selectedStrike === row.strikePrice && selectedType === 'CE';
            const isPESelected = selectedStrike === row.strikePrice && selectedType === 'PE';

            return (
              <tr key={row.strikePrice} className={cn("transition-colors", isATM && "bg-primary/5")}>
                {/* CE side */}
                <td className={cn("px-2 py-2 text-right font-mono text-muted-foreground", isITM_CE && "bg-[hsl(var(--status-live)/0.05)]")}>
                  {formatOI(row.CE.oi)}
                </td>
                <td className={cn("px-2 py-2 text-right font-mono text-muted-foreground", isITM_CE && "bg-[hsl(var(--status-live)/0.05)]")}>
                  {row.CE.iv.toFixed(1)}
                </td>
                <td className={cn("px-2 py-2 text-right font-mono text-muted-foreground", isITM_CE && "bg-[hsl(var(--status-live)/0.05)]")}>
                  {row.CE.delta.toFixed(2)}
                </td>
                <td className={cn("px-2 py-2 text-right font-mono", isITM_CE && "bg-[hsl(var(--status-live)/0.05)]", row.CE.change >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {row.CE.change >= 0 ? '+' : ''}{row.CE.change.toFixed(1)}
                </td>
                <td className={cn("px-2 py-2 text-right", isITM_CE && "bg-[hsl(var(--status-live)/0.08)]")}>
                  <button
                    onClick={() => onSelectOption(row.strikePrice, 'CE', row.CE.ltp)}
                    className={cn("font-mono font-bold px-2 py-0.5 rounded transition-all", isCESelected ? "bg-[hsl(var(--status-live))] text-white" : "hover:bg-[hsl(var(--status-live)/0.15)] text-[hsl(var(--status-live))]")}
                  >
                    {row.CE.ltp.toFixed(2)}
                  </button>
                </td>
                {/* Strike */}
                <td className={cn("px-3 py-2 text-center font-bold bg-muted", isATM && "text-primary")}>
                  {row.strikePrice}
                  {isATM && <div className="text-[9px] text-primary font-normal">ATM</div>}
                </td>
                {/* PE side */}
                <td className={cn("px-2 py-2 text-left", isITM_PE && "bg-[hsl(var(--status-closed)/0.08)]")}>
                  <button
                    onClick={() => onSelectOption(row.strikePrice, 'PE', row.PE.ltp)}
                    className={cn("font-mono font-bold px-2 py-0.5 rounded transition-all", isPESelected ? "bg-[hsl(var(--status-closed))] text-white" : "hover:bg-[hsl(var(--status-closed)/0.15)] text-[hsl(var(--status-closed))]")}
                  >
                    {row.PE.ltp.toFixed(2)}
                  </button>
                </td>
                <td className={cn("px-2 py-2 text-left font-mono", isITM_PE && "bg-[hsl(var(--status-closed)/0.05)]", row.PE.change >= 0 ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {row.PE.change >= 0 ? '+' : ''}{row.PE.change.toFixed(1)}
                </td>
                <td className={cn("px-2 py-2 text-left font-mono text-muted-foreground", isITM_PE && "bg-[hsl(var(--status-closed)/0.05)]")}>
                  {row.PE.delta.toFixed(2)}
                </td>
                <td className={cn("px-2 py-2 text-left font-mono text-muted-foreground", isITM_PE && "bg-[hsl(var(--status-closed)/0.05)]")}>
                  {row.PE.iv.toFixed(1)}
                </td>
                <td className={cn("px-2 py-2 text-left font-mono text-muted-foreground", isITM_PE && "bg-[hsl(var(--status-closed)/0.05)]")}>
                  {formatOI(row.PE.oi)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
