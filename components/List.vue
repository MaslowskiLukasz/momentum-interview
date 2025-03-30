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

function selectTeam(team) {
  emit('selectTeam', team);
}

function toggleFavoriteTeam(team) {
  emit('toggleFavoriteTeam', team);
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8"
  >
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('position')"
          >
            <div class="flex items-center space-x-1">
              <span>Pos</span>
              <SortChevron
                v-if="sortBy === 'position'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('name')"
          >
            <div class="flex items-center space-x-1">
              <span>Team</span>
              <SortChevron
                v-if="sortBy === 'name'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('points')"
          >
            <div class="flex items-center space-x-1">
              <span>Points</span>
              <SortChevron
                v-if="sortBy === 'points'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            <div class="flex items-center space-x-1">
              <span>Played</span>
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('wins')"
          >
            <div class="flex items-center space-x-1">
              <span>W</span>
              <SortChevron
                v-if="sortBy === 'wins'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('draws')"
          >
            <div class="flex items-center space-x-1">
              <span>D</span>
              <SortChevron
                v-if="sortBy === 'draws'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('losses')"
          >
            <div class="flex items-center space-x-1">
              <span>L</span>
              <SortChevron
                v-if="sortBy === 'losses'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('goalsFor')"
          >
            <div class="flex items-center space-x-1">
              <span>GF</span>
              <SortChevron
                v-if="sortBy === 'goalsFor'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="toggleSortDirection('goalsAgainst')"
          >
            <div class="flex items-center space-x-1">
              <span>GA</span>
              <SortChevron
                v-if="sortBy === 'goalsAgainst'"
                :direction="sortDirection"
              />
            </div>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
          >
            Form
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="team in filteredAndSortedTeams"
          :key="team.id"
          @click="selectTeam(team)"
          class="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          :class="{
            'bg-blue-50 dark:bg-blue-900/20': favoriteTeamId === team.id,
          }"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.position }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ team.name }}
              </div>
              <!-- Favorite Star -->
              <button
                @click.stop="toggleFavoriteTeam(team)"
                class="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{
                  'bg-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                    favoriteTeamId === team.id,
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
                    favoriteTeamId !== team.id,
                }"
                title="Set as favorite team"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.points }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ gamesPlayed(team) }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.wins }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.draws }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.losses }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.goalsFor }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ team.goalsAgainst }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
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
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
