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
