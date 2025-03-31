export default defineNuxtRouteMiddleware((to, from) => {
  const leagueStore = useLeagueStore();
  const { selectedTeam } = storeToRefs(leagueStore);

  if (to.path === '/details' && selectedTeam.value === null) {
    return navigateTo('/');
  }
});
