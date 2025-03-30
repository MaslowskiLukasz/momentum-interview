<script setup>
const { editingMatch } = defineProps(['editingMatch']);

const homeScore = defineModel('homeScore');
const awayScore = defineModel('awayScore');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <Modal title="Edit Match Result">
    <template #content>
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
          <ScoreInput label="Home Score" v-model="homeScore" />
          <div class="text-xl font-bold dark:text-white">-</div>
          <ScoreInput label="Away Score" v-model="awayScore" />
        </div>
      </div>
    </template>
    <template #controls>
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
    </template>
  </Modal>
</template>
