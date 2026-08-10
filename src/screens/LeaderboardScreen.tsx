import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { ApiError, getLeaderboard } from "../api/client.ts";
import type { LeaderboardEntry } from "../api/types.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  initData: string;
}

function rankBadgeVariant(rank: number): "gold" | "secondary" | "outline" {
  if (rank === 1) return "gold";
  if (rank <= 3) return "secondary";
  return "outline";
}

function isTied(entries: LeaderboardEntry[], entry: LeaderboardEntry): boolean {
  return entries.some((other) => other !== entry && other.rank === entry.rank);
}

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
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Trophy className="h-5 w-5 text-accent" aria-hidden="true" />
        Leaderboard
      </h2>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!error && entries === null && <p className="text-sm text-muted-foreground">Loading…</p>}

      {entries !== null && entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No one's registered yet.</p>
      )}

      {entries !== null && entries.length > 0 && (
        <Card>
          <CardContent className="divide-y p-0">
            {entries.map((entry) => (
              <div
                key={`${entry.rank}-${entry.nickname}`}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <Badge variant={rankBadgeVariant(entry.rank)} className="w-7 justify-center">
                    {entry.rank}
                  </Badge>
                  <span className="flex flex-col">
                    {entry.nickname}
                    {isTied(entries, entry) && (
                      <span className="text-xs font-normal text-muted-foreground">tied</span>
                    )}
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">{entry.total}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
