export const useFavoriteTeam = () => {
  const favoriteTeamId = ref(null);

  const teamsStore = useTeamsStore();
  const matchesStore = useMatchesStore();
  const { teams } = storeToRefs(teamsStore);
  const { getTeamMatches } = matchesStore;

  const loadFavoriteTeam = () => {
    const savedFavoriteTeamId = localStorage.getItem('favoriteTeamId');
    if (savedFavoriteTeamId) {
      favoriteTeamId.value = parseInt(savedFavoriteTeamId);
    }
  };

  const toggleFavoriteTeam = (team) => {
    if (favoriteTeamId.value === team.id) {
      favoriteTeamId.value = null;
      localStorage.removeItem('favoriteTeamId');
    } else {
      favoriteTeamId.value = team.id;
      localStorage.setItem('favoriteTeamId', team.id);
    }
  };

  const favoriteTeam = computed(() => {
    if (!favoriteTeamId.value || !teams.value.length) return null;
    return teams.value.find((team) => team.id === favoriteTeamId.value);
  });

  const favoriteTeamRecentMatches = computed(() => {
    if (!favoriteTeam.value) return [];
    return getTeamMatches(favoriteTeam.value.id, 5);
  });

  return {
    favoriteTeamId,
    favoriteTeam,
    favoriteTeamRecentMatches,
    loadFavoriteTeam,
    toggleFavoriteTeam,
  };
};
