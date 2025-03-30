<script setup>
const { team } = defineProps(['team']);
</script>

<template>
  <div>
    <h3 class="text-xl font-semibold mb-4 dark:text-white">Team Stats</h3>
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Tile label="Points" :value="team.points" />
      <Tile label="Goals Scored" :value="team.goalsFor" />
      <Tile label="Goals Conceded" :value="team.goalsAgainst" />
    </div>
  </div>
</template>
