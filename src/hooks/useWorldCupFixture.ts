import { useEffect, useState } from 'react';
import type { KnockoutPair, Match, Standing } from '../types/match';
import { fetchKnockoutPairs, fetchStandings } from '../api/footballApi';
import { fetchMatches as fetchLocalMatches } from '../api/fixtureApi';

export function useWorldCupFixture() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [knockout, setKnockout] = useState<KnockoutPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [matchData, standingsData, knockoutData] = await Promise.all([
          fetchLocalMatches(),
          fetchStandings(),
          fetchKnockoutPairs(),
        ]);

        if (!isMounted) {
          return;
        }

        setMatches(matchData);
        setStandings(standingsData);
        setKnockout(knockoutData);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        console.error('No se pudo cargar la API local de fixture.', loadError);
        setError('No se pudo conectar con la API local de fixture.');
        setMatches([]);
        setStandings(await fetchStandings());
        setKnockout(await fetchKnockoutPairs());
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    matches,
    standings,
    knockout,
    loading,
    error,
  };
}
