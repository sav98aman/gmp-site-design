import { cn } from "@/lib/utils";
import { type FutureContract, formatINR } from "@/data/paperTradingData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FuturesPanelProps {
  contracts: FutureContract[];
  onSelectContract: (contract: FutureContract) => void;
  selectedExpiry?: string;
}

function formatOI(oi: number): string {
  if (oi >= 10000000) return `${(oi / 10000000).toFixed(2)}Cr`;
  if (oi >= 100000) return `${(oi / 100000).toFixed(2)}L`;
  return `${(oi / 1000).toFixed(1)}K`;
}

export function FuturesPanel({ contracts, onSelectContract, selectedExpiry }: FuturesPanelProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground font-medium mb-3">Select Expiry Contract</div>
      {contracts.map(contract => {
        const isPositive = contract.change >= 0;
        const isSelected = selectedExpiry === contract.expiry;
        return (
          <button
            key={contract.expiry}
            onClick={() => onSelectContract(contract)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition-all hover:border-primary/50",
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted/30"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-sm">{contract.symbol} FUT</span>
                <span className="ml-2 text-xs text-muted-foreground">{contract.expiry}</span>
              </div>
              {isSelected && (
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Selected</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground mb-0.5">LTP</div>
                <div className="font-mono font-bold">{contract.ltp.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-0.5">Change</div>
                <div className={cn("font-mono font-bold flex items-center gap-1", isPositive ? "text-[hsl(var(--status-live))]" : "text-[hsl(var(--status-closed))]")}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? '+' : ''}{contract.change.toFixed(2)} ({isPositive ? '+' : ''}{contract.changePercent.toFixed(2)}%)
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-0.5">OI</div>
                <div className="font-mono">{formatOI(contract.oi)}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-0.5">Lot Size</div>
                <div className="font-mono">{contract.lotSize}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-0.5">Margin</div>
                <div className="font-mono">{formatINR(contract.margin)}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
