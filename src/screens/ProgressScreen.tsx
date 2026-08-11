import type { DayBreakdown, RegisteredProgress } from "../api/types.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  progress: RegisteredProgress;
}

function daysLeftCopy(progress: RegisteredProgress): string {
  if (progress.challengeStatus === "ended") {
    return `Challenge ended on ${progress.challengeEndDate}.`;
  }
  if (progress.daysLeft === 0) {
    return "Today is the last day!";
  }
  return `${progress.daysLeft} day${progress.daysLeft === 1 ? "" : "s"} left in the challenge.`;
}

function streakCopy(streak: number): string {
  if (streak <= 0) return "No streak yet";
  return `🔥 ${streak} day${streak === 1 ? "" : "s"} streak`;
}

function weekdayLabel(date: string): string {
  // Parse as UTC noon to avoid local TZ shifting the calendar day.
  const d = new Date(`${date}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { weekday: "narrow", timeZone: "UTC" });
}

function todayPercent(todayTotal: number, dailyGoal: number): number {
  if (dailyGoal <= 0) return 0;
  return Math.min(100, Math.round((todayTotal / dailyGoal) * 1000) / 10);
}

function WeekTracker({ days }: { days: DayBreakdown[] }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Last 7 days</p>
      <div className="flex justify-between gap-1 px-1">
        {days.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={
                day.metGoal
                  ? "h-3.5 w-3.5 rounded-full bg-primary"
                  : "h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/40 bg-transparent"
              }
              title={`${day.date}: ${day.total.toLocaleString()}${day.metGoal ? " (goal met)" : ""}`}
              aria-label={`${day.date}: ${day.total} salawat${day.metGoal ? ", goal met" : ", goal not met"}`}
            />
            <span className="text-xs text-muted-foreground">{weekdayLabel(day.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressScreen({ progress }: Props) {
  const { nickname, total, todayTotal, dailyGoal, streak, last7Days } = progress;
  const percent = todayPercent(todayTotal, dailyGoal);

  return (
    <div className="mx-auto max-w-sm px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            <span className={streak > 0 ? "text-foreground" : "text-muted-foreground"}>
              {streakCopy(streak)}
            </span>
          </CardTitle>
          <CardDescription>Keep it up, {nickname}!</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">Today</span>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  {todayTotal.toLocaleString()}
                </span>
                {" / "}
                {dailyGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={percent} />
            <p className="text-sm text-muted-foreground">{percent}% of daily goal</p>
          </div>

          <WeekTracker days={last7Days ?? []} />

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">All-time</span>
              <span className="tabular-nums text-muted-foreground">{total.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">{daysLeftCopy(progress)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
