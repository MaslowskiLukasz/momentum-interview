<script setup>
const { favoriteTeamId, isLoadingMatches } = defineProps([
  'favoriteTeamId',
  'isLoadingMatches',
]);

const emit = defineEmits(['goBack', 'toggleFavoriteTeam']);

const matchesStore = useMatchesStore();
const teamsStore = useTeamsStore();

const { teamMatches } = storeToRefs(matchesStore);
const { teams, selectedTeam } = storeToRefs(teamsStore);

const isEditingTeamDetails = ref(false);
const editCoach = ref('');
const editStadium = ref('');

function startEditingTeamDetails() {
  if (!selectedTeam.value) return;

  editCoach.value = selectedTeam.value.coach;
  editStadium.value = selectedTeam.value.stadium;
  isEditingTeamDetails.value = true;
}

const {
  isEditingResult,
  editHomeScore,
  editAwayScore,
  editingMatch,
  showEditSuccess,
  startEditingMatch,
  cancelEditMatch,
  saveMatchResult,
} = useEditResultModal();

function cancelEditTeamDetails() {
  editCoach.value = '';
  editStadium.value = '';
  isEditingTeamDetails.value = false;
}

function saveTeamDetails() {
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

  // Show success message
  showEditSuccess.value = true;
  setTimeout(() => {
    showEditSuccess.value = false;
  }, 3000);

  // Close the modal
  isEditingTeamDetails.value = false;
}
</script>

<template>
  <div class="team-details py-6">
    <div class="flex justify-between items-center mb-6">
      <BackButton label="Back to Teams" @goBack="emit('goBack')" />
      <FavoriteButton
        :isFavorite="favoriteTeamId === selectedTeam.id"
        @toggleFavorite="emit('toggleFavoriteTeam', selectedTeam)"
      />
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <TeamDetailsHeader :team="selectedTeam" />
      <TeamInfo :team="selectedTeam" @editTeamInfo="startEditingTeamDetails" />
      <div class="p-6 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold mb-4 dark:text-white">All Matches</h3>
        <SuccessBanner v-if="showEditSuccess" />
        <div
          v-if="isLoadingMatches"
          class="flex justify-center items-center py-8"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
          ></div>
        </div>
        <NoMatches v-else-if="teamMatches.length === 0" />
        <div v-else>
          <RecentForm :matches="selectedTeam.recentForm" />
          <SeasonSummary :team="selectedTeam" />
          <MatchesTable
            :matches="teamMatches"
            @editMatch="(match) => startEditingMatch(match)"
          />
        </div>
      </div>
    </div>
  </div>

  <MatchResultModal
    v-if="isEditingResult"
    v-model:homeScore="editHomeScore"
    v-model:awayScore="editAwayScore"
    :editingMatch="editingMatch"
    @cancel="cancelEditMatch"
    @save="saveMatchResult"
  />

  <TeamDetailsModal
    v-if="isEditingTeamDetails"
    v-model:coach="editCoach"
    v-model:stadium="editStadium"
    @cancel="cancelEditTeamDetails"
    @save="saveTeamDetails"
  />
</template>
