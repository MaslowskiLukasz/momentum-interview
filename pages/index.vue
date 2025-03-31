<script setup>
const leagueStore = useLeagueStore();
const { selectTeam } = leagueStore;

const favoriteTeamStore = useFavoriteTeamStore();
const { favoriteTeamId, favoriteTeam, favoriteTeamRecentMatches } =
  storeToRefs(favoriteTeamStore);
const { toggleFavoriteTeam } = favoriteTeamStore;

async function goToDetails(team) {
  selectTeam(team);
  await navigateTo('/details');
}
</script>

<template>
  <div>
    <List
      :favoriteTeamId="favoriteTeamId"
      @selectTeam="goToDetails"
      @toggleFavoriteTeam="toggleFavoriteTeam"
    />
    <FavoriteTeamSection
      v-if="favoriteTeam"
      :favoriteTeam="favoriteTeam"
      :favoriteTeamRecentMatches="favoriteTeamRecentMatches"
      @openDetails="goToDetails"
    />
  </div>
</template>
