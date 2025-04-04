<script setup>
const { favoriteTeamId, isLoadingMatches, teamMatches, selectedTeam } =
  defineProps([
    'favoriteTeamId',
    'isLoadingMatches',
    'teamMatches',
    'selectedTeam',
  ]);

const emit = defineEmits(['goBack', 'toggleFavoriteTeam']);

const {
  isEditingTeamDetails,
  editCoach,
  editStadium,
  startEditingTeamDetails,
  cancelEditTeamDetails,
  saveTeamDetails,
} = useEditTeamDetails();

const {
  isEditingResult,
  editHomeScore,
  editAwayScore,
  editingMatch,
  showEditSuccess,
  startEditingMatch,
  cancelEditMatch,
  saveMatchResult,
} = useEditResult();
</script>

<template>
  <div class="team-details py-6">
    <div class="flex justify-between items-center mb-6">
      <Button label="Back to Teams" type="ghost" @click="emit('goBack')">
        <template #left>
          <ArrowLeft />
        </template>
      </Button>
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
        <Loader v-if="isLoadingMatches" />
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
