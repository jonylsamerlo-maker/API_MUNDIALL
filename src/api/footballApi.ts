import type { Match, Standing, KnockoutPair } from '../types/match';

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const API_URL = 'https://api.football-data.org/v4/competitions/WC/matches?season=2026';

const sampleMatches: Match[] = [];

const sampleStandings: Standing[] = [];

const sampleKnockout: KnockoutPair[] = [];

interface FootballDataMatch {
  id?: number | string;
  stage?: string;
  group?: string;
  utcDate?: string;
  status?: string;
  venue?: string;
  homeTeam?: {
    name?: string;
  };
  awayTeam?: {
    name?: string;
  };
  score?: {
    fullTime?: {
      home?: number | null;
      away?: number | null;
      homeTeam?: number | null;
      awayTeam?: number | null;
    };
  };
  competition?: {
    area?: {
      name?: string;
    };
  };
}

interface FootballDataResponse {
  matches?: FootballDataMatch[];
}

function getScore(score: FootballDataMatch['score'], side: 'home' | 'away') {
  const fullTime = score?.fullTime;
  const legacyKey = side === 'home' ? 'homeTeam' : 'awayTeam';

  return fullTime?.[side] ?? fullTime?.[legacyKey] ?? 0;
}

function normalizeMatch(match: FootballDataMatch): Match {
  const homeScore = getScore(match.score, 'home');
  const awayScore = getScore(match.score, 'away');

  return {
    id: String(match.id ?? crypto.randomUUID()),
    phase: match.stage ?? 'Desconocido',
    group: match.group ?? '',
    homeTeam: match.homeTeam?.name ?? 'Local',
    awayTeam: match.awayTeam?.name ?? 'Visitante',
    homeScore,
    awayScore,
    status: mapStatus(match.status ?? 'SCHEDULED'),
    date: match.utcDate ?? new Date().toISOString(),
    stadium: match.venue ?? '',
    city: match.competition?.area?.name ?? '',
  };
}

function mapStatus(apiStatus: string): 'Programado' | 'En vivo' | 'Finalizado' {
  if (apiStatus === 'IN_PLAY' || apiStatus === 'LIVE' || apiStatus === 'PAUSED') {
    return 'En vivo';
  }

  if (apiStatus === 'SCHEDULED' || apiStatus === 'TIMED') {
    return 'Programado';
  }

  return 'Finalizado';
}

export async function fetchMatches(): Promise<Match[]> {
  if (!API_KEY) {
    return sampleMatches;
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Auth-Token': API_KEY,
      },
    });

    if (!response.ok) {
      console.warn(`Football Data API respondió con error: ${response.status} ${response.statusText}`);
      return sampleMatches;
    }

    const data = (await response.json()) as FootballDataResponse;
    if (!Array.isArray(data.matches)) {
      console.warn('Respuesta inesperada de Football Data API: data.matches debe ser un arreglo.');
      return sampleMatches;
    }

    return data.matches.map(normalizeMatch);
  } catch (error) {
    console.warn('No se pudo conectar con Football Data API. Se usan datos locales.', error);
    return sampleMatches;
  }
}

export async function fetchStandings(): Promise<Standing[]> {
  return sampleStandings;
}

export async function fetchKnockoutPairs(): Promise<KnockoutPair[]> {
  return sampleKnockout;
}
