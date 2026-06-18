import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Match } from '../types/match';
import { createMatch, deleteMatch, fetchMatches, updateMatch } from '../api/fixtureApi';

const statusOptions: Match['status'][] = ['Programado', 'En vivo', 'Finalizado'];

const emptyForm: Omit<Match, 'id'> = {
  phase: 'Fase de grupos',
  group: 'A',
  homeTeam: '',
  awayTeam: '',
  homeScore: 0,
  awayScore: 0,
  status: 'Programado',
  date: new Date().toISOString().slice(0, 16),
  stadium: '',
  city: '',
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Admin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [form, setForm] = useState<Omit<Match, 'id'>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches],
  );

  async function loadMatches() {
    setLoading(true);
    try {
      const data = await fetchMatches();
      setMatches(data);
    } catch (error) {
      console.error(error);
      setMessage('No se pudieron cargar los partidos. Revisa que la API esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  function resetForm(clearMessage = true) {
    setEditingId(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 16) });
    if (clearMessage) {
      setMessage(null);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === 'homeScore' || name === 'awayScore' ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateMatch({ id: editingId, ...form });
        setMessage('Partido actualizado correctamente.');
      } else {
        await createMatch(form);
        setMessage('Partido creado correctamente.');
      }

      await loadMatches();
      resetForm(false);
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error al guardar el partido.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(match: Match) {
    setEditingId(match.id);
    setForm({
      phase: match.phase,
      group: match.group,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      status: match.status,
      date: match.date,
      stadium: match.stadium,
      city: match.city,
    });
    setMessage(null);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await deleteMatch(id);
      setMessage('Partido eliminado correctamente.');
      await loadMatches();
    } catch (error) {
      console.error(error);
      setMessage('No se pudo eliminar el partido.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-slate-100">Administrador de Fixture</h2>
        <p className="mt-2 text-slate-400">Crea, edita y elimina partidos usando la API local.</p>
        {message ? <p className="mt-4 rounded-2xl bg-slate-800/80 p-4 text-sm text-slate-100">{message}</p> : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/30">
          <h3 className="text-xl font-semibold text-slate-100">{editingId ? 'Editar partido' : 'Crear partido'}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Fase
              <input name="phase" value={form.phase} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Grupo
              <input name="group" value={form.group} onChange={handleChange} maxLength={1} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Estadio
              <input name="stadium" value={form.stadium} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Ciudad
              <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Equipo local
              <input name="homeTeam" value={form.homeTeam} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Equipo visitante
              <input name="awayTeam" value={form.awayTeam} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Fecha y hora
              <input name="date" value={form.date} onChange={handleChange} type="datetime-local" className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Estado
              <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100">
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Goles local
              <input name="homeScore" value={form.homeScore} onChange={handleChange} type="number" min={0} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Goles visitante
              <input name="awayScore" value={form.awayScore} onChange={handleChange} type="number" min={0} className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 p-3 text-slate-100" />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50">
              {editingId ? 'Guardar cambios' : 'Crear partido'}
            </button>
            {editingId ? (
              <button type="button" onClick={() => resetForm()} className="rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white">
                Cancelar edición
              </button>
            ) : null}
          </div>
        </form>

        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/30">
          <h3 className="text-xl font-semibold text-slate-100">Partidos existentes</h3>
          {loading ? (
            <p className="text-slate-400">Cargando partidos...</p>
          ) : matches.length === 0 ? (
            <p className="text-slate-400">No hay partidos cargados.</p>
          ) : (
            <div className="space-y-4">
              {sortedMatches.map((match) => (
                <article key={match.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{match.phase} · {match.group} · {match.status}</p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-100">{match.homeTeam} vs {match.awayTeam}</h4>
                      <p className="text-sm text-slate-400">{formatDate(match.date)} · {match.stadium}, {match.city}</p>
                      <p className="mt-1 text-sm text-slate-300">Marcador: {match.homeScore} - {match.awayScore}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(match)} className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:border-slate-500">
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDelete(match.id)} className="rounded-full border border-red-600 bg-red-700/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-700/20">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
