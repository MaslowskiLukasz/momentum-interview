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
      <Button label="Cancel" type="secondary" @click="emit('cancel')" />
      <Button label="Save Result" type="primary" @click="emit('save')" />
    </template>
  </Modal>
</template>
