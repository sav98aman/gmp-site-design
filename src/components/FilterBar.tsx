import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  boardFilter: string;
  onBoardChange: (board: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const statusTabs = [
  { value: "all", label: "All" },
  { value: "live", label: "Current" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
  { value: "listed", label: "Listed" },
];

const boardTabs = [
  { value: "all", label: "All Boards" },
  { value: "Mainboard", label: "Mainboard" },
  { value: "SME", label: "SME" },
];

export function FilterBar({
  statusFilter,
  onStatusChange,
  boardFilter,
  onBoardChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <div className="flex bg-muted rounded-lg p-1 gap-0.5">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                statusFilter === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex bg-muted rounded-lg p-1 gap-0.5">
          {boardTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onBoardChange(tab.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                boardFilter === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search IPO..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>
    </div>
  );
}
