import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTelegram } from "./telegram/useTelegram.ts";
import { getProgress } from "./api/client.ts";
import type { RegisteredProgress } from "./api/types.ts";
import RegistrationScreen from "./screens/RegistrationScreen.tsx";
import LogSalawatScreen from "./screens/LogSalawatScreen.tsx";
import ProgressScreen from "./screens/ProgressScreen.tsx";
import LeaderboardScreen from "./screens/LeaderboardScreen.tsx";
import TabBar, { type Tab } from "./components/TabBar.tsx";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "needs-registration" }
  | { status: "ready"; progress: RegisteredProgress };

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">{children}</div>;
}

export default function App() {
  const { initData, available } = useTelegram();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [activeTab, setActiveTab] = useState<Tab>("progress");

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
        <p className="text-gray-600">Open this from the Salawat Challenge bot's menu button in Telegram.</p>
      </Centered>
    );
  }

  if (state.status === "loading") {
    return (
      <Centered>
        <p className="text-gray-500">Loading…</p>
      </Centered>
    );
  }

  if (state.status === "error") {
    return (
      <Centered>
        <p className="text-red-600">Couldn't reach the server.</p>
        <button
          type="button"
          onClick={() => void loadProgress()}
          className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </Centered>
    );
  }

  if (state.status === "needs-registration") {
    return <RegistrationScreen initData={initData} onRegistered={() => void loadProgress()} />;
  }

  return (
    <div className="pb-16">
      {activeTab === "progress" && <ProgressScreen progress={state.progress} />}
      {activeTab === "log" && <LogSalawatScreen initData={initData} onLogged={() => void loadProgress()} />}
      {activeTab === "leaderboard" && <LeaderboardScreen initData={initData} />}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
