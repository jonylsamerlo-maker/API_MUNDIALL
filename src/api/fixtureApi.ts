import type { Match } from '../types/match';

const API_URL = import.meta.env.VITE_FIXTURE_API_URL ?? '/api.php';

interface ApiMessage {
  status: string;
  mensaje: string;
}

interface CreateMatchResponse extends ApiMessage {
  data: Match;
}

async function request<T>(options: RequestInit = {}): Promise<T> {
  const response = await fetch(API_URL, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export async function fetchMatches(): Promise<Match[]> {
  return request<Match[]>({ method: 'GET' });
}

export async function createMatch(match: Omit<Match, 'id'>): Promise<Match> {
  const response = await request<CreateMatchResponse>({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(match),
  });

  return response.data;
}

export async function updateMatch(match: Match): Promise<ApiMessage> {
  return request<ApiMessage>({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(match),
  });
}

export async function deleteMatch(id: string): Promise<ApiMessage> {
  return request<ApiMessage>({
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
}
