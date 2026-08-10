interface Props {
  /** Uncapped percent value — visual width is clamped to 100, the caller shows the real number separately. */
  percent: number;
}

export default function ProgressBar({ percent }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
