import type { Standing } from '../../types/match';

interface GroupTableProps {
  standing: Standing;
}

export default function GroupTable({ standing }: GroupTableProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm shadow-slate-950/20">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">{standing.group}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left text-sm text-slate-200">
          <thead className="border-b border-slate-700 text-slate-400">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Equipo</th>
              <th className="px-3 py-2">PJ</th>
              <th className="px-3 py-2">PG</th>
              <th className="px-3 py-2">PE</th>
              <th className="px-3 py-2">PP</th>
              <th className="px-3 py-2">GF</th>
              <th className="px-3 py-2">GC</th>
              <th className="px-3 py-2">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standing.teams.map((team) => (
              <tr key={team.name} className="border-b border-slate-800 hover:bg-slate-950/80">
                <td className="px-3 py-2">{team.position}</td>
                <td className="px-3 py-2">{team.name}</td>
                <td className="px-3 py-2">{team.played}</td>
                <td className="px-3 py-2">{team.won}</td>
                <td className="px-3 py-2">{team.draw}</td>
                <td className="px-3 py-2">{team.lost}</td>
                <td className="px-3 py-2">{team.goalsFor}</td>
                <td className="px-3 py-2">{team.goalsAgainst}</td>
                <td className="px-3 py-2">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
