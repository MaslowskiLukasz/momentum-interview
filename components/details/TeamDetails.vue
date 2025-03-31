<script setup>
const { team } = defineProps(['team']);
const emit = defineEmits(['editTeamInfo']);
</script>

<template>
  <div>
    <div class="flex items-center mb-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ team.name }}
      </h2>
      <Pill>#{{ team.position }}</Pill>
    </div>

    <div class="space-y-3">
      <InfoItem label="Founded" :value="team.founded">
        <template #left><Calendar /></template>
      </InfoItem>
      <InfoItem label="Stadium" :value="team.stadium">
        <template #left><Building /></template>
        <template #right>
          <button
            @click="emit('editTeamInfo')"
            class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Edit
          </button>
        </template>
      </InfoItem>
      <InfoItem label="Coach" :value="team.coach">
        <template #left><User /></template>
      </InfoItem>
    </div>
  </div>
</template>
