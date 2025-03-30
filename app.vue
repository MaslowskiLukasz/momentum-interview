<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMatchesStore } from './stores/matches';

const isLoading = ref(false);
const isLoadingMatches = ref(false);
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
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color-scheme: normal;
}
</style>
