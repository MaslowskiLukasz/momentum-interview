<script setup>
const { team } = defineProps(['team']);
const emit = defineEmits(['editTeamInfo']);
</script>

<template>
  <div class="p-6">
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-start gap-6"
    >
      <TeamDetails :team="team" @editTeamInfo="emit('editTeamInfo')" />
      <TeamStats :team="team" />
    </div>
  </div>
</template>
