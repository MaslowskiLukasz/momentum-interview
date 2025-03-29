<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMatchesStore } from './stores/matches';

const isLoading = ref(false);
const isLoadingMatches = ref(false);
const showEditSuccess = ref(false);
const isEditingTeamDetails = ref(false);
const editCoach = ref('');
const editStadium = ref('');
const favoriteTeamId = ref(null);

const teamsStore = useTeamsStore();
const { teams, selectedTeam } = storeToRefs(teamsStore);

const matchesStore = useMatchesStore();
const { allMatches, teamMatches } = storeToRefs(matchesStore);
const { getTeamMatches } = matchesStore;

// Add a new computed property for favorite team data
const favoriteTeam = computed(() => {
  if (!favoriteTeamId.value || !teams.value.length) return null;
  return teams.value.find((team) => team.id === favoriteTeamId.value);
});

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

onMounted(() => {
  fetchTeams();

  // Load favorite team from local storage
  const savedFavoriteTeamId = localStorage.getItem('favoriteTeamId');
  if (savedFavoriteTeamId) {
    favoriteTeamId.value = parseInt(savedFavoriteTeamId);
  }
});

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
        :favoriteTeamId="favoriteTeamId"
        :isLoadingMatches="isLoadingMatches"
        @goBack="selectedTeam = null"
        @toggleFavoriteTeam="toggleFavoriteTeam"
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
