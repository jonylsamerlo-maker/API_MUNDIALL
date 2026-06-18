import type { Match } from '../../types/match';

interface MatchCardProps {
  match: Match;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm shadow-slate-950/30">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-400">
            <span>{match.phase}</span>
            {match.group && <span>{match.group}</span>}
            <span>{match.status}</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-100">{formatDate(match.date)}</h2>
          <p className="text-sm text-slate-400">{match.stadium}, {match.city}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-3xl bg-slate-950/80 p-4 text-center md:w-72">
          <div className="flex items-center justify-between gap-4 text-slate-100">
            <span className="font-semibold">{match.homeTeam}</span>
            <span className="text-3xl font-bold">{match.homeScore}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-100">
            <span className="font-semibold">{match.awayTeam}</span>
            <span className="text-3xl font-bold">{match.awayScore}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
