import { defineStore } from "pinia";

export const useMatchesStore = defineStore('matches', () => {
  const allMatches = ref([]);
  const store = useTeamsStore();
  const {teams} = storeToRefs(store);

  function getTeamMatches(teamId, limit = null) {
    if (!teamId || !allMatches.value.length) return [];

    // Filter matches for the team
    const matches = allMatches.value.filter(
      (match) => match.homeTeamId === teamId || match.awayTeamId === teamId
    );

    // Sort matches by date (most recent first)
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Apply limit if provided
    const limitedMatches = limit ? sortedMatches.slice(0, limit) : sortedMatches;

    // Format matches for display
    return limitedMatches.map((match) => {
      const isHome = match.homeTeamId === teamId;
      const homeTeamObj = teams.value.find((t) => t.id === match.homeTeamId);
      const awayTeamObj = teams.value.find((t) => t.id === match.awayTeamId);

      // Determine result for the team
      let result;
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

  return { allMatches, getTeamMatches }
});