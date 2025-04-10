interface Team {
  id: number;
  name: string;
  founded: string;
  stadium: string;
  coach: string;
  keyPlayers: string[];
}

interface Match {
  id: number;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
}

interface APIResponse {
  teams: Team[];
  matches: Match[];
}

type Result = 'W' | 'L' | 'D';

interface TeamMatch {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  result: Result;
  isHome: boolean;
}

interface TeamWithStats extends Team {
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  recentForm: Result[];
  position: number;
}
