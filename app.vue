<script setup>
const isLoading = ref(false);
const isLoadingMatches = ref(false);

const store = useLeagueStore();
const { allMatches, teamMatches, teams, selectedTeam } = storeToRefs(store);
const { getTeamMatches } = store;

const {
  favoriteTeamId,
  favoriteTeam,
  favoriteTeamRecentMatches,
  loadFavoriteTeam,
  toggleFavoriteTeam,
} = useFavoriteTeam();

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
  loadFavoriteTeam();
});
</script>

<template>
  <NuxtLayout>
    <main class="container mx-auto grow px-4 py-8">
      <Loader v-if="isLoading" />
      <List
        v-if="!selectedTeam && !isLoading"
        :favoriteTeamId="favoriteTeamId"
        @selectTeam="selectTeam"
        @toggleFavoriteTeam="toggleFavoriteTeam"
      />
      <FavoriteTeamSection
        v-if="favoriteTeam && !selectedTeam && !isLoading"
        :favoriteTeam="favoriteTeam"
        :favoriteTeamRecentMatches="favoriteTeamRecentMatches"
        @openDetails="selectTeam"
      />
      <Details
        v-else-if="selectedTeam"
        :favoriteTeamId="favoriteTeamId"
        :isLoadingMatches="isLoadingMatches"
        @goBack="selectedTeam = null"
        @toggleFavoriteTeam="toggleFavoriteTeam"
      />
    </main>
  </NuxtLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
  color-scheme: normal;
}
</style>
