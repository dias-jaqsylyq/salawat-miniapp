import type { RegisteredProgress } from "../api/types.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  progress: RegisteredProgress;
}

export default function ProgressScreen({ progress }: Props) {
  const { nickname, total, goal, percentComplete, daysLeft } = progress;

  return (
    <div className="mx-auto max-w-sm px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
          <CardDescription>Keep it up, {nickname}!</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{total}</span>
              <span className="text-sm text-muted-foreground">of {goal} goal</span>
            </div>
            <Progress value={Math.min(100, Math.max(0, percentComplete))} />
            <p className="text-sm text-muted-foreground">{percentComplete}% complete</p>
          </div>

          <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
            {daysLeft === 0 ? "Today is the last day!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in the challenge.`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
