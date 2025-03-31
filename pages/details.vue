<script setup>
definePageMeta({
  middleware: ['details-middleware'],
});

const leagueStore = useLeagueStore();
const { isLoadingMatches, teamMatches, selectedTeam } =
  storeToRefs(leagueStore);
const { resetSelectedTeam } = leagueStore;

const favoriteTeamStore = useFavoriteTeamStore();
const { favoriteTeamId } = storeToRefs(favoriteTeamStore);
const { toggleFavoriteTeam } = favoriteTeamStore;

async function goToList() {
  resetSelectedTeam();
  await navigateTo('/');
}
</script>

<template>
  <Details
    :favoriteTeamId="favoriteTeamId"
    :isLoadingMatches="isLoadingMatches"
    :teamMatches="teamMatches"
    :selectedTeam="selectedTeam"
    @goBack="goToList"
    @toggleFavoriteTeam="toggleFavoriteTeam"
  />
</template>
