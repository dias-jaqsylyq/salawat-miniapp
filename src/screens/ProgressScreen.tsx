import type { RegisteredProgress } from "../api/types.ts";
import ProgressBar from "../components/ProgressBar.tsx";

interface Props {
  progress: RegisteredProgress;
}

export default function ProgressScreen({ progress }: Props) {
  const { nickname, total, goal, percentComplete, daysLeft } = progress;

  return (
    <div className="mx-auto max-w-sm space-y-6 px-4 py-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">My Progress</h2>
        <p className="text-sm text-gray-500">Keep it up, {nickname}!</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-sm text-gray-500">of {goal} goal</span>
        </div>
        <ProgressBar percent={percentComplete} />
        <p className="text-sm text-gray-600">{percentComplete}% complete</p>
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
        {daysLeft === 0 ? "Today is the last day!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in the challenge.`}
      </div>
    </div>
  );
}
