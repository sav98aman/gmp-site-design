import { cn } from "@/lib/utils";
import type { AIVerdict } from "@/data/mockData";

const verdictStyles: Record<AIVerdict, string> = {
  BUY: "bg-verdict-buy/15 text-verdict-buy border-verdict-buy/25",
  HOLD: "bg-verdict-hold/15 text-verdict-hold border-verdict-hold/25",
  NEUTRAL: "bg-verdict-neutral/15 text-verdict-neutral border-verdict-neutral/25",
  AVOID: "bg-verdict-avoid/15 text-verdict-avoid border-verdict-avoid/25",
};

interface AIVerdictBadgeProps {
  verdict: AIVerdict;
  size?: "sm" | "md" | "lg";
}

export function AIVerdictBadge({ verdict, size = "sm" }: AIVerdictBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-bold tracking-wide",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3.5 py-1.5 text-sm",
        verdictStyles[verdict]
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" && "h-1.5 w-1.5",
          size === "md" && "h-2 w-2",
          size === "lg" && "h-2.5 w-2.5",
          verdict === "BUY" && "bg-verdict-buy",
          verdict === "HOLD" && "bg-verdict-hold",
          verdict === "NEUTRAL" && "bg-verdict-neutral",
          verdict === "AVOID" && "bg-verdict-avoid"
        )}
      />
      {verdict}
    </span>
  );
}
