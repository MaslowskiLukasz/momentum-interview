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
      <div class="flex items-center space-x-2">
        <Calendar />
        <p class="dark:text-gray-300">
          <strong>Founded:</strong> {{ team.founded }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Building />
        <p class="dark:text-gray-300">
          <strong>Stadium:</strong> {{ team.stadium }}
          <button
            @click="emit('editTeamInfo')"
            class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Edit
          </button>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <User />
        <p class="dark:text-gray-300">
          <strong>Coach:</strong> {{ team.coach }}
        </p>
      </div>
    </div>
  </div>
</template>
