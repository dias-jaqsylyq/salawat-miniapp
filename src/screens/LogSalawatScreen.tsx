import { useState, type FormEvent } from "react";
import { logSalawat } from "../api/client.ts";
import { messageForApiError } from "../api/errors.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface Props {
  initData: string;
  /** Called after a successful log so the caller can refresh shared progress state. */
  onLogged: () => void;
}

const QUICK_ADD = [10, 50, 100];
/** Must stay in sync with salawat-bot MAX_LOG_COUNT. */
const MAX_LOG_COUNT = 10_000;
/** Honor-system confirm threshold for large submissions. */
const CONFIRM_THRESHOLD = 1_000;

export default function LogSalawatScreen({ initData, onLogged }: Props) {
  const [amount, setAmount] = useState("");
  const [sessionCount, setSessionCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function vibrate() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  async function submit(count: number, updateSessionCount = false) {
    if (submitting) return;

    if (!Number.isInteger(count) || count === 0) {
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
      const { newTotal } = await logSalawat(initData, count);
      onLogged();
      if (updateSessionCount) {
        setSessionCount((prev) => prev + count);
      }
      setConfirmation(`Logged ${count} salawat! Running total: ${newTotal}.`);
      setAmount("");
    } catch (err) {
      setError(messageForApiError(err, "Couldn't log that — please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePlus() {
    vibrate();
    await submit(1, true);
  }

  async function handleMinus() {
    if (sessionCount > 0) {
      await submit(-1, true);
    }
  }

  async function handleReset() {
    if (sessionCount === 0) return;
    
    const resetAmount = sessionCount;
    setSubmitting(true);
    setError(null);
    setConfirmation(null);
    
    try {
      const { newTotal } = await logSalawat(initData, -resetAmount);
      onLogged();
      setSessionCount(0);
      setConfirmation(`Reset! Running total: ${newTotal}.`);
    } catch (err) {
      setError(messageForApiError(err, "Couldn't reset — please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const count = Number(amount);
    if (count > 0) {
      void submit(count, true);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 px-4 py-6">
      <h2 className="text-lg font-semibold text-foreground">Log Salawat</h2>

      <div className="flex flex-col items-center gap-4 rounded-lg bg-secondary/30 p-6">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-3xl px-6 py-3 font-bold">
            {sessionCount}
          </Badge>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Salawat</p>
        
        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={submitting || sessionCount === 0}
            onClick={() => void handleMinus()}
            className="h-12 w-12"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={submitting}
            onClick={() => void handlePlus()}
            className="h-12 px-8"
          >
            <Plus className="h-5 w-5" />
            Plus
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            disabled={submitting || sessionCount === 0}
            onClick={() => void handleReset()}
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
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
        <Button type="submit" disabled={submitting}>
          Log
        </Button>
      </form>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_ADD.map((n) => (
          <Button
            key={n}
            type="button"
            variant="secondary"
            size="lg"
            disabled={submitting}
            onClick={() => void submit(n)}
          >
            +{n}
          </Button>
        ))}
      </div>

      {confirmation && <p className="text-sm text-primary">{confirmation}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
