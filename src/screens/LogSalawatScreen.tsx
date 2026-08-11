import { useEffect, useState, type FormEvent } from "react";
import { logSalawat } from "../api/client.ts";
import { messageForApiError } from "../api/errors.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  initData: string;
  total: number;
  todayTotal: number;
  /** Called after a successful log so the caller can refresh shared progress state. */
  onLogged: () => void;
}

const QUICK_ADD = [10, 50, 100];
/** Must stay in sync with salawat-bot MAX_LOG_COUNT. */
const MAX_LOG_COUNT = 10_000;
/** Honor-system confirm threshold for large submissions. */
const CONFIRM_THRESHOLD = 1_000;
/** How long the success toast stays visible. */
const TOAST_MS = 2_000;

export default function LogSalawatScreen({ initData, total, todayTotal, onLogged }: Props) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  /** Optimistic today total shown in the stats bar until progress refreshes. */
  const [displayToday, setDisplayToday] = useState(todayTotal);
  const [displayTotal, setDisplayTotal] = useState(total);

  useEffect(() => {
    setDisplayToday(todayTotal);
    setDisplayTotal(total);
  }, [todayTotal, total]);

  useEffect(() => {
    if (!confirmation) return;
    const id = window.setTimeout(() => setConfirmation(null), TOAST_MS);
    return () => window.clearTimeout(id);
  }, [confirmation]);

  function vibrate() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  async function submit(count: number) {
    if (submitting) return;

    if (!Number.isInteger(count) || count <= 0) {
      setError("Enter a valid number.");
      return;
    }
    if (count > MAX_LOG_COUNT) {
      setError(`Maximum ${MAX_LOG_COUNT.toLocaleString()} salawat per submission.`);
      return;
    }
    if (count >= CONFIRM_THRESHOLD) {
      const ok = window.confirm(`Log ${count.toLocaleString()} salawat?`);
      if (!ok) return;
    }

    setSubmitting(true);
    setError(null);
    setConfirmation(null);
    try {
      const { newTotal, newTodayTotal } = await logSalawat(initData, count);
      const today = newTodayTotal ?? displayToday + count;
      setDisplayToday(today);
      setDisplayTotal(newTotal);
      setConfirmation(`Logged ${count}! Today: ${today.toLocaleString()}`);
      setAmount("");
      onLogged();
    } catch (err) {
      setError(messageForApiError(err, "Couldn't log that — please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleQuickAdd(count: number) {
    vibrate();
    void submit(count);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const count = Number(amount);
    if (count > 0) {
      vibrate();
      void submit(count);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 px-4 py-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Log Salawat</h2>
        <p className="text-sm text-muted-foreground">
          Today: {displayToday.toLocaleString()} · Total: {displayTotal.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_ADD.map((n) => (
          <Button
            key={n}
            type="button"
            variant="default"
            disabled={submitting}
            onClick={() => handleQuickAdd(n)}
            className="h-16 text-lg font-semibold"
          >
            +{n}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_LOG_COUNT}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Custom amount"
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={submitting}>
          Log
        </Button>
      </form>

      {confirmation && (
        <p className="text-sm text-primary transition-opacity duration-500">{confirmation}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
