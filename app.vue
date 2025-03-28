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
      <div v-else-if="selectedTeam" class="team-details py-6">
        <div class="flex justify-between items-center mb-6">
          <button
            @click="selectedTeam = null"
            class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Teams
          </button>

          <!-- Favorite Button in Team Details -->
          <button
            @click.stop="toggleFavoriteTeam(selectedTeam)"
            class="flex items-center px-3 py-2 rounded-md transition-colors"
            :class="{
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                favoriteTeamId === selectedTeam.id,
              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
                favoriteTeamId !== selectedTeam.id,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="0"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            {{
              favoriteTeamId === selectedTeam.id
                ? 'Favorite Team'
                : 'Set as Favorite'
            }}
          </button>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white"
          >
            <h2 class="text-3xl font-bold">{{ selectedTeam.name }}</h2>
            <p class="text-blue-100">
              Position: #{{ selectedTeam.position }} • Points:
              {{ selectedTeam.points }}
            </p>
          </div>

          <div class="p-6">
            <div
              class="flex flex-col md:flex-row md:justify-between md:items-start gap-6"
            >
              <div>
                <div class="flex items-center mb-4">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ selectedTeam.name }}
                  </h2>
                  <span
                    class="ml-3 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    #{{ selectedTeam.position }}
                  </span>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="dark:text-gray-300">
                      <strong>Founded:</strong> {{ selectedTeam.founded }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <p class="dark:text-gray-300">
                      <strong>Stadium:</strong> {{ selectedTeam.stadium }}
                      <button
                        @click="startEditingTeamDetails"
                        class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Edit
                      </button>
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p class="dark:text-gray-300">
                      <strong>Coach:</strong> {{ selectedTeam.coach }}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-semibold mb-4 dark:text-white">
                  Team Stats
                </h3>
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2"
                    >
                      Points
                    </h4>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ selectedTeam.points }}
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2"
                    >
                      Goals Scored
                    </h4>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ selectedTeam.goalsFor }}
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2"
                    >
                      Goals Conceded
                    </h4>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ selectedTeam.goalsAgainst }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Match History Section -->
          <div class="p-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold mb-4 dark:text-white">
              All Matches
            </h3>

            <!-- Success Message -->
            <div
              v-if="showEditSuccess"
              class="mb-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Match result updated successfully! Standings have been
              recalculated.
            </div>

            <!-- Loading State -->
            <div
              v-if="isLoadingMatches"
              class="flex justify-center items-center py-8"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
              ></div>
            </div>

            <!-- Match Editing Modal -->
            <div
              v-if="isEditingResult"
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
              >
                <h3 class="text-xl font-bold mb-4 dark:text-white">
                  Edit Match Result
                </h3>

                <div class="mb-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-center">
                      <p class="font-semibold dark:text-white">
                        {{ editingMatch?.homeTeam }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        (Home)
                      </p>
                    </div>

                    <div class="text-center">
                      <p class="font-semibold dark:text-white">vs</p>
                    </div>

                    <div class="text-center">
                      <p class="font-semibold dark:text-white">
                        {{ editingMatch?.awayTeam }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        (Away)
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-center space-x-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Home Score</label
                      >
                      <input
                        v-model.number="editHomeScore"
                        type="number"
                        min="0"
                        max="7"
                        class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div class="text-xl font-bold dark:text-white">-</div>

                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Away Score</label
                      >
                      <input
                        v-model.number="editAwayScore"
                        type="number"
                        min="0"
                        max="7"
                        class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                    @click="cancelEditMatch"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveMatchResult"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Save Result
                  </button>
                </div>
              </div>
            </div>

            <!-- No Matches -->
            <div
              v-else-if="teamMatches.length === 0"
              class="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              No match history available
            </div>

            <!-- Matches List -->
            <div v-else>
              <!-- Recent Form Display -->
              <div class="mb-6">
                <h4 class="text-lg font-medium mb-2 dark:text-white">
                  Recent Form
                </h4>
                <div class="flex space-x-3">
                  <span
                    v-for="(result, index) in selectedTeam.recentForm"
                    :key="index"
                    class="w-10 h-10 flex items-center justify-center text-white text-sm font-bold rounded-full"
                    :class="{
                      'bg-green-500': result === 'W',
                      'bg-red-500': result === 'L',
                      'bg-yellow-500': result === 'D',
                    }"
                  >
                    {{ result }}
                  </span>
                </div>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Most recent match on the right
                </p>
              </div>

              <!-- Match Statistics Summary -->
              <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 class="text-lg font-medium mb-3 dark:text-white">
                  Season Summary
                </h4>
                <div class="grid grid-cols-4 gap-4">
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Played
                    </p>
                    <p class="text-2xl font-bold dark:text-white">
                      {{ gamesPlayed(selectedTeam) }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Won</p>
                    <p
                      class="text-2xl font-bold text-green-600 dark:text-green-400"
                    >
                      {{ selectedTeam.wins }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Drawn
                    </p>
                    <p
                      class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                    >
                      {{ selectedTeam.draws }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Lost</p>
                    <p
                      class="text-2xl font-bold text-red-600 dark:text-red-400"
                    >
                      {{ selectedTeam.losses }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- All Matches Table -->
              <div class="overflow-x-auto">
                <table
                  class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Match
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Result
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr
                      v-for="match in teamMatches"
                      :key="match.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td
                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                      >
                        {{ match.date }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex items-center">
                          <span
                            :class="{ 'font-bold': match.isHome }"
                            class="text-gray-900 dark:text-white"
                          >
                            {{ match.homeTeam }}
                          </span>
                          <span class="mx-2 text-gray-500 dark:text-gray-400"
                            >vs</span
                          >
                          <span
                            :class="{ 'font-bold': !match.isHome }"
                            class="text-gray-900 dark:text-white"
                          >
                            {{ match.awayTeam }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex items-center space-x-2">
                          <span
                            class="text-gray-900 dark:text-white font-medium"
                          >
                            {{ match.homeScore }} - {{ match.awayScore }}
                          </span>
                          <span
                            class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
                            :class="{
                              'bg-green-500': match.result === 'W',
                              'bg-red-500': match.result === 'L',
                              'bg-yellow-500': match.result === 'D',
                            }"
                          >
                            {{ match.result }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <button
                          @click="startEditingMatch(match)"
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Edit Result
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
