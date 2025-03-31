export const useEditResult = () => {
  const editHomeScore = ref(0);
  const editAwayScore = ref(0);
  const editingMatch = ref(null);
  const isEditingResult = ref(false);
  const showEditSuccess = ref(false);

  const store = useLeagueStore();
  const { allMatches, teamMatches, teams, selectedTeam } = storeToRefs(store);

  const startEditingMatch = (match) => {
    editingMatch.value = { ...match };
    editHomeScore.value = match.homeScore;
    editAwayScore.value = match.awayScore;
    isEditingResult.value = true;
  };

  const cancelEditMatch = () => {
    isEditingResult.value = false;
    editingMatch.value = null;
  };

  const saveMatchResult = () => {
    if (!editingMatch.value) return;

    // Validate scores
    if (
      editHomeScore.value < 0 ||
      editHomeScore.value > 7 ||
      editAwayScore.value < 0 ||
      editAwayScore.value > 7
    ) {
      alert('Scores must be between 0 and 7');
      return;
    }

    // Find the match in allMatches
    const matchIndex = allMatches.value.findIndex(
      (m) => m.id === editingMatch.value.id
    );
    if (matchIndex === -1) return;

    // Get the teams involved
    const homeTeamId = allMatches.value[matchIndex].homeTeamId;
    const awayTeamId = allMatches.value[matchIndex].awayTeamId;
    const homeTeam = teams.value.find((t) => t.id === homeTeamId);
    const awayTeam = teams.value.find((t) => t.id === awayTeamId);

    // Store original scores for comparison
    const originalHomeScore = allMatches.value[matchIndex].homeScore;
    const originalAwayScore = allMatches.value[matchIndex].awayScore;

    // Update the match scores
    allMatches.value[matchIndex].homeScore = editHomeScore.value;
    allMatches.value[matchIndex].awayScore = editAwayScore.value;

    // Update the formatted match in teamMatches
    const teamMatchIndex = teamMatches.value.findIndex(
      (m) => m.id === editingMatch.value.id
    );
    if (teamMatchIndex !== -1) {
      const updatedMatch = { ...teamMatches.value[teamMatchIndex] };
      updatedMatch.homeScore = editHomeScore.value;
      updatedMatch.awayScore = editAwayScore.value;

      // Update result (W/L/D) for the selected team
      const isHome = updatedMatch.isHome;
      if (isHome) {
        updatedMatch.result =
          editHomeScore.value > editAwayScore.value
            ? 'W'
            : editHomeScore.value < editAwayScore.value
            ? 'L'
            : 'D';
      } else {
        updatedMatch.result =
          editAwayScore.value > editHomeScore.value
            ? 'W'
            : editAwayScore.value < editHomeScore.value
            ? 'L'
            : 'D';
      }

      teamMatches.value[teamMatchIndex] = updatedMatch;
    }

    // Recalculate team stats
    const teamsData = teams.value.map((team) => ({
      id: team.id,
      name: team.name,
      founded: team.founded,
      stadium: team.stadium,
      coach: team.coach,
      keyPlayers: team.keyPlayers,
    }));

    const teamsWithStats = calculateTeamStats(teamsData, allMatches.value);

    // Sort teams by points (descending) to determine positions
    const sortedTeams = [...teamsWithStats].sort((a, b) => {
      // First sort by points
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal, sort by goal difference
      const aGoalDiff = a.goalsFor - a.goalsAgainst;
      const bGoalDiff = b.goalsFor - b.goalsAgainst;
      if (bGoalDiff !== aGoalDiff) {
        return bGoalDiff - aGoalDiff;
      }
      // If goal difference is equal, sort by goals scored
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      // If everything is equal, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    // Assign positions
    sortedTeams.forEach((team, index) => {
      team.position = index + 1;
    });

    teams.value = sortedTeams;

    // Update the selected team reference to reflect the new stats
    if (selectedTeam.value) {
      const updatedSelectedTeam = teams.value.find(
        (t) => t.id === selectedTeam.value.id
      );
      if (updatedSelectedTeam) {
        selectedTeam.value = updatedSelectedTeam;
      }
    }

    // Show success message
    showEditSuccess.value = true;
    setTimeout(() => {
      showEditSuccess.value = false;
    }, 3000);

    // Close edit mode
    isEditingResult.value = false;
    editingMatch.value = null;
  };

  return {
    editHomeScore,
    editAwayScore,
    editingMatch,
    isEditingResult,
    showEditSuccess,
    startEditingMatch,
    cancelEditMatch,
    saveMatchResult,
  };
};
