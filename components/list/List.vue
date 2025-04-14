<script lang="ts" setup>
interface Props {
  favoriteTeamId: number | null;
  teams: TeamWithStats[];
}

const { favoriteTeamId, teams } = defineProps<Props>();
const emit = defineEmits<{
  selectTeam: [team: TeamWithStats];
  toggleFavoriteTeam: [team: TeamWithStats];
}>();

const sortBy = ref<SortField>('position'); // Default sort field
const sortDirection = ref<SortDirection>('asc'); // Default sort direction

const filteredAndSortedTeams = computed<TeamWithStats[]>(() => {
  // First filter the teams
  const filtered = teams;

  // Then sort the filtered results
  return [...filtered].sort((a, b) => {
    let comparison = 0;

    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy.value === 'points') {
      comparison = a.points - b.points;
    } else if (sortBy.value === 'wins') {
      comparison = a.wins - b.wins;
    } else if (sortBy.value === 'draws') {
      comparison = a.draws - b.draws;
    } else if (sortBy.value === 'losses') {
      comparison = a.losses - b.losses;
    } else if (sortBy.value === 'goalsFor') {
      comparison = a.goalsFor - b.goalsFor;
    } else if (sortBy.value === 'goalsAgainst') {
      comparison = a.goalsAgainst - b.goalsAgainst;
    } else {
      // Default sort by position
      comparison = a.position - b.position;
    }

    // Reverse for descending order
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

// Computed property to calculate games played for each team
const gamesPlayed = computed(() => {
  return (team: TeamWithStats) => {
    return team.wins + team.draws + team.losses;
  };
});

function toggleSortDirection(field: SortField): void {
  if (sortBy.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new field and reset direction to ascending
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8"
  >
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <TableHeader
            text="Pos"
            :is-sorted="sortBy === 'position'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('position')"
          />
          <TableHeader
            text="Team"
            :is-sorted="sortBy === 'name'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('name')"
          />
          <TableHeader
            text="Points"
            :is-sorted="sortBy === 'points'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('points')"
          />
          <TableHeader text="Played" :is-sorted="false" />
          <TableHeader
            text="W"
            :is-sorted="sortBy === 'wins'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('wins')"
          />
          <TableHeader
            text="D"
            :is-sorted="sortBy === 'draws'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('draws')"
          />
          <TableHeader
            text="L"
            :is-sorted="sortBy === 'losses'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('losses')"
          />
          <TableHeader
            text="GF"
            :is-sorted="sortBy === 'goalsFor'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('goalsFor')"
          />
          <TableHeader
            text="GA"
            :is-sorted="sortBy === 'goalsAgainst'"
            :sort-direction="sortDirection"
            @toggle-sort="toggleSortDirection('goalsAgainst')"
          />
          <TableHeader text="Form" :is-sorted="false" />
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="team in filteredAndSortedTeams"
          :key="team.id"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20': favoriteTeamId === team.id,
          }"
          @click="emit('selectTeam', team)"
        >
          <TableCell :text="team.position" />
          <TableCell>
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ team.name }}
              </div>
              <FavoriteStar
                :is-favorite="favoriteTeamId === team.id"
                @toggle-favorite="emit('toggleFavoriteTeam', team)"
              />
            </div>
          </TableCell>
          <TableCell :text="team.points" />
          <TableCell :text="gamesPlayed(team)" />
          <TableCell :text="team.wins" />
          <TableCell :text="team.draws" />
          <TableCell :text="team.losses" />
          <TableCell :text="team.goalsFor" />
          <TableCell :text="team.goalsAgainst" />
          <TableCell>
            <div class="flex space-x-1">
              <MatchResult
                v-for="(result, index) in team.recentForm"
                :key="index"
                :result="result"
              />
            </div>
          </TableCell>
        </tr>
      </tbody>
    </table>
  </div>
</template>
