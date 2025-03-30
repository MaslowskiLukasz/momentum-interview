<script setup>
const { team } = defineProps(['team']);

const gamesPlayed = computed(() => {
  return team.wins + team.draws + team.losses;
});
</script>

<template>
  <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
    <h4 class="text-lg font-medium mb-3 dark:text-white">Season Summary</h4>
    <div class="grid grid-cols-4 gap-4">
      <SummaryItem label="Played" :value="gamesPlayed" />
      <SummaryItem
        label="Won"
        :value="team.wins"
        color="text-green-600 dark:text-green-400"
      />
      <SummaryItem
        label="Draw"
        :value="team.draws"
        color="text-yellow-600 dark:text-yellow-400"
      />
      <SummaryItem
        label="Lost"
        :value="team.losses"
        color="text-red-600 dark:text-red-400"
      />
    </div>
  </div>
</template>
