import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTelegram } from "./telegram/useTelegram.ts";
import { getProgress } from "./api/client.ts";
import type { RegisteredProgress } from "./api/types.ts";
import RegistrationScreen from "./screens/RegistrationScreen.tsx";
import LogSalawatScreen from "./screens/LogSalawatScreen.tsx";
import ProgressScreen from "./screens/ProgressScreen.tsx";
import LeaderboardScreen from "./screens/LeaderboardScreen.tsx";
import TabBar, { type Tab } from "./components/TabBar.tsx";
import { Button } from "@/components/ui/button";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "needs-registration" }
  | { status: "ready"; progress: RegisteredProgress };

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">{children}</div>;
}

/** Keeps the app's theme in sync with Telegram's color scheme (falls back to system preference outside Telegram). */
function useSyncDarkMode() {
  useEffect(() => {
    const isDark =
      window.Telegram?.WebApp?.colorScheme === "dark" ||
      (!window.Telegram?.WebApp && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
}

export default function App() {
  const { initData, available } = useTelegram();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [activeTab, setActiveTab] = useState<Tab>("progress");

  useSyncDarkMode();

  const loadProgress = useCallback(async () => {
    try {
      const result = await getProgress(initData);
      setState(result.registered ? { status: "ready", progress: result } : { status: "needs-registration" });
    } catch {
      setState({ status: "error" });
    }
  }, [initData]);

  useEffect(() => {
    if (available) {
      void loadProgress();
    }
  }, [available, loadProgress]);

  if (!available) {
    return (
      <Centered>
        <p className="text-muted-foreground">Open this from the Salawat Challenge bot's menu button in Telegram.</p>
      </Centered>
    );
  }

  if (state.status === "loading") {
    return (
      <Centered>
        <p className="text-muted-foreground">Loading…</p>
      </Centered>
    );
  }

  if (state.status === "error") {
    return (
      <Centered>
        <p className="text-destructive">Couldn't reach the server.</p>
        <Button onClick={() => void loadProgress()} className="mt-3">
          Retry
        </Button>
      </Centered>
    );
  }

  if (state.status === "needs-registration") {
    return <RegistrationScreen initData={initData} onRegistered={() => void loadProgress()} />;
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {activeTab === "progress" && <ProgressScreen progress={state.progress} />}
      {activeTab === "log" && <LogSalawatScreen initData={initData} onLogged={() => void loadProgress()} />}
      {activeTab === "leaderboard" && <LeaderboardScreen initData={initData} />}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
