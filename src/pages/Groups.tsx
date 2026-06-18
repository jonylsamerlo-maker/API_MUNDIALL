import GroupTable from '../components/GroupTable/GroupTable';
import { useWorldCupFixture } from '../hooks/useWorldCupFixture';

export default function Groups() {
  const { standings, loading } = useWorldCupFixture();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-slate-100">Tablas de posiciones</h2>
        <p className="mt-2 text-slate-400">Consulta el estado de los grupos oficiales y la clasificación de los equipos.</p>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">Cargando tablas...</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {standings.map((standing) => (
            <GroupTable key={standing.group} standing={standing} />
          ))}
        </div>
      )}
    </div>
  );
}
