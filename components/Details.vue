<script setup>
const { favoriteTeamId, isLoadingMatches } = defineProps([
  'favoriteTeamId',
  'isLoadingMatches',
]);

const emit = defineEmits(['goBack', 'toggleFavoriteTeam']);

const matchesStore = useMatchesStore();
const teamsStore = useTeamsStore();

const { allMatches, teamMatches } = storeToRefs(matchesStore);
const { teams, selectedTeam } = storeToRefs(teamsStore);

const isEditingResult = ref(false);
const editHomeScore = ref(0);
const editAwayScore = ref(0);
const editingMatch = ref(null);
const showEditSuccess = ref(false);
const isEditingTeamDetails = ref(false);
const editCoach = ref('');
const editStadium = ref('');

const gamesPlayed = computed(() => {
  return (team) => {
    return team.wins + team.draws + team.losses;
  };
});

function startEditingTeamDetails() {
  if (!selectedTeam.value) return;

  editCoach.value = selectedTeam.value.coach;
  editStadium.value = selectedTeam.value.stadium;
  isEditingTeamDetails.value = true;
}

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
</script>

<template>
  <div class="team-details py-6">
    <div class="flex justify-between items-center mb-6">
      <BackButton label="Back to Teams" @goBack="emit('goBack')" />
      <FavoriteButton
        :isFavorite="favoriteTeamId === selectedTeam.id"
        @toggleFavorite="emit('toggleFavoriteTeam', selectedTeam)"
      />
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <TeamDetailsHeader />

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
        <h3 class="text-xl font-semibold mb-4 dark:text-white">All Matches</h3>

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
          Match result updated successfully! Standings have been recalculated.
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
        <MatchResultModal
          v-if="isEditingResult"
          v-model:homeScore="editHomeScore"
          v-model:awayScore="editAwayScore"
          :editingMatch="editingMatch"
          @cancel="cancelEditMatch"
          @save="saveMatchResult"
        />

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
                <p class="text-sm text-gray-500 dark:text-gray-400">Played</p>
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
                <p class="text-sm text-gray-500 dark:text-gray-400">Drawn</p>
                <p
                  class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                >
                  {{ selectedTeam.draws }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">Lost</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">
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
                      <span class="text-gray-900 dark:text-white font-medium">
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

  <!-- Add this modal for editing team details -->
  <TeamDetailsModal
    v-if="isEditingTeamDetails"
    v-model:coach="editCoach"
    v-model:stadium="editStadium"
    @cancel="cancelEditTeamDetails"
    @save="saveTeamDetails"
  />
</template>
