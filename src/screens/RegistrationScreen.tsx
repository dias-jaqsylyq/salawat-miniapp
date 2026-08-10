import { useState, type FormEvent } from "react";
import { ApiError, register } from "../api/client.ts";

interface Props {
  initData: string;
  onRegistered: () => void;
}

function validate(nickname: string, goal: string): string | null {
  const trimmed = nickname.trim();
  if (trimmed.length === 0 || trimmed.length > 50) {
    return "Nickname must be 1–50 characters.";
  }
  const goalNum = Number(goal);
  if (!Number.isInteger(goalNum) || goalNum <= 0) {
    return "Goal must be a positive whole number.";
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
      setError(err instanceof ApiError ? "Couldn't register — please try again." : "Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">🌙 Salawat Challenge</h1>
          <p className="mt-1 text-sm text-gray-500">Assalamu alaikum! Let's get you set up.</p>
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={50}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none"
            placeholder="e.g. Ali"
          />
        </div>

        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Monthly salawat goal
          </label>
          <input
            id="goal"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none"
            placeholder="e.g. 3000"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Joining…" : "Join the challenge"}
        </button>
      </form>
    </div>
  );
}
