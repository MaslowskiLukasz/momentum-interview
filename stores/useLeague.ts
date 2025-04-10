import { defineStore } from 'pinia';

export const useLeagueStore = defineStore('league', () => {
  const allMatches = ref<Match[]>([]);
  const teamMatches = ref<TeamMatch[]>([]);
  const teams = ref<TeamWithStats[]>([]);
  const selectedTeam = ref<TeamWithStats | null>(null);
  const isLoadingMatches = ref(false);

  function getTeamMatches(
    teamId: number | null,
    limit: number | null = null
  ): TeamMatch[] {
    if (!teamId || !allMatches.value.length) return [];

    // Filter matches for the team
    const matches = allMatches.value.filter(
      (match) => match.homeTeamId === teamId || match.awayTeamId === teamId
    );

    // Sort matches by date (most recent first)
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

    // Apply limit if provided
    const limitedMatches = limit
      ? sortedMatches.slice(0, limit)
      : sortedMatches;

    // Format matches for display
    return limitedMatches.map((match) => {
      const isHome = match.homeTeamId === teamId;
      const homeTeamObj = teams.value.find((t) => t.id === match.homeTeamId);
      const awayTeamObj = teams.value.find((t) => t.id === match.awayTeamId);

      // Determine result for the team
      let result: Result;
      if (isHome) {
        result =
          match.homeScore > match.awayScore
            ? 'W'
            : match.homeScore < match.awayScore
            ? 'L'
            : 'D';
      } else {
        result =
          match.awayScore > match.homeScore
            ? 'W'
            : match.awayScore < match.homeScore
            ? 'L'
            : 'D';
      }

      return {
        id: match.id,
        date: match.date,
        homeTeam: homeTeamObj?.name || 'Unknown Team',
        awayTeam: awayTeamObj?.name || 'Unknown Team',
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        result,
        isHome,
      };
    });
  }

  const selectTeam = async (team: TeamWithStats) => {
    selectedTeam.value = team;
    isLoadingMatches.value = true;

    try {
      // Get all matches for the team
      teamMatches.value = getTeamMatches(team.id);
    } catch (error) {
      console.error('Error fetching team matches:', error);
      teamMatches.value = [];
    } finally {
      isLoadingMatches.value = false;
    }
  };

  const resetSelectedTeam = () => {
    selectedTeam.value = null;
  };

  return {
    allMatches,
    teamMatches,
    teams,
    selectedTeam,
    isLoadingMatches,
    getTeamMatches,
    selectTeam,
    resetSelectedTeam,
  };
});
