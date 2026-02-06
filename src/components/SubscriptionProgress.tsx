import { cn } from "@/lib/utils";

interface SubscriptionProgressProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function SubscriptionProgress({ label, value, maxValue = 20 }: SubscriptionProgressProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-mono font-bold">
          {value > 0 ? `${value}x` : "—"}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            value > 10 ? "bg-status-live" : value > 3 ? "bg-primary" : value > 0 ? "bg-status-upcoming" : "bg-muted"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
