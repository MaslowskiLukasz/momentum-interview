<script setup>
import { ref, onMounted, computed } from 'vue';

const selectedTeam = ref(null);
const isLoading = ref(false);
const teams = ref([]);
const teamMatches = ref([]);
const isLoadingMatches = ref(false);
const allMatches = ref([]); // Store all matches from the data file
const editingMatch = ref(null);
const isEditingResult = ref(false);
const editHomeScore = ref(0);
const editAwayScore = ref(0);
const showEditSuccess = ref(false);
const isEditingTeamDetails = ref(false);
const editCoach = ref('');
const editStadium = ref('');
const favoriteTeamId = ref(null);

// Add a new computed property for favorite team data
const favoriteTeam = computed(() => {
  if (!favoriteTeamId.value || !teams.value.length) return null;
  return teams.value.find((team) => team.id === favoriteTeamId.value);
});

// Computed property to calculate games played for each team
const gamesPlayed = computed(() => {
  return (team) => {
    return team.wins + team.draws + team.losses;
  };
});

// Combine the two match-getting functions into one with an optional limit parameter
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

// Update the computed property to use the new function
const favoriteTeamRecentMatches = computed(() => {
  if (!favoriteTeam.value) return [];
  return getTeamMatches(favoriteTeam.value.id, 5);
});

