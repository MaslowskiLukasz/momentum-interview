<script lang="ts" setup>
const leagueStore = useLeagueStore();
const { teams } = storeToRefs(leagueStore);
const { selectTeam } = leagueStore;

const favoriteTeamStore = useFavoriteTeamStore();
const { favoriteTeamId, favoriteTeam, favoriteTeamRecentMatches } =
  storeToRefs(favoriteTeamStore);
const { toggleFavoriteTeam } = favoriteTeamStore;

async function goToDetails(team: TeamWithStats) {
  selectTeam(team);
  await navigateTo('/details');
}
</script>

<template>
  <div>
    <List
      :teams="teams"
      :favorite-team-id="favoriteTeamId"
      @select-team="(team) => goToDetails(team)"
      @toggle-favorite-team="(team) => toggleFavoriteTeam(team)"
    />
    <FavoriteTeamSection
      v-if="favoriteTeam"
      :favorite-team="favoriteTeam"
      :favorite-team-recent-matches="favoriteTeamRecentMatches"
      @open-details="(team) => goToDetails(team)"
    />
  </div>
</template>
