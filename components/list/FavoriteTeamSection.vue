<script setup>
const { favoriteTeam, favoriteTeamRecentMatches } = defineProps([
  'favoriteTeam',
  'favoriteTeamRecentMatches',
]);

const emit = defineEmits(['openDetails']);

function selectTeam(team) {
  emit('openDetails', team);
}
</script>

<template>
  <div class="mb-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div
        class="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-blue-800 dark:text-blue-200">
            <span class="mr-2">⭐</span> {{ favoriteTeam.name }} - Recent Form
          </h2>
          <button
            @click="selectTeam(favoriteTeam)"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View Full Details
          </button>
        </div>
      </div>

      <div class="p-6">
        <NoMatches v-if="favoriteTeamRecentMatches.length === 0">
          No recent matches available
        </NoMatches>
        <div v-else>
          <!-- Recent Form Display -->
          <div class="mt-2">
            <div class="flex space-x-3">
              <MatchResult
                v-for="(match, index) in favoriteTeamRecentMatches"
                :key="index"
                :result="match.result"
                :size="10"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Most recent match on the right
            </p>
          </div>

          <!-- Recent Matches Table -->
          <div class="mt-6 overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Match
                  </th>
                  <th
                    scope="col"
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Result
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr
                  v-for="match in favoriteTeamRecentMatches"
                  :key="match.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ match.date }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <span
                        :class="{ 'font-bold': match.isHome }"
                        class="text-gray-900 dark:text-white"
                      >
                        {{ match.homeTeam }}
                      </span>
                      <span class="mx-2 text-gray-500 dark:text-gray-400"
                        >vs</span
                      >
                      <span
                        :class="{ 'font-bold': !match.isHome }"
                        class="text-gray-900 dark:text-white"
                      >
                        {{ match.awayTeam }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <span class="text-gray-900 dark:text-white font-medium">
                        {{ match.homeScore }} - {{ match.awayScore }}
                      </span>
                      <MatchResult :result="match.result" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
