export const useEditTeamDetails = () => {
  const isEditingTeamDetails = ref(false);
  const editCoach = ref('');
  const editStadium = ref('');

  const teamsStore = useTeamsStore();
  const { selectedTeam, teams } = storeToRefs(teamsStore);

  const startEditingTeamDetails = () => {
    if (!selectedTeam.value) return;

    editCoach.value = selectedTeam.value.coach;
    editStadium.value = selectedTeam.value.stadium;
    isEditingTeamDetails.value = true;
  };

  const cancelEditTeamDetails = () => {
    editCoach.value = '';
    editStadium.value = '';
    isEditingTeamDetails.value = false;
  };

  const saveTeamDetails = () => {
    if (!selectedTeam.value) return;

    // Find the team in the teams array
    const teamIndex = teams.value.findIndex(
      (t) => t.id === selectedTeam.value.id
    );
    if (teamIndex === -1) return;

    // Update the team's coach and stadium
    teams.value[teamIndex].coach = editCoach.value;
    teams.value[teamIndex].stadium = editStadium.value;

    // Update the selected team
    selectedTeam.value.coach = editCoach.value;
    selectedTeam.value.stadium = editStadium.value;

    // Close the modal
    isEditingTeamDetails.value = false;
  };

  return {
    isEditingTeamDetails,
    editCoach,
    editStadium,
    startEditingTeamDetails,
    cancelEditTeamDetails,
    saveTeamDetails,
  };
};
