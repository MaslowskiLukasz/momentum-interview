<script setup>
const coach = defineModel('coach');
const stadium = defineModel('stadium');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
    >
      <h3 class="text-xl font-bold mb-4 dark:text-white">Edit Team Details</h3>

      <div class="space-y-4 mb-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Coach</label
          >
          <input
            v-model="coach"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Coach name"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Stadium</label
          >
          <input
            v-model="stadium"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Stadium name"
          />
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
          Save Details
        </button>
      </div>
    </div>
  </div>
</template>
