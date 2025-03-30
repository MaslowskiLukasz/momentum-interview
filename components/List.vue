<script setup>
const { favoriteTeamId } = defineProps(['favoriteTeamId']);
const emit = defineEmits(['selectTeam', 'toggleFavoriteTeam']);

const store = useTeamsStore();
const { teams } = storeToRefs(store);

const sortBy = ref('position'); // Default sort field
const sortDirection = ref('asc'); // Default sort direction

const filteredAndSortedTeams = computed(() => {
  // First filter the teams
  let filtered = teams.value;

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
  return (team) => {
    return team.wins + team.draws + team.losses;
  };
});

function toggleSortDirection(field) {
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
            :isSorted="sortBy === 'position'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('position')"
          />
          <TableHeader
            text="Team"
            :isSorted="sortBy === 'name'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('name')"
          />
          <TableHeader
            text="Points"
            :isSorted="sortBy === 'points'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('points')"
          />
          <TableHeader text="Played" :isSorted="false" />
          <TableHeader
            text="W"
            :isSorted="sortBy === 'wins'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('wins')"
          />
          <TableHeader
            text="D"
            :isSorted="sortBy === 'draws'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('draws')"
          />
          <TableHeader
            text="L"
            :isSorted="sortBy === 'losses'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('losses')"
          />
          <TableHeader
            text="GF"
            :isSorted="sortBy === 'goalsFor'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('goalsFor')"
          />
          <TableHeader
            text="GA"
            :isSorted="sortBy === 'goalsAgainst'"
            :sortDirection="sortDirection"
            @toggleSort="toggleSortDirection('goalsAgainst')"
          />
          <TableHeader text="Form" :isSorted="false" />
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="team in filteredAndSortedTeams"
          :key="team.id"
          @click="emit('selectTeam', team)"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20': favoriteTeamId === team.id,
          }"
        >
          <TableCell :text="team.position" />
          <TableCell>
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ team.name }}
              </div>
              <!-- Favorite Star -->
              <FavoriteStar
                :isFavorite="favoriteTeamId === team.id"
                @toggleFavorite="emit('toggleFavoriteTeam', team)"
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
              <span
                v-for="(result, index) in team.recentForm"
                :key="index"
                class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
                :class="{
                  'bg-green-500': result === 'W',
                  'bg-red-500': result === 'L',
                  'bg-yellow-500': result === 'D',
                }"
              >
                {{ result }}
              </span>
            </div>
          </TableCell>
        </tr>
      </tbody>
    </table>
  </div>
</template>
