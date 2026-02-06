import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  compact?: boolean;
}

function calculateTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate, label, compact }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="text-muted-foreground text-xs font-medium">Ended</span>;
  }

  const unitClass = cn(
    "bg-muted px-1.5 py-0.5 rounded font-mono tabular-nums",
    compact ? "text-[10px]" : "text-xs"
  );

  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-muted-foreground text-xs mr-1">{label}</span>}
      <span className={unitClass}>{timeLeft.days}d</span>
      <span className="text-muted-foreground text-[10px]">:</span>
      <span className={unitClass}>{String(timeLeft.hours).padStart(2, "0")}h</span>
      <span className="text-muted-foreground text-[10px]">:</span>
      <span className={unitClass}>{String(timeLeft.minutes).padStart(2, "0")}m</span>
      <span className="text-muted-foreground text-[10px]">:</span>
      <span className={unitClass}>{String(timeLeft.seconds).padStart(2, "0")}s</span>
    </div>
  );
}
