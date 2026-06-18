import type { KnockoutPair } from '../../types/match';

interface BracketProps {
  pairs: KnockoutPair[];
}

export default function Bracket({ pairs }: BracketProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pairs.map((pair) => (
        <div key={pair.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm shadow-slate-950/20">
          <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-400">{pair.stage}</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-3">
              <span>{pair.teamA}</span>
              <strong>{pair.scoreA}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-950/80 p-3">
              <span>{pair.teamB}</span>
              <strong>{pair.scoreB}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
