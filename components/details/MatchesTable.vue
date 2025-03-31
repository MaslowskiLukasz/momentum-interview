<script setup>
const { matches } = defineProps(['matches']);
const emit = defineEmits(['editMatch']);
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <TableHeader text="Date" :isHoverable="false" />
          <TableHeader text="Match" :isHoverable="false" />
          <TableHeader text="Result" :isHoverable="false" />
          <TableHeader text="Actions" :isHoverable="false" />
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <tr
          v-for="match in matches"
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
              <span class="mx-2 text-gray-500 dark:text-gray-400">vs</span>
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
          <td class="px-4 py-3 whitespace-nowrap">
            <Button
              label="Edit Result"
              type="ghost"
              @click="emit('editMatch', match)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
