<script setup>
const isLoading = ref(false);

const store = useLeagueStore();
const { allMatches, teams } = storeToRefs(store);

const favoriteTeamStore = useFavoriteTeamStore();
const { loadFavoriteTeam } = favoriteTeamStore;

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
      <NuxtPage v-else />
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
