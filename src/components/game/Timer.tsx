import { PHASE1_DURATION } from "@/lib/constants";

interface TimerProps {
  timeRemaining: number;
  dark?: boolean;
}

export default function Timer({ timeRemaining, dark = false }: TimerProps) {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const pct = (timeRemaining / PHASE1_DURATION) * 100;
  const isLow = timeRemaining <= 10;

  if (dark) {
    return (
      <div className="flex flex-col items-center gap-1 min-w-[120px]">
        <span
          className={`font-mono text-lg font-bold tabular-nums ${
            isLow ? "text-red-400" : "text-white"
          }`}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isLow ? "bg-red-400" : "bg-white/50"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <span
        className={`font-mono text-2xl font-bold tabular-nums ${
          isLow ? "text-[var(--danger)]" : "text-[var(--text-primary)]"
        }`}
      >
        {mins}:{secs.toString().padStart(2, "0")}
      </span>
      <div className="w-full h-1.5 bg-[var(--accent-light)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isLow ? "bg-[var(--danger)]" : "bg-[var(--accent)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