// Update the selectTeam function to use the new function
const selectTeam = async (team) => {
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

const fetchTeams = async () => {
  isLoading.value = true;

  try {
    // Add artificial delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { data } = await useFetch('/data/teams.json');

    // Store all matches
    allMatches.value = data.value.matches || [];

    // Get teams data
    const teamsData = data.value.teams || [];

    // Calculate points and positions based on matches
    const teamsWithStats = calculateTeamStats(teamsData, allMatches.value);

    // Sort teams by points (descending) to determine positions
    const sortedTeams = [...teamsWithStats].sort((a, b) => b.points - a.points);

    // Assign positions
    sortedTeams.forEach((team, index) => {
      team.position = index + 1;
    });

    teams.value = sortedTeams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    teams.value = [];
    allMatches.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Calculate team statistics based on matches
function calculateTeamStats(teamsData, matches) {
  // Create a map to store team stats
  const teamStats = {};

  // Initialize stats for each team - ensure points start at exactly 0
  teamsData.forEach((team) => {
    teamStats[team.id] = {
      ...team,
      points: 0, // Explicitly set to 0 to override any existing value
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      recentForm: [],
    };
  });

  // Process each match to update team stats
  matches.forEach((match) => {
    const homeTeam = teamStats[match.homeTeamId];
    const awayTeam = teamStats[match.awayTeamId];

    if (!homeTeam || !awayTeam) return; // Skip if team not found

    // Update goals
    homeTeam.goalsFor += match.homeScore;
    homeTeam.goalsAgainst += match.awayScore;
    awayTeam.goalsFor += match.awayScore;
    awayTeam.goalsAgainst += match.homeScore;

    // Determine result and update points
    if (match.homeScore > match.awayScore) {
      // Home team wins
      homeTeam.wins += 1;
      homeTeam.points += 3; // 3 points for a win
      homeTeam.recentForm.unshift('W');
      awayTeam.losses += 1;
      // No points for a loss (0)
      awayTeam.recentForm.unshift('L');
    } else if (match.homeScore < match.awayScore) {
      // Away team wins
      awayTeam.wins += 1;
      awayTeam.points += 3; // 3 points for a win
      awayTeam.recentForm.unshift('W');
      homeTeam.losses += 1;
      // No points for a loss (0)
      homeTeam.recentForm.unshift('L');
    } else {
      // Draw
      homeTeam.draws += 1;
      homeTeam.points += 1; // 1 point for a draw
      homeTeam.recentForm.unshift('D');
      awayTeam.draws += 1;
      awayTeam.points += 1; // 1 point for a draw
      awayTeam.recentForm.unshift('D');
    }
  });

  // Limit recent form to last 5 matches and reverse for display (most recent on right)
  Object.values(teamStats).forEach((team) => {
    team.recentForm = team.recentForm.slice(0, 5).reverse();

    // Final points calculation to ensure accuracy
    team.points = team.wins * 3 + team.draws;
  });

  return Object.values(teamStats);
}

onMounted(() => {
  fetchTeams();

  // Load favorite team from local storage
  const savedFavoriteTeamId = localStorage.getItem('favoriteTeamId');
  if (savedFavoriteTeamId) {
    favoriteTeamId.value = parseInt(savedFavoriteTeamId);
  }
});

function startEditingMatch(match) {
  editingMatch.value = { ...match };
  editHomeScore.value = match.homeScore;
  editAwayScore.value = match.awayScore;
  isEditingResult.value = true;
}

function cancelEditMatch() {
  isEditingResult.value = false;
  editingMatch.value = null;
}

function saveMatchResult() {
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
}

function startEditingTeamDetails() {
  if (!selectedTeam.value) return;

  editCoach.value = selectedTeam.value.coach;
  editStadium.value = selectedTeam.value.stadium;
  isEditingTeamDetails.value = true;
}

function cancelEditTeamDetails() {
  editCoach.value = '';
  editStadium.value = '';
  isEditingTeamDetails.value = false;
}

function saveTeamDetails() {
  if (!selectedTeam.value) return;

  // Find the team in the teams array
  const teamIndex = teams.value.findIndex(
    (t) => t.id === selectedTeam.value.id
  );
  if (teamIndex === -1) return;

  // Update the team's coach and stadium
  teams.value[teamIndex].coach = editCoach.value;
  teams.value[teamIndex].stadium = editStadium.value;

  // Update the selected team
  selectedTeam.value.coach = editCoach.value;
  selectedTeam.value.stadium = editStadium.value;

  // Show success message
  showEditSuccess.value = true;
  setTimeout(() => {
    showEditSuccess.value = false;
  }, 3000);

  // Close the modal
  isEditingTeamDetails.value = false;
}

function toggleFavoriteTeam(team) {
  if (favoriteTeamId.value === team.id) {
    // If clicking the current favorite, remove it
    favoriteTeamId.value = null;
    localStorage.removeItem('favoriteTeamId');
  } else {
    // Set as new favorite
    favoriteTeamId.value = team.id;
    localStorage.setItem('favoriteTeamId', team.id);
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <Header />

    <main class="container mx-auto grow px-4 py-8">
      <!-- Loading State -->
      <Loader v-if="isLoading" />

      <!-- Teams Table View (moved above favorite team section) -->
      <List
        v-if="!selectedTeam && !isLoading"
        :teams="teams"
        :favoriteTeamId="favoriteTeamId"
        @selectTeam="selectTeam"
        @toggleFavoriteTeam="toggleFavoriteTeam"
      />

      <!-- Favorite Team Section (only shown when a favorite team is selected) -->
      <FavoriteTeamSection
        v-if="favoriteTeam && !selectedTeam && !isLoading"
        :favoriteTeam="favoriteTeam"
        :favoriteTeamRecentMatches="favoriteTeamRecentMatches"
        @openDetails="selectTeam"
      />

      <!-- Team Details -->
      <Details
        v-else-if="selectedTeam"
        :selectedTeam="selectedTeam"
        :favoriteTeamId="favoriteTeamId"
        :teamMatches="teamMatches"
      />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Add this modal for editing team details -->
    <div
      v-if="isEditingTeamDetails"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <h3 class="text-xl font-bold mb-4 dark:text-white">
          Edit Team Details
        </h3>

        <div class="space-y-4 mb-6">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Coach</label
            >
            <input
              v-model="editCoach"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Coach name"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Stadium</label
            >
            <input
              v-model="editStadium"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Stadium name"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="cancelEditTeamDetails"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            @click="saveTeamDetails"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color-scheme: normal;
}
</style>
