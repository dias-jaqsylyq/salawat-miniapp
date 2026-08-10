import { useState, type FormEvent } from "react";
import { ApiError, logSalawat } from "../api/client.ts";

interface Props {
  initData: string;
  /** Called after a successful log so the caller can refresh shared progress state. */
  onLogged: () => void;
}

const QUICK_ADD = [10, 50, 100];

export default function LogSalawatScreen({ initData, onLogged }: Props) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function submit(count: number) {
    if (!Number.isInteger(count) || count <= 0) {
      setError("Enter a positive whole number.");
      return;
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
      setError(err instanceof ApiError ? "Couldn't log that — please try again." : "Network error — please try again.");
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
      <h2 className="text-lg font-semibold text-gray-900">Log Salawat</h2>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_ADD.map((n) => (
          <button
            key={n}
            type="button"
            disabled={submitting}
            onClick={() => void submit(n)}
            className="rounded-lg bg-emerald-100 py-3 font-medium text-emerald-800 disabled:opacity-50"
          >
            +{n}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Custom amount"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          Log
        </button>
      </form>

      {confirmation && <p className="text-sm text-emerald-700">{confirmation}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
