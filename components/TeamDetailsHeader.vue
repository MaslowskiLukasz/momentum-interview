<script setup>
const store = useTeamsStore();
const { selectedTeam } = storeToRefs(store);
</script>

<template>
  <div class="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
    <h2 class="text-3xl font-bold">{{ selectedTeam.name }}</h2>
    <p class="text-blue-100">
      Position: #{{ selectedTeam.position }} • Points:
      {{ selectedTeam.points }}
    </p>
  </div>
</template>
