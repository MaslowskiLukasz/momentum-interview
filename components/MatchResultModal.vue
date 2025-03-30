<script setup>
const { editingMatch } = defineProps(['editingMatch']);

const homeScore = defineModel('homeScore');
const awayScore = defineModel('awayScore');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
    >
      <h3 class="text-xl font-bold mb-4 dark:text-white">Edit Match Result</h3>

      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="text-center">
            <p class="font-semibold dark:text-white">
              {{ editingMatch?.homeTeam }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">(Home)</p>
          </div>

          <div class="text-center">
            <p class="font-semibold dark:text-white">vs</p>
          </div>

          <div class="text-center">
            <p class="font-semibold dark:text-white">
              {{ editingMatch?.awayTeam }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">(Away)</p>
          </div>
        </div>

        <div class="flex items-center justify-center space-x-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Home Score</label
            >
            <input
              v-model.number="homeScore"
              type="number"
              min="0"
              max="7"
              class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div class="text-xl font-bold dark:text-white">-</div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Away Score</label
            >
            <input
              v-model.number="awayScore"
              type="number"
              min="0"
              max="7"
              class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          @click="emit('save')"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Save Result
        </button>
      </div>
    </div>
  </div>
</template>
