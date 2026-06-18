import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard/MatchCard';
import { useWorldCupFixture } from '../hooks/useWorldCupFixture';
import type { Match } from '../types/match';

const statuses = ['Todos', 'Programado', 'En vivo', 'Finalizado'] as const;

function filterMatches(matches: Match[], statusFilter: typeof statuses[number]) {
  if (statusFilter === 'Todos') {
    return matches;
  }
  return matches.filter((match) => match.status === statusFilter);
}

export default function Home() {
  const { matches, loading } = useWorldCupFixture();
  const [statusFilter, setStatusFilter] = useState<typeof statuses[number]>('Todos');

  const filteredMatches = useMemo(() => filterMatches(matches, statusFilter), [matches, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-slate-100">Fixture</h2>
        <p className="mt-2 text-slate-400">Consulta los partidos, resultados y estados de cada encuentro.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-slate-100 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">Cargando partidos...</div>
        ) : filteredMatches.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">
            <p>No hay partidos para mostrar.</p>
            <Link
              to="/admin"
              className="mt-4 inline-flex rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Cargar primer partido
            </Link>
          </div>
        ) : (
          [...filteredMatches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </section>
    </div>
  );
}
