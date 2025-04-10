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
