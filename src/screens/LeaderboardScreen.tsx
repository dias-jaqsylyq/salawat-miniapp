import { useEffect, useState } from "react";
import { ApiError, getLeaderboard } from "../api/client.ts";
import type { LeaderboardEntry } from "../api/types.ts";

interface Props {
  initData: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardScreen({ initData }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLeaderboard(initData)
      .then(({ leaderboard }) => {
        if (!cancelled) setEntries(leaderboard);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? "Couldn't load the leaderboard." : "Network error — please try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [initData]);

  return (
    <div className="mx-auto max-w-sm space-y-4 px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900">🏆 Leaderboard</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && entries === null && <p className="text-sm text-gray-500">Loading…</p>}

      {entries !== null && entries.length === 0 && (
        <p className="text-sm text-gray-500">No one's registered yet.</p>
      )}

      {entries !== null && entries.length > 0 && (
        <ol className="divide-y divide-gray-100 rounded-xl bg-white shadow-sm">
          {entries.map((entry) => (
            <li key={entry.rank} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <span className="w-6 text-center">{MEDALS[entry.rank - 1] ?? entry.rank}</span>
                {entry.nickname}
              </span>
              <span className="text-sm text-gray-600">{entry.total}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
