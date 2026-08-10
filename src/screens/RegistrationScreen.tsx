import { useState, type FormEvent } from "react";
import { Moon } from "lucide-react";
import { register } from "../api/client.ts";
import { messageForApiError } from "../api/errors.ts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  initData: string;
  onRegistered: () => void;
}

/** Must stay in sync with salawat-bot MAX_GOAL. */
const MAX_GOAL = 100_000_000;

function validate(nickname: string, goal: string): string | null {
  const trimmed = nickname.trim();
  if (trimmed.length === 0 || trimmed.length > 50) {
    return "Nickname must be 1–50 characters.";
  }
  const goalNum = Number(goal);
  if (!Number.isInteger(goalNum) || goalNum <= 0) {
    return "Goal must be a positive whole number.";
  }
  if (goalNum > MAX_GOAL) {
    return `Goal must be at most ${MAX_GOAL.toLocaleString()}.`;
  }
  return null;
}

export default function RegistrationScreen({ initData, onRegistered }: Props) {
  const [nickname, setNickname] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const validationError = validate(nickname, goal);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await register(initData, nickname.trim(), Number(goal));
      onRegistered();
    } catch (err) {
      setError(messageForApiError(err, "Couldn't register — please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" aria-hidden="true" />
              Salawat Challenge
            </CardTitle>
            <CardDescription>Assalamu alaikum! Let's get you set up.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
                placeholder="e.g. Ali"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Monthly salawat goal</Label>
              <Input
                id="goal"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_GOAL}
                step={1}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. 3000"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Joining…" : "Join the challenge"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
