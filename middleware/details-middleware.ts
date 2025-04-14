export default defineNuxtRouteMiddleware((to, _) => {
  const leagueStore = useLeagueStore();
  const { selectedTeam } = storeToRefs(leagueStore);

  if (to.path === '/details' && selectedTeam.value === null) {
    return navigateTo('/');
  }
});
