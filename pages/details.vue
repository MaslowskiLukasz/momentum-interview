<script lang="ts" setup>
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

async function goToList(): Promise<void> {
  await navigateTo('/');
  resetSelectedTeam();
}
</script>

<template>
  <Details
    :favorite-team-id="favoriteTeamId"
    :is-loading-matches="isLoadingMatches"
    :team-matches="teamMatches"
    :selected-team="selectedTeam"
    @go-back="goToList"
    @toggle-favorite-team="(team) => toggleFavoriteTeam(team)"
  />
</template>
