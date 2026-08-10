import { useState, type FormEvent } from "react";
import { logSalawat } from "../api/client.ts";
import { messageForApiError } from "../api/errors.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function submit(count: number) {
    if (submitting) return;

    if (!Number.isInteger(count) || count <= 0) {
      setError("Enter a positive whole number.");
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
      setConfirmation(`Logged ${count} salawat! Running total: ${newTotal}.`);
      setAmount("");
    } catch (err) {
      setError(messageForApiError(err, "Couldn't log that — please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void submit(Number(amount));
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 px-4 py-6">
      <h2 className="text-lg font-semibold text-foreground">Log Salawat</h2>

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

      {confirmation && <p className="text-sm text-primary">{confirmation}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
