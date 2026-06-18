import Bracket from '../components/Bracket/Bracket';
import { useWorldCupFixture } from '../hooks/useWorldCupFixture';

export default function Knockout() {
  const { knockout, loading } = useWorldCupFixture();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-slate-100">Fases eliminatorias</h2>
        <p className="mt-2 text-slate-400">Visualiza los cruces y los resultados de la fase de eliminación directa.</p>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">Cargando eliminatorias...</div>
      ) : (
        <Bracket pairs={knockout} />
      )}
    </div>
  );
}
