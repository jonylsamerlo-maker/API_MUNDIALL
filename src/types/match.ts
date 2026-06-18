export interface Match {
  id: string;
  phase: string;
  group: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'Programado' | 'En vivo' | 'Finalizado';
  date: string;
  stadium: string;
  city: string;
}

export interface TeamStanding {
  position: number;
  name: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Standing {
  group: string;
  teams: TeamStanding[];
}

export interface KnockoutPair {
  id: string;
  stage: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}
