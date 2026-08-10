export type Tab = "progress" | "log" | "leaderboard";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "progress", label: "Progress", icon: "📊" },
  { id: "log", label: "Log", icon: "➕" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
];

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
            activeTab === tab.id ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
