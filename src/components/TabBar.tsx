import { ChartColumn, Plus, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "progress" | "log" | "leaderboard";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "progress", label: "Progress", icon: ChartColumn },
  { id: "log", label: "Log", icon: Plus },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex border-t bg-card pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
